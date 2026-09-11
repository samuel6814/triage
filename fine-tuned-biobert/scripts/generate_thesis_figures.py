#!/usr/bin/env python3
"""Generate Chapter 4 thesis figures: BioBERT analysis + fine-tuned eval plots."""

from __future__ import annotations

import json
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
from PIL import Image

plt.rcParams.update({"font.size": 12, "axes.titlesize": 14, "axes.labelsize": 13})

ROOT = Path(__file__).resolve().parents[1]
PROJECT = ROOT.parent
COMPARISON_JSON = PROJECT / "results" / "eval_outputs" / "comparison.json"
EXTERNAL_COMPARISON_JSON = (
    PROJECT / "results" / "eval_outputs_external" / "external_comparison.json"
)
EVAL_DIR = PROJECT / "results" / "eval_outputs"
OUT_DIR = PROJECT / "final_thesis_v1" / "figures" / "ch4"

CLASS_LABELS = ["L1 Red", "L2 Orange", "L3 Yellow", "L4 Green", "L5 Green"]


def _save(fig: plt.Figure, name: str) -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    path = OUT_DIR / name
    fig.savefig(path, bbox_inches="tight", dpi=150)
    plt.close(fig)
    print(f"Wrote {path}")


def _pick_external_result(results: list[dict], dataset: str, model_name: str) -> dict:
    for row in results:
        if row.get("dataset") == dataset and row.get("model_name") == model_name:
            return row
    raise KeyError(f"No result for dataset={dataset!r}, model_name={model_name!r}")


def plot_external_metrics_compare(results: list[dict]) -> None:
    """Headline external metrics: NHAMCS/MIMIC × baseline/oversample."""
    series = [
        ("NHAMCS baseline", "nhamcs", "Baseline", "#15803d"),
        ("NHAMCS oversample", "nhamcs", "Oversample", "#0d9488"),
        ("MIMIC demo baseline", "mimic_demo", "Baseline", "#1d4ed8"),
        ("MIMIC demo oversample", "mimic_demo", "Oversample", "#7c3aed"),
    ]
    metric_keys = [
        ("Accuracy", "accuracy"),
        ("Macro-F1", "macro_f1"),
        ("Colour accuracy", "colour_accuracy"),
        ("L1 recall", "recall_L1"),
    ]
    rows = [
        (_pick_external_result(results, ds, model), label, color)
        for label, ds, model, color in series
    ]

    x = np.arange(len(metric_keys))
    n = len(rows)
    width = 0.18
    offsets = (np.arange(n) - (n - 1) / 2) * width

    fig, ax = plt.subplots(figsize=(10, 5.2))
    for offset, (row, label, color) in zip(offsets, rows):
        vals = [float(row[key]) for _, key in metric_keys]
        bars = ax.bar(x + offset, vals, width, label=label, color=color, alpha=0.9)
        for bar, val in zip(bars, vals):
            ax.text(
                bar.get_x() + bar.get_width() / 2,
                bar.get_height() + 0.015,
                f"{val:.2f}",
                ha="center",
                va="bottom",
                fontsize=8,
                rotation=90,
            )

    ax.set_xticks(x)
    ax.set_xticklabels([name for name, _ in metric_keys])
    ax.set_ylabel("Score")
    ax.set_ylim(0, 1.15)
    ax.set_title(
        "External evaluation: NHAMCS and MIMIC-IV-ED demo "
        "(baseline vs stratified oversampling)"
    )
    ax.legend(loc="upper right", fontsize=11, ncol=2)
    ax.axhline(1.0, color="gray", linestyle="--", linewidth=0.7, alpha=0.4)
    _save(fig, "external_metrics_compare.pdf")


