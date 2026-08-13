#!/usr/bin/env python3
"""Evaluate baseline vs SMOTE BioBERT triage models on labeled holdout data."""

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
from sklearn.model_selection import train_test_split
from transformers import AutoModelForSequenceClassification, AutoTokenizer, pipeline

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_TRAIN_CSV = ROOT / "train.csv"
DEFAULT_COMPLAINTS_CSV = ROOT / "chief_complaints.csv"
DEFAULT_TEST_CSV = ROOT / "test.csv"
DEFAULT_OUTPUT_DIR = ROOT / "eval_outputs"

BASELINE_MODEL = (
    ROOT
    / "fine_tuned_biobert_triage-20260602T132911Z-3-001"
    / "fine_tuned_biobert_triage"
)
SMOTE_MODEL = ROOT / "fine_tuned_biobert_triage_smote"

ACUITY_NAMES = {
    0: "L1 Red",
    1: "L2 Orange",
    2: "L3 Yellow",
    3: "L4 Green",
    4: "L5 Green",
}


def load_labeled_frame(
    train_csv: Path,
    complaints_csv: Path,
    text_column: str = "chief_complaint_raw",
    label_column: str = "triage_acuity",
    deidentified_csv: Path | None = None,
) -> pd.DataFrame:
    if not train_csv.exists():
        raise FileNotFoundError(f"Missing {train_csv}")
    if not complaints_csv.exists() and deidentified_csv is None:
        raise FileNotFoundError(
            f"Missing {complaints_csv}. Place Triagegeist CSVs in fine-tuned-biobert/."
        )

    train_df = pd.read_csv(train_csv)
    if deidentified_csv and deidentified_csv.exists():
        complaints_df = pd.read_csv(deidentified_csv)
        text_column = "chief_complaint_deidentified"
    else:
        complaints_df = pd.read_csv(complaints_csv)

    df = pd.merge(train_df, complaints_df, on="patient_id")
    df = df.dropna(subset=[text_column, label_column])
    df[text_column] = df[text_column].astype(str)
    df["label"] = df[label_column].astype(int) - 1
    df["acuity_level"] = df[label_column].astype(int)
    return df.rename(columns={text_column: "text"})[
        ["patient_id", "text", "label", "acuity_level"]
    ].reset_index(drop=True)


def build_eval_split(
    df: pd.DataFrame,
    test_csv: Path | None,
    test_size: float,
    seed: int,
) -> tuple[pd.DataFrame, pd.DataFrame, str]:
    if test_csv and test_csv.exists():
        test_ids = set(pd.read_csv(test_csv)["patient_id"].astype(str))
        labeled_test = df[df["patient_id"].astype(str).isin(test_ids)]
        if len(labeled_test) >= 100 and labeled_test["label"].nunique() > 1:
            train_part = df[~df["patient_id"].astype(str).isin(test_ids)]
            return train_part, labeled_test, "test_csv_labeled_subset"

    train_df, eval_df = train_test_split(
        df,
        test_size=test_size,
        random_state=seed,
        stratify=df["label"],
    )
    return (
        train_df.reset_index(drop=True),
        eval_df.reset_index(drop=True),
        f"stratified_holdout_{int(test_size * 100)}pct",
    )


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


def _cuda_available() -> bool:
    try:
        import torch

        return torch.cuda.is_available()
    except ImportError:
        return False


def predict_labels(clf, texts: list[str], batch_size: int = 32) -> tuple[np.ndarray, np.ndarray, list[float]]:
    latencies: list[float] = []
    preds: list[int] = []
    confidences: list[float] = []

    for i in range(0, len(texts), batch_size):
        batch = texts[i : i + batch_size]
        start = time.perf_counter()
        results = clf(batch, truncation=True, max_length=128)
        latencies.append((time.perf_counter() - start) * 1000 / max(len(batch), 1))

        for item in results:
            if isinstance(item, list):
                best = max(item, key=lambda x: x["score"])
            else:
                best = item
            idx = int(best["label"].split("_")[-1])
            preds.append(idx)
            confidences.append(float(best["score"]))

    return np.array(preds), np.array(confidences), latencies


