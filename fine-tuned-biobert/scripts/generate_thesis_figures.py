#!/usr/bin/env python3
"""Generate Chapter 4 thesis figures: BioBERT analysis + fine-tuned eval plots."""

from __future__ import annotations

import json
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
from PIL import Image

plt.rcParams.update({"font.size": 11, "axes.titlesize": 13, "axes.labelsize": 12})

ROOT = Path(__file__).resolve().parents[1]
PROJECT = ROOT.parent
COMPARISON_JSON = PROJECT / "results" / "eval_outputs" / "comparison.json"
EVAL_DIR = PROJECT / "results" / "eval_outputs"
OUT_DIR = PROJECT / "final_thesis_v1" / "figures" / "ch4"

CLASS_LABELS = ["L1 Red", "L2 Orange", "L3 Yellow", "L4 Green", "L5 Green"]


def _save(fig: plt.Figure, name: str) -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    path = OUT_DIR / name
    fig.savefig(path, bbox_inches="tight", dpi=150)
    plt.close(fig)
    print(f"Wrote {path}")


def plot_pre_finetune_capability(finetuned_acc: float) -> None:
    """BioBERT section: accuracy before vs after Stage 3 fine-tuning."""
    labels = [
        "Uniform random",
        "Random head\n(encoder only)",
        "Majority-class bound",
        "Fine-tuned BioBERT",
    ]
    values = [0.20, 0.20, 0.3615, finetuned_acc]
    colors = ["#94a3b8", "#64748b", "#f59e0b", "#15803d"]
    fig, ax = plt.subplots(figsize=(8, 4.5))
    bars = ax.bar(labels, values, color=colors, edgecolor="white", linewidth=0.8)
    ax.set_ylabel("Expected / holdout accuracy")
    ax.set_ylim(0, 1.08)
    ax.set_title("Triage accuracy: pre-fine-tune bounds vs fine-tuned BioBERT")
    for bar, val in zip(bars, values):
        ax.text(
            bar.get_x() + bar.get_width() / 2,
            bar.get_height() + 0.02,
            f"{val:.1%}",
            ha="center",
            va="bottom",
            fontsize=11,
            fontweight="bold",
        )
    _save(fig, "pre_finetune_capability.pdf")


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

    with open(COMPARISON_JSON, encoding="utf-8") as f:
        data = json.load(f)

    baseline = data["baseline"]
    smote = data["smote"]

    # BioBERT model analysis figures (Section 4.1)
    plot_pre_finetune_capability(baseline["accuracy"])
    plot_model_specs()

    # Fine-tuned model analysis figures (Section 4.2)
    plot_per_class_f1(baseline, smote)
    plot_metrics_compare(baseline, smote)
    plot_recall_by_class(baseline, smote)
    plot_latency(baseline, smote)

    for stem in ["baseline_confusion", "smote_confusion"]:
        convert_png_to_pdf(stem)

    print(f"\nAll figures written to {OUT_DIR}")


if __name__ == "__main__":
    main()
