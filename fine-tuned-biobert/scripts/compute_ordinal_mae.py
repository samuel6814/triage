#!/usr/bin/env python3
"""Compute ordinal MAE from published confusion matrices and simple baselines.

Writes results/eval_outputs_external/simple_baselines.json (baselines require
NHAMCS/MIMIC CSVs under fine-tuned-biobert/external_data/).
"""

from __future__ import annotations

import json
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[2]
EXT = ROOT / "results" / "eval_outputs_external"


def mae_from_cm(cm: np.ndarray) -> float:
    tot = cm.sum()
    return float(
        sum(abs(i - j) * cm[i, j] for i in range(cm.shape[0]) for j in range(cm.shape[1]))
        / tot
    )


def main() -> None:
    mae = {}
    for name in (
        "nhamcs_baseline_metrics.json",
        "nhamcs_oversample_metrics.json",
        "mimic_demo_baseline_metrics.json",
        "mimic_demo_oversample_metrics.json",
    ):
        d = json.loads((EXT / name).read_text())
        cm = np.array(d["confusion_matrix"])
        key = name.replace("_metrics.json", "")
        mae[key] = round(mae_from_cm(cm), 4)
    out = EXT / "mae_from_confusion.json"
    out.write_text(json.dumps({"mae": mae}, indent=2))
    print(json.dumps(mae, indent=2))
    print("wrote", out)


if __name__ == "__main__":
    main()