def summarize_metrics(y_true: np.ndarray, y_pred: np.ndarray, confidences: np.ndarray) -> dict:
    labels = [0, 1, 2, 3, 4]
    precision, recall, f1, support = precision_recall_fscore_support(
        y_true, y_pred, labels=labels, zero_division=0
    )
    macro_f1 = f1_score(y_true, y_pred, average="macro", zero_division=0)
    accuracy = float((y_true == y_pred).mean())

    metrics = {
        "accuracy": accuracy,
        "macro_f1": float(macro_f1),
        "recall_L1_Red": float(recall[0]),
        "precision_L1_Red": float(precision[0]),
        "f1_L1_Red": float(f1[0]),
        "support_L1_Red": int(support[0]),
    }
    for i, name in ACUITY_NAMES.items():
        metrics[f"precision_{name}"] = float(precision[i])
        metrics[f"recall_{name}"] = float(recall[i])
        metrics[f"f1_{name}"] = float(f1[i])
        metrics[f"support_{name}"] = int(support[i])

    metrics["calibration"] = {
        "mean_confidence": float(np.mean(confidences)),
        "pct_confidence_eq_1": float(np.mean(np.isclose(confidences, 1.0))),
        "pct_confidence_below_0_85": float(np.mean(confidences < 0.85)),
    }
    return metrics


def plot_confusion(y_true, y_pred, title: str, out_path: Path):
    labels = [0, 1, 2, 3, 4]
    cm = confusion_matrix(y_true, y_pred, labels=labels)
    names = [ACUITY_NAMES[i] for i in labels]
    fig, ax = plt.subplots(figsize=(8, 6))
    sns.heatmap(cm, annot=True, fmt="d", cmap="Greens", xticklabels=names, yticklabels=names, ax=ax)
    ax.set_xlabel("Predicted")
    ax.set_ylabel("True")
    ax.set_title(title)
    plt.tight_layout()
    fig.savefig(out_path, dpi=150)
    plt.close(fig)


def plot_calibration(confidences: np.ndarray, title: str, out_path: Path):
    fig, ax = plt.subplots(figsize=(8, 4))
    ax.hist(confidences, bins=20, color="#22c55e", edgecolor="white")
    ax.set_xlabel("Top-class confidence")
    ax.set_ylabel("Count")
    ax.set_title(title)
    plt.tight_layout()
    fig.savefig(out_path, dpi=150)
    plt.close(fig)


def evaluate_model(name: str, model_path: Path, eval_df: pd.DataFrame, output_dir: Path) -> dict:
    print(f"\n=== Evaluating {name} ===")
    clf = load_classifier(model_path)
    texts = eval_df["text"].tolist()
    y_true = eval_df["label"].to_numpy()

    y_pred, confidences, latencies = predict_labels(clf, texts)
    metrics = summarize_metrics(y_true, y_pred, confidences)
    metrics["latency_ms"] = {
        "p50": float(np.percentile(latencies, 50)),
        "p95": float(np.percentile(latencies, 95)),
        "mean_per_sample": float(np.mean(latencies)),
    }
    metrics["n_eval"] = int(len(eval_df))
    metrics["model_path"] = str(model_path)

    print(classification_report(
        y_true,
        y_pred,
        labels=[0, 1, 2, 3, 4],
        target_names=[ACUITY_NAMES[i] for i in range(5)],
        zero_division=0,
    ))

    slug = name.lower().replace(" ", "_")
    plot_confusion(y_true, y_pred, f"{name} confusion matrix", output_dir / f"{slug}_confusion.png")
    plot_calibration(confidences, f"{name} confidence histogram", output_dir / f"{slug}_calibration.png")

    with open(output_dir / f"{slug}_metrics.json", "w", encoding="utf-8") as f:
        json.dump(metrics, f, indent=2)

    return metrics


