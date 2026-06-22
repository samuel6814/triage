"""Evaluation metrics and plots for imbalanced triage classification."""

from __future__ import annotations

import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import (
    classification_report,
    confusion_matrix,
    f1_score,
    precision_recall_fscore_support,
)


ACUITY_NAMES = {
    0: "L1 Red",
    1: "L2 Orange",
    2: "L3 Yellow",
    3: "L4 Green",
    4: "L5 Green",
}


def compute_metrics(eval_pred):
    """Hugging Face Trainer compute_metrics callback."""
    logits, labels = eval_pred
    preds = np.argmax(logits, axis=-1)

    precision, recall, f1, _ = precision_recall_fscore_support(
        labels, preds, average=None, zero_division=0, labels=[0, 1, 2, 3, 4]
    )
    macro_f1 = f1_score(labels, preds, average="macro", zero_division=0)

    metrics = {
        "accuracy": (preds == labels).mean().item(),
        "macro_f1": macro_f1,
    }
    for i, name in ACUITY_NAMES.items():
        metrics[f"precision_{name}"] = float(precision[i]) if i < len(precision) else 0.0
        metrics[f"recall_{name}"] = float(recall[i]) if i < len(recall) else 0.0
        metrics[f"f1_{name}"] = float(f1[i]) if i < len(f1) else 0.0

    return metrics


def print_classification_report(y_true, y_pred, labels=None):
    """Print sklearn classification report with acuity names."""
    labels = labels or [0, 1, 2, 3, 4]
    target_names = [ACUITY_NAMES.get(i, str(i)) for i in labels]
    print(classification_report(y_true, y_pred, labels=labels, target_names=target_names, zero_division=0))


def plot_confusion_matrix(
    y_true,
    y_pred,
    labels=None,
    title: str = "Confusion Matrix (validation)",
    figsize=(8, 6),
):
    """Plot annotated confusion matrix heatmap."""
    labels = labels or [0, 1, 2, 3, 4]
    cm = confusion_matrix(y_true, y_pred, labels=labels)
    names = [ACUITY_NAMES.get(i, str(i)) for i in labels]

    fig, ax = plt.subplots(figsize=figsize)
    sns.heatmap(
        cm,
        annot=True,
        fmt="d",
        cmap="Greens",
        xticklabels=names,
        yticklabels=names,
        ax=ax,
    )
    ax.set_xlabel("Predicted")
    ax.set_ylabel("True")
    ax.set_title(title)
    plt.tight_layout()
    return fig