def plot_external_under_over_triage(results: list[dict]) -> None:
    """Under-triage and over-triage rates: NHAMCS/MIMIC × baseline/oversample."""
    series = [
        ("NHAMCS baseline", "nhamcs", "Baseline", "#15803d"),
        ("NHAMCS oversample", "nhamcs", "Oversample", "#0d9488"),
        ("MIMIC demo baseline", "mimic_demo", "Baseline", "#1d4ed8"),
        ("MIMIC demo oversample", "mimic_demo", "Oversample", "#7c3aed"),
    ]
    metric_keys = [
        ("Under-triage", "under_triage_rate"),
        ("Over-triage", "over_triage_rate"),
    ]
    rows = [
        (_pick_external_result(results, ds, model), label, color)
        for label, ds, model, color in series
    ]

    x = np.arange(len(metric_keys))
    n = len(rows)
    width = 0.18
    offsets = (np.arange(n) - (n - 1) / 2) * width

    fig, ax = plt.subplots(figsize=(9, 5.2))
    for offset, (row, label, color) in zip(offsets, rows):
        vals = [float(row[key]) for _, key in metric_keys]
        bars = ax.bar(x + offset, vals, width, label=label, color=color, alpha=0.9)
        for bar, val in zip(bars, vals):
            ax.text(
                bar.get_x() + bar.get_width() / 2,
                bar.get_height() + 0.015,
                f"{val:.2f}",
                ha="center",
                va="bottom",
                fontsize=9,
                rotation=90,
            )

    ax.set_xticks(x)
    ax.set_xticklabels([name for name, _ in metric_keys])
    ax.set_ylabel("Rate")
    ax.set_ylim(0, 0.85)
    ax.set_title(
        "Under-triage and over-triage on NHAMCS and MIMIC-IV-ED demo "
        "(baseline vs stratified oversampling)"
    )
    ax.legend(loc="upper right", fontsize=11, ncol=2)
    _save(fig, "external_under_over_triage.pdf")


def plot_model_specs() -> None:
    """BioBERT section: key architecture constants."""
    specs = ["Layers", "Hidden dim", "Attention heads", "Max tokens", "Vocab (k)"]
    values = [12, 768, 12, 128, 30]
    fig, ax = plt.subplots(figsize=(8, 4.5))
    bars = ax.barh(specs, values, color="#15803d", alpha=0.85, edgecolor="white")
    ax.set_xlabel("Value")
    ax.set_title("BioBERT-base architecture constants (project configuration)")
    for bar, val in zip(bars, values):
        ax.text(bar.get_width() + 8, bar.get_y() + bar.get_height() / 2,
                str(val), va="center", fontsize=11)
    ax.set_xlim(0, max(values) * 1.15)
    _save(fig, "model_specs.pdf")


def _recall_by_label(model: dict) -> list[float]:
    return [model[f"recall_{label}"] for label in CLASS_LABELS]


def _f1_by_label(model: dict) -> list[float]:
    return [model[f"f1_{label}"] for label in CLASS_LABELS]


def plot_recall_by_class(baseline: dict, smote: dict) -> None:
    """Replace unreadable scatter with grouped bar chart."""
    b_rec = _recall_by_label(baseline)
    s_rec = _recall_by_label(smote)
    x = np.arange(len(CLASS_LABELS))
    width = 0.36
    fig, ax = plt.subplots(figsize=(9, 5))
    ax.bar(x - width / 2, b_rec, width, label="Baseline fine-tuned", color="#15803d", alpha=0.9)
    ax.bar(x + width / 2, s_rec, width, label="SMOTE fine-tuned", color="#0d9488", alpha=0.9)
    ax.set_xticks(x)
    ax.set_xticklabels(CLASS_LABELS, rotation=12, ha="right")
    ax.set_ylabel("Recall (fraction of true cases found)")
    ax.set_ylim(0, 1.08)
    ax.set_title("Recall by acuity level: baseline vs SMOTE (holdout, N=8,000)")
    ax.legend(loc="lower right")
    ax.axhline(1.0, color="gray", linestyle="--", linewidth=0.8, alpha=0.5)
    for i, (bv, sv) in enumerate(zip(b_rec, s_rec)):
        ax.text(i - width / 2, bv + 0.02, f"{bv:.3f}", ha="center", fontsize=10)
        ax.text(i + width / 2, sv + 0.02, f"{sv:.3f}", ha="center", fontsize=10)
    _save(fig, "recall_by_class_compare.pdf")


def plot_per_class_f1(baseline: dict, smote: dict) -> None:
    b_f1 = _f1_by_label(baseline)
    s_f1 = _f1_by_label(smote)
    x = np.arange(len(CLASS_LABELS))
    width = 0.36
    fig, ax = plt.subplots(figsize=(9, 5))
    ax.bar(x - width / 2, b_f1, width, label="Baseline fine-tuned", color="#15803d", alpha=0.9)
    ax.bar(x + width / 2, s_f1, width, label="SMOTE fine-tuned", color="#0d9488", alpha=0.9)
    ax.set_xticks(x)
    ax.set_xticklabels(CLASS_LABELS, rotation=12, ha="right")
    ax.set_ylabel("F1 score")
    ax.set_ylim(0, 1.08)
    ax.set_title("F1 score by acuity level: baseline vs SMOTE")
    ax.legend(loc="lower right")
    for i, (bv, sv) in enumerate(zip(b_f1, s_f1)):
        ax.text(i - width / 2, bv + 0.02, f"{bv:.3f}", ha="center", fontsize=10)
        ax.text(i + width / 2, sv + 0.02, f"{sv:.3f}", ha="center", fontsize=10)
    _save(fig, "per_class_f1_compare.pdf")


