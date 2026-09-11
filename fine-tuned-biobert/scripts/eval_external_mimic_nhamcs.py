#!/usr/bin/env python3
"""External evaluation on MIMIC-IV-ED (+ demo fallback) and NHAMCS 2018–22.

Triagegeist is used for training/validation only. Published metrics come from
these external sets. Pre-processing (locked):
  - drop empty / NaN / whitespace-only complaints
  - keep gold acuity in {1,2,3,4,5}
  - do not expand nursing abbreviations
  - truncate/pad to M=128 via the BioBERT tokenizer

Usage:
  curatio/server/.venv/bin/python fine-tuned-biobert/scripts/eval_external_mimic_nhamcs.py

Environment:
  MIMIC_TRIAGE_CSV  optional path to full MIMIC-IV-ED triage.csv (.gz ok)
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import time
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns
from sklearn.metrics import (
    classification_report,
    confusion_matrix,
    f1_score,
    precision_recall_fscore_support,
)
from transformers import AutoModelForSequenceClassification, AutoTokenizer, pipeline

ROOT = Path(__file__).resolve().parents[1]
PROJECT = ROOT.parent
OUT_DIR = PROJECT / "results" / "eval_outputs_external"
THESIS_FIG = PROJECT / "final_thesis_v1" / "figures" / "ch4"

BASELINE_MODEL = (
    ROOT
    / "fine_tuned_biobert_triage-20260602T132911Z-3-001"
    / "fine_tuned_biobert_triage"
)
OVERSAMPLE_MODEL = ROOT / "fine_tuned_biobert_triage_smote"

DEFAULT_NHAMCS = ROOT / "external_data" / "nhamcs" / "nhamcs_data_2018_22.csv"
DEFAULT_MIMIC_DEMO = ROOT / "external_data" / "mimic_iv_ed" / "triage_demo.csv"
DEFAULT_MIMIC_FULL = ROOT / "external_data" / "mimic_iv_ed" / "triage.csv"

SATS_BY_LEVEL = {1: "Red", 2: "Orange", 3: "Yellow", 4: "Green", 5: "Green"}
COLOUR_ORDER = ["Red", "Orange", "Yellow", "Green"]
LEVEL_NAMES = {1: "L1", 2: "L2", 3: "L3", 4: "L4", 5: "L5"}


def f_sats(level: int) -> str:
    return SATS_BY_LEVEL[int(level)]


def _cuda_available() -> bool:
    try:
        import torch

        return torch.cuda.is_available()
    except ImportError:
        return False


def load_classifier(model_path: Path):
    if not model_path.exists():
        raise FileNotFoundError(f"Model not found: {model_path}")
    tokenizer = AutoTokenizer.from_pretrained(str(model_path))
    model = AutoModelForSequenceClassification.from_pretrained(str(model_path))
    device = 0 if _cuda_available() else -1
    return pipeline(
        "text-classification",
        model=model,
        tokenizer=tokenizer,
        device=device,
        top_k=None,
    )


def predict_levels(clf, texts: list[str], batch_size: int = 64):
    preds: list[int] = []
    confidences: list[float] = []
    latencies: list[float] = []
    # Prefer raw model forward for CPU throughput
    model = clf.model
    tokenizer = clf.tokenizer
    import torch

    device = next(model.parameters()).device
    model.eval()
    with torch.no_grad():
        for i in range(0, len(texts), batch_size):
            batch = texts[i : i + batch_size]
            start = time.perf_counter()
            enc = tokenizer(
                batch,
                truncation=True,
                max_length=128,
                padding=True,
                return_tensors="pt",
            )
            enc = {k: v.to(device) for k, v in enc.items()}
            logits = model(**enc).logits
            probs = torch.softmax(logits, dim=-1)
            conf, pred_idx = probs.max(dim=-1)
            latencies.append((time.perf_counter() - start) * 1000 / max(len(batch), 1))
            preds.extend((pred_idx.cpu().numpy() + 1).tolist())
            confidences.extend(conf.cpu().numpy().tolist())
    return np.array(preds), np.array(confidences), latencies


def stratified_sample(df: pd.DataFrame, n: int, seed: int = 42) -> pd.DataFrame:
    if n <= 0 or n >= len(df):
        return df
    # proportional sample per class, at least 1 when available
    parts = []
    counts = df["acuity"].value_counts()
    remaining = n
    levels = sorted(counts.index.tolist())
    for i, lev in enumerate(levels):
        share = int(round(n * counts[lev] / len(df)))
        if i == len(levels) - 1:
            share = remaining
        share = max(1, min(share, counts[lev], remaining))
        parts.append(df[df["acuity"] == lev].sample(n=share, random_state=seed))
        remaining -= share
        if remaining <= 0:
            break
    out = pd.concat(parts, ignore_index=True)
    if len(out) > n:
        out = out.sample(n=n, random_state=seed)
    return out.reset_index(drop=True)


def clean_text_acuity(df: pd.DataFrame, text_col: str, acuity_col: str) -> pd.DataFrame:
    out = df[[text_col, acuity_col]].copy()
    out[text_col] = out[text_col].astype(str).str.strip()
    out = out[out[text_col].ne("") & out[text_col].str.lower().ne("nan")]
    out[acuity_col] = pd.to_numeric(out[acuity_col], errors="coerce")
    out = out[out[acuity_col].isin([1, 2, 3, 4, 5])]
    out[acuity_col] = out[acuity_col].astype(int)
    return out.rename(columns={text_col: "text", acuity_col: "acuity"}).reset_index(drop=True)


def load_nhamcs(path: Path) -> tuple[pd.DataFrame, dict]:
    raw_n = sum(1 for _ in open(path, encoding="utf-8", errors="ignore")) - 1
    df = pd.read_csv(path, usecols=["chief_complaint_text", "target_triage_acuity"])
    cleaned = clean_text_acuity(df, "chief_complaint_text", "target_triage_acuity")
    meta = {
        "source": "NHAMCS 2018-22 (processed)",
        "path": str(path),
        "n_raw": int(raw_n),
        "n_retained": int(len(cleaned)),
        "preprocess": [
            "drop empty/NaN/whitespace chief_complaint_text",
            "keep target_triage_acuity in {1..5}",
            "no abbreviation expansion",
            "tokenize truncate/pad M=128",
        ],
    }
    return cleaned, meta


def resolve_mimic_path(cli_path: Path | None) -> tuple[Path, str]:
    env = os.getenv("MIMIC_TRIAGE_CSV", "").strip()
    candidates = []
    if cli_path:
        candidates.append(cli_path)
    if env:
        candidates.append(Path(env))
    candidates.extend([DEFAULT_MIMIC_FULL, DEFAULT_MIMIC_FULL.with_suffix(".csv.gz"), DEFAULT_MIMIC_DEMO])
    for p in candidates:
        if p and p.exists():
            kind = "full" if "demo" not in p.name.lower() else "demo"
            if p == DEFAULT_MIMIC_FULL or (env and "demo" not in Path(env).name.lower()):
                if p.exists() and "demo" not in p.name.lower():
                    kind = "full"
            if "demo" in p.name.lower():
                kind = "demo"
            return p, kind
    raise FileNotFoundError(
        "No MIMIC triage.csv found. Place full MIMIC-IV-ED triage.csv under "
        f"{DEFAULT_MIMIC_FULL} or set MIMIC_TRIAGE_CSV. Demo fallback: {DEFAULT_MIMIC_DEMO}"
    )


def load_mimic(path: Path, kind: str) -> tuple[pd.DataFrame, dict]:
    if str(path).endswith(".gz"):
        df = pd.read_csv(path, compression="gzip")
    else:
        df = pd.read_csv(path)
    # schema: chiefcomplaint, acuity
    text_col = "chiefcomplaint" if "chiefcomplaint" in df.columns else "chief_complaint"
    acuity_col = "acuity" if "acuity" in df.columns else "triage_acuity"
    cleaned = clean_text_acuity(df, text_col, acuity_col)
    meta = {
        "source": f"MIMIC-IV-ED ({kind})",
        "path": str(path),
        "n_raw": int(len(df)),
        "n_retained": int(len(cleaned)),
        "kind": kind,
        "preprocess": [
            "drop empty/NaN/whitespace chiefcomplaint",
            "keep acuity in {1..5}",
            "no abbreviation expansion (CP/SOB left as written)",
            "tokenize truncate/pad M=128",
        ],
    }
    return cleaned, meta


def class_support(y: np.ndarray) -> dict[str, int]:
    return {f"N_L{k}": int((y == k).sum()) for k in range(1, 6)}


def under_over_triage(y_true: np.ndarray, y_pred: np.ndarray) -> dict:
    # lower number = more urgent
    under = float((y_pred > y_true).mean())
    over = float((y_pred < y_true).mean())
    true_colour = np.array([f_sats(int(t)) for t in y_true])
    pred_colour = np.array([f_sats(int(p)) for p in y_pred])
    colour_acc = float((true_colour == pred_colour).mean())
    # critical under-triage
    red_mask = true_colour == "Red"
    orange_mask = true_colour == "Orange"
    crit_red = float(((pred_colour != "Red") & red_mask).sum() / max(red_mask.sum(), 1))
    crit_orange = float(
        (np.isin(pred_colour, ["Yellow", "Green"]) & orange_mask).sum()
        / max(orange_mask.sum(), 1)
    )
    return {
        "under_triage_rate": under,
        "over_triage_rate": over,
        "colour_accuracy": colour_acc,
        "critical_under_triage_red_to_nonred": crit_red,
        "critical_under_triage_orange_to_yellow_green": crit_orange,
        "n_true_red": int(red_mask.sum()),
        "n_true_orange": int(orange_mask.sum()),
    }


def summarize(y_true: np.ndarray, y_pred: np.ndarray, confidences: np.ndarray) -> dict:
    labels = [1, 2, 3, 4, 5]
    # map to 0-index for sklearn
    yt = y_true - 1
    yp = y_pred - 1
    precision, recall, f1, support = precision_recall_fscore_support(
        yt, yp, labels=[0, 1, 2, 3, 4], zero_division=0
    )
    metrics = {
        "accuracy": float((y_true == y_pred).mean()),
        "macro_f1": float(f1_score(yt, yp, average="macro", zero_division=0)),
        "mean_confidence": float(np.mean(confidences)),
        "support": class_support(y_true),
    }
    for i, lev in enumerate(labels):
        metrics[f"precision_L{lev}"] = float(precision[i])
        metrics[f"recall_L{lev}"] = float(recall[i])
        metrics[f"f1_L{lev}"] = float(f1[i])
        metrics[f"support_L{lev}"] = int(support[i])
    metrics.update(under_over_triage(y_true, y_pred))
    return metrics


def plot_confusion_levels(y_true, y_pred, title: str, out_path: Path):
    labels = [1, 2, 3, 4, 5]
    cm = confusion_matrix(y_true, y_pred, labels=labels)
    names = [LEVEL_NAMES[i] for i in labels]
    fig, ax = plt.subplots(figsize=(7.5, 6))
    sns.heatmap(cm, annot=True, fmt="d", cmap="Greens", xticklabels=names, yticklabels=names, ax=ax)
    ax.set_xlabel("Predicted acuity")
    ax.set_ylabel("True acuity")
    ax.set_title(title)
    plt.tight_layout()
    out_path.parent.mkdir(parents=True, exist_ok=True)
    fig.savefig(out_path, dpi=150)
    # also PDF for thesis
    if out_path.suffix == ".png":
        fig.savefig(out_path.with_suffix(".pdf"), dpi=150)
    plt.close(fig)
    return cm


def evaluate_on_frame(
    name: str,
    model_path: Path,
    df: pd.DataFrame,
    dataset_slug: str,
    output_dir: Path,
) -> dict:
    print(f"\n=== {name} on {dataset_slug} (N={len(df):,}) ===")
    support = class_support(df["acuity"].to_numpy())
    print("Class support:", support)
    clf = load_classifier(model_path)
    y_true = df["acuity"].to_numpy()
    y_pred, confidences, latencies = predict_levels(clf, df["text"].tolist())
    metrics = summarize(y_true, y_pred, confidences)
    metrics["latency_ms"] = {
        "p50": float(np.percentile(latencies, 50)),
        "p95": float(np.percentile(latencies, 95)),
        "mean_per_sample": float(np.mean(latencies)),
    }
    metrics["n_eval"] = int(len(df))
    metrics["model_path"] = str(model_path)
    metrics["model_name"] = name
    metrics["dataset"] = dataset_slug
    print(
        classification_report(
            y_true,
            y_pred,
            labels=[1, 2, 3, 4, 5],
            target_names=[LEVEL_NAMES[i] for i in range(1, 6)],
            zero_division=0,
        )
    )
    slug = f"{dataset_slug}_{name.lower().replace(' ', '_')}"
    cm = plot_confusion_levels(
        y_true,
        y_pred,
        f"{name} — {dataset_slug}",
        output_dir / f"{slug}_confusion.png",
    )
    # copy PDF into thesis figures
    thesis_pdf = THESIS_FIG / f"{slug}_confusion.pdf"
    THESIS_FIG.mkdir(parents=True, exist_ok=True)
    if (output_dir / f"{slug}_confusion.pdf").exists():
        thesis_pdf.write_bytes((output_dir / f"{slug}_confusion.pdf").read_bytes())
    metrics["confusion_matrix"] = cm.tolist()
    with open(output_dir / f"{slug}_metrics.json", "w", encoding="utf-8") as f:
        json.dump(metrics, f, indent=2)
    return metrics


def triagegeist_dedup_report(train_csv: Path, complaints_csv: Path, out_path: Path) -> dict:
    train = pd.read_csv(train_csv)
    comp = pd.read_csv(complaints_csv)
    df = train.merge(comp, on="patient_id")
    text_col = "chief_complaint_raw"
    df = df.dropna(subset=[text_col, "triage_acuity"])
    texts = df[text_col].astype(str).str.strip().str.lower()
    n = len(texts)
    n_unique = int(texts.nunique())
    dup_rate = 1.0 - n_unique / max(n, 1)
    # near-template: same text with count >= 5
    vc = texts.value_counts()
    templates = int((vc >= 5).sum())
    report = {
        "n_rows": n,
        "n_unique_normalized_text": n_unique,
        "duplicate_rate": float(dup_rate),
        "texts_with_count_ge_5": templates,
        "note": "High duplication helps explain inflated in-distribution accuracy; not a published test metric.",
    }
    out_path.write_text(json.dumps(report, indent=2), encoding="utf-8")
    print("Triagegeist dedup:", report)
    return report


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--nhamcs-csv", type=Path, default=DEFAULT_NHAMCS)
    parser.add_argument("--mimic-csv", type=Path, default=None)
    parser.add_argument("--baseline-model", type=Path, default=BASELINE_MODEL)
    parser.add_argument("--oversample-model", type=Path, default=OVERSAMPLE_MODEL)
    parser.add_argument("--output-dir", type=Path, default=OUT_DIR)
    parser.add_argument("--skip-mimic", action="store_true")
    parser.add_argument("--skip-nhamcs", action="store_true")
    parser.add_argument("--max-rows", type=int, default=0, help="Optional stratified cap (0=all)")
    parser.add_argument("--batch-size", type=int, default=64)
    args = parser.parse_args()
    args.output_dir.mkdir(parents=True, exist_ok=True)

    # Dedup diagnostics on Triagegeist (not published accuracy)
    train_csv = ROOT / "csv files" / "train.csv"
    complaints_csv = ROOT / "csv files" / "chief_complaints.csv"
    if train_csv.exists() and complaints_csv.exists():
        triagegeist_dedup_report(
            train_csv, complaints_csv, args.output_dir / "triagegeist_dedup.json"
        )

    summary: dict = {"datasets": {}, "models": {}}

    frames: list[tuple[str, pd.DataFrame, dict]] = []
    if not args.skip_nhamcs:
        if not args.nhamcs_csv.exists():
            print(f"ERROR: missing NHAMCS at {args.nhamcs_csv}", file=sys.stderr)
            return 1
        nh_df, nh_meta = load_nhamcs(args.nhamcs_csv)
        if args.max_rows > 0:
            nh_df = stratified_sample(nh_df, args.max_rows)
            nh_meta["n_retained"] = len(nh_df)
            nh_meta["sampling"] = f"stratified subsample N={args.max_rows}, seed=42"
        print("NHAMCS retained N=", len(nh_df), "support", class_support(nh_df["acuity"].to_numpy()))
        frames.append(("nhamcs", nh_df, nh_meta))
        summary["datasets"]["nhamcs"] = {**nh_meta, "support": class_support(nh_df["acuity"].to_numpy())}

    if not args.skip_mimic:
        try:
            mimic_path, kind = resolve_mimic_path(args.mimic_csv)
            m_df, m_meta = load_mimic(mimic_path, kind)
            if args.max_rows > 0 and len(m_df) > args.max_rows:
                m_df = stratified_sample(m_df, args.max_rows)
                m_meta["n_retained"] = len(m_df)
                m_meta["sampling"] = f"stratified subsample N={args.max_rows}, seed=42"
            print("MIMIC retained N=", len(m_df), "kind=", kind, "support", class_support(m_df["acuity"].to_numpy()))
            frames.append((f"mimic_{kind}", m_df, m_meta))
            summary["datasets"][f"mimic_{kind}"] = {
                **m_meta,
                "support": class_support(m_df["acuity"].to_numpy()),
            }
        except FileNotFoundError as exc:
            print(f"WARNING: {exc}", file=sys.stderr)

    model_specs = [
        ("Baseline", args.baseline_model),
        ("Oversample", args.oversample_model),
    ]

    all_metrics = []
    for dataset_slug, df, meta in frames:
        for model_name, model_path in model_specs:
            if not model_path.exists():
                print(f"WARNING: skip missing model {model_path}", file=sys.stderr)
                continue
            # monkey-patch batch via closure: re-bind predict inside evaluate
            global_predict = predict_levels

            def _eval_with_bs(name, model_path, df, dataset_slug, output_dir, bs=args.batch_size):
                print(f"\n=== {name} on {dataset_slug} (N={len(df):,}) ===")
                support = class_support(df["acuity"].to_numpy())
                print("Class support:", support)
                clf = load_classifier(model_path)
                y_true = df["acuity"].to_numpy()
                y_pred, confidences, latencies = global_predict(clf, df["text"].tolist(), batch_size=bs)
                metrics = summarize(y_true, y_pred, confidences)
                metrics["latency_ms"] = {
                    "p50": float(np.percentile(latencies, 50)),
                    "p95": float(np.percentile(latencies, 95)),
                    "mean_per_sample": float(np.mean(latencies)),
                }
                metrics["n_eval"] = int(len(df))
                metrics["model_path"] = str(model_path)
                metrics["model_name"] = name
                metrics["dataset"] = dataset_slug
                print(
                    classification_report(
                        y_true,
                        y_pred,
                        labels=[1, 2, 3, 4, 5],
                        target_names=[LEVEL_NAMES[i] for i in range(1, 6)],
                        zero_division=0,
                    )
                )
                slug = f"{dataset_slug}_{name.lower().replace(' ', '_')}"
                cm = plot_confusion_levels(
                    y_true,
                    y_pred,
                    f"{name} — {dataset_slug}",
                    output_dir / f"{slug}_confusion.png",
                )
                THESIS_FIG.mkdir(parents=True, exist_ok=True)
                pdf_src = output_dir / f"{slug}_confusion.pdf"
                if pdf_src.exists():
                    (THESIS_FIG / f"{slug}_confusion.pdf").write_bytes(pdf_src.read_bytes())
                metrics["confusion_matrix"] = cm.tolist()
                with open(output_dir / f"{slug}_metrics.json", "w", encoding="utf-8") as f:
                    json.dump(metrics, f, indent=2)
                return metrics

            metrics = _eval_with_bs(model_name, model_path, df, dataset_slug, args.output_dir)
            metrics["dataset_meta"] = meta
            all_metrics.append(metrics)

    summary["results"] = all_metrics
    with open(args.output_dir / "external_comparison.json", "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2)

    # Markdown summary
    lines = ["# External evaluation (MIMIC + NHAMCS)", ""]
    for ds_key, ds_meta in summary.get("datasets", {}).items():
        lines.append(f"## {ds_key}")
        lines.append(f"- source: {ds_meta.get('source')}")
        lines.append(f"- N retained: {ds_meta.get('n_retained')}")
        lines.append(f"- support: `{ds_meta.get('support')}`")
        lines.append("")
    for m in all_metrics:
        lines.append(
            f"- **{m['model_name']} / {m['dataset']}**: acc={m['accuracy']:.4f}, "
            f"macroF1={m['macro_f1']:.4f}, colour_acc={m['colour_accuracy']:.4f}, "
            f"under={m['under_triage_rate']:.4f}, over={m['over_triage_rate']:.4f}, "
            f"L1_recall={m['recall_L1']:.4f} (support={m['support_L1']})"
        )
    (args.output_dir / "EXTERNAL_EVAL_RESULTS.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"\nWrote {args.output_dir / 'external_comparison.json'}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