def write_results_md(
    output_dir: Path,
    split_name: str,
    baseline: dict,
    smote: dict,
) -> None:
    lines = [
        "# BioBERT Triage Evaluation Results",
        "",
        f"**Eval split:** {split_name}  ",
        f"**Eval rows:** {baseline.get('n_eval', 'n/a')}",
        "",
        "## Summary",
        "",
        "| Metric | Baseline | SMOTE |",
        "|--------|----------|-------|",
        f"| Accuracy | {baseline['accuracy']:.4f} | {smote['accuracy']:.4f} |",
        f"| Macro-F1 | {baseline['macro_f1']:.4f} | {smote['macro_f1']:.4f} |",
        f"| Recall L1 (Red) | {baseline['recall_L1_Red']:.4f} | {smote['recall_L1_Red']:.4f} |",
        f"| Mean confidence | {baseline['calibration']['mean_confidence']:.4f} | {smote['calibration']['mean_confidence']:.4f} |",
        f"| % conf = 1.0 | {baseline['calibration']['pct_confidence_eq_1']:.2%} | {smote['calibration']['pct_confidence_eq_1']:.2%} |",
        f"| Latency p50 (ms/sample) | {baseline['latency_ms']['p50']:.2f} | {smote['latency_ms']['p50']:.2f} |",
        "",
        "## Artifacts",
        "",
        "- `baseline_confusion.png`, `smote_confusion.png`",
        "- `baseline_calibration.png`, `smote_calibration.png`",
        "- `baseline_metrics.json`, `smote_metrics.json`",
        "",
        "Re-run: `python scripts/evaluate_triage.py --train-csv train.csv --complaints-csv chief_complaints.csv`",
        "",
    ]
    (output_dir / "EVAL_RESULTS.md").write_text("\n".join(lines), encoding="utf-8")
    (ROOT / "EVAL_RESULTS.md").write_text("\n".join(lines), encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--train-csv", type=Path, default=DEFAULT_TRAIN_CSV)
    parser.add_argument("--complaints-csv", type=Path, default=DEFAULT_COMPLAINTS_CSV)
    parser.add_argument("--deidentified-csv", type=Path, default=ROOT / "chief_complaints_deidentified.csv")
    parser.add_argument("--test-csv", type=Path, default=DEFAULT_TEST_CSV)
    parser.add_argument("--baseline-model", type=Path, default=BASELINE_MODEL)
    parser.add_argument("--smote-model", type=Path, default=SMOTE_MODEL)
    parser.add_argument("--output-dir", type=Path, default=DEFAULT_OUTPUT_DIR)
    parser.add_argument("--test-size", type=float, default=0.1)
    parser.add_argument("--seed", type=int, default=42)
    parser.add_argument("--use-deidentified", action="store_true")
    args = parser.parse_args()

    deid = args.deidentified_csv if args.use_deidentified else None
    try:
        df = load_labeled_frame(args.train_csv, args.complaints_csv, deidentified_csv=deid)
    except FileNotFoundError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        print(
            "Place train.csv and chief_complaints.csv in fine-tuned-biobert/ "
            "(not committed — see DATA_ANALYSIS.md).",
            file=sys.stderr,
        )
        return 1

    _, eval_df, split_name = build_eval_split(df, args.test_csv, args.test_size, args.seed)
    args.output_dir.mkdir(parents=True, exist_ok=True)

    print(f"Loaded {len(df):,} labeled rows; evaluating on {len(eval_df):,} ({split_name})")

    baseline = evaluate_model("Baseline", args.baseline_model, eval_df, args.output_dir)
    smote = evaluate_model("SMOTE", args.smote_model, eval_df, args.output_dir)

    comparison = {"split": split_name, "baseline": baseline, "smote": smote}
    with open(args.output_dir / "comparison.json", "w", encoding="utf-8") as f:
        json.dump(comparison, f, indent=2)

    write_results_md(args.output_dir, split_name, baseline, smote)
    print(f"\nWrote results to {args.output_dir} and {ROOT / 'EVAL_RESULTS.md'}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