def plot_metrics_compare(baseline: dict, smote: dict) -> None:
    metrics = ["Accuracy", "Macro-F1", "L1 recall"]
    b_vals = [baseline["accuracy"], baseline["macro_f1"], baseline["recall_L1_Red"]]
    s_vals = [smote["accuracy"], smote["macro_f1"], smote["recall_L1_Red"]]
    x = np.arange(len(metrics))
    width = 0.36
    fig, ax = plt.subplots(figsize=(8, 5))
    ax.bar(x - width / 2, b_vals, width, label="Baseline fine-tuned", color="#15803d", alpha=0.9)
    ax.bar(x + width / 2, s_vals, width, label="SMOTE fine-tuned", color="#0d9488", alpha=0.9)
    ax.set_xticks(x)
    ax.set_xticklabels(metrics)
    ax.set_ylabel("Score")
    ax.set_ylim(0, 1.08)
    ax.set_title("Headline holdout metrics: baseline vs SMOTE")
    ax.legend(loc="lower right")
    for i, (bv, sv) in enumerate(zip(b_vals, s_vals)):
        ax.text(i - width / 2, bv + 0.02, f"{bv:.3f}", ha="center", fontsize=10)
        ax.text(i + width / 2, sv + 0.02, f"{sv:.3f}", ha="center", fontsize=10)
    _save(fig, "metrics_compare.pdf")


def plot_latency(baseline: dict, smote: dict) -> None:
    stats = ["p50", "p95", "mean_per_sample"]
    labels = ["Median (p50)", "95th pct (p95)", "Mean"]
    b_lat = [baseline["latency_ms"][s] for s in stats]
    s_lat = [smote["latency_ms"][s] for s in stats]
    x = np.arange(len(labels))
    width = 0.36
    fig, ax = plt.subplots(figsize=(8, 5))
    ax.bar(x - width / 2, b_lat, width, label="Baseline fine-tuned", color="#15803d", alpha=0.9)
    ax.bar(x + width / 2, s_lat, width, label="SMOTE fine-tuned", color="#0d9488", alpha=0.9)
    ax.set_xticks(x)
    ax.set_xticklabels(labels)
    ax.set_ylabel("Milliseconds per complaint")
    ax.set_title("Inference latency on holdout set")
    ax.legend()
    for i, (bv, sv) in enumerate(zip(b_lat, s_lat)):
        ax.text(i - width / 2, bv + 3, f"{bv:.0f}", ha="center", fontsize=10)
        ax.text(i + width / 2, sv + 3, f"{sv:.0f}", ha="center", fontsize=10)
    _save(fig, "latency_compare.pdf")


def convert_png_to_pdf(stem: str) -> None:
    png = EVAL_DIR / f"{stem}.png"
    if not png.exists():
        print(f"Skip missing {png}")
        return
    img = Image.open(png).convert("RGB")
    out = OUT_DIR / f"{stem}.pdf"
    img.save(out, "PDF", resolution=150.0)
    print(f"Wrote {out}")


def main() -> None:
    if not COMPARISON_JSON.exists():
        raise FileNotFoundError(f"Missing {COMPARISON_JSON}")
    if not EXTERNAL_COMPARISON_JSON.exists():
        raise FileNotFoundError(f"Missing {EXTERNAL_COMPARISON_JSON}")

    with open(COMPARISON_JSON, encoding="utf-8") as f:
        data = json.load(f)
    with open(EXTERNAL_COMPARISON_JSON, encoding="utf-8") as f:
        external = json.load(f)

    baseline = data["baseline"]
    smote = data["smote"]

    # BioBERT / results figures used in the thesis
    plot_external_metrics_compare(external["results"])
    plot_external_under_over_triage(external["results"])
    plot_model_specs()

    # Optional holdout artifacts (not included in thesis headline figures)
    plot_per_class_f1(baseline, smote)
    plot_metrics_compare(baseline, smote)
    plot_recall_by_class(baseline, smote)
    plot_latency(baseline, smote)

    for stem in ["baseline_confusion", "smote_confusion"]:
        convert_png_to_pdf(stem)

    print(f"\nAll figures written to {OUT_DIR}")


if __name__ == "__main__":
    main()
