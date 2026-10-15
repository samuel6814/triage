#!/usr/bin/env python3
"""Bootstrap 95% CIs for external metrics from published confusion matrices."""

from __future__ import annotations

import json
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[2]
EVAL_DIR = ROOT / "results" / "eval_outputs_external"
OUT_PATH = EVAL_DIR / "bootstrap_cis.json"

SATS_BY_LEVEL = {1: "Red", 2: "Orange", 3: "Yellow", 4: "Green", 5: "Green"}

SOURCES = {
    "nhamcs_baseline": "nhamcs_baseline_metrics.json",
    "nhamcs_oversample": "nhamcs_oversample_metrics.json",
    "mimic_demo_baseline": "mimic_demo_baseline_metrics.json",
    "mimic_demo_oversample": "mimic_demo_oversample_metrics.json",
}


def f_sats(level: int) -> str:
    return SATS_BY_LEVEL[int(level)]


def expand_cm(cm: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
    """Expand confusion matrix (rows=true, cols=pred, levels 1..5) to (y, yhat)."""
    ys, ps = [], []
    for i in range(5):
        for j in range(5):
            n = int(cm[i, j])
            if n <= 0:
                continue
            ys.append(np.full(n, i + 1, dtype=np.int16))
            ps.append(np.full(n, j + 1, dtype=np.int16))
    return np.concatenate(ys), np.concatenate(ps)


def metrics(y: np.ndarray, p: np.ndarray) -> dict[str, float]:
    acc = float((y == p).mean())
    colour_acc = float(
        sum(f_sats(int(t)) == f_sats(int(h)) for t, h in zip(y, p)) / len(y)
    )
    mask = y == 1
    recall_l1 = float((p[mask] == 1).mean()) if mask.any() else float("nan")
    return {
        "accuracy": acc,
        "colour_accuracy": colour_acc,
        "recall_L1": recall_l1,
        "n": int(len(y)),
        "n_L1": int(mask.sum()),
    }


def bootstrap_ci(
    y: np.ndarray,
    p: np.ndarray,
    B: int = 2000,
    seed: int = 42,
) -> dict:
    rng = np.random.default_rng(seed)
    n = len(y)
    point = metrics(y, p)
    keys = ["accuracy", "colour_accuracy", "recall_L1"]
    samples = {k: np.empty(B, dtype=np.float64) for k in keys}
    for b in range(B):
        idx = rng.integers(0, n, size=n)
        m = metrics(y[idx], p[idx])
        for k in keys:
            samples[k][b] = m[k]
    out = {
        "point": point,
        "B": B,
        "seed": seed,
        "method": "ordinary bootstrap, percentile 95% CI from confusion-matrix expansion",
    }
    for k in keys:
        lo, hi = np.percentile(samples[k], [2.5, 97.5])
        out[k] = {
            "estimate": point[k],
            "ci95": [float(lo), float(hi)],
        }
    return out


def main() -> None:
    results = {}
    for key, fname in SOURCES.items():
        path = EVAL_DIR / fname
        data = json.loads(path.read_text())
        cm = np.asarray(data["confusion_matrix"], dtype=np.int64)
        y, p = expand_cm(cm)
        assert len(y) == int(data.get("n_eval", len(y))), key
        results[key] = bootstrap_ci(y, p)
        results[key]["source"] = fname
        results[key]["dataset"] = data.get("dataset")
        results[key]["model_name"] = data.get("model_name")
    OUT_PATH.write_text(json.dumps(results, indent=2) + "\n")
    print(f"Wrote {OUT_PATH}")
    for key, block in results.items():
        print(
            f"{key}: Acc {block['accuracy']['estimate']:.4f} "
            f"[{block['accuracy']['ci95'][0]:.4f}, {block['accuracy']['ci95'][1]:.4f}]; "
            f"L1 rec {block['recall_L1']['estimate']:.4f} "
            f"[{block['recall_L1']['ci95'][0]:.4f}, {block['recall_L1']['ci95'][1]:.4f}]"
        )


if __name__ == "__main__":
    main()
