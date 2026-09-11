#!/usr/bin/env python3
"""Evaluate the clinical relevance gate on a labeled contrast set."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from medical_gate import evaluate, score_clinical_relevance  # noqa: E402


def load_examples(path: Path) -> list[dict]:
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, list) or not data:
        raise ValueError(f"Expected non-empty list in {path}")
    return data


def metrics_at_threshold(examples: list[dict], tau: float) -> dict:
    tp = fp = tn = fn = 0
    rows = []
    for ex in examples:
        text = ex["text"]
        gold_clinical = ex["label"] == "clinical"
        score = score_clinical_relevance(text, None)
        # Match evaluate() empty/short handling for fairness on tiny strings
        gate = evaluate(text, None)
        pred_clinical = gate.clinical_relevance_score >= tau and gate.is_medical
        # For threshold sweep, score-only decision (except empty/insufficient forced reject)
        if gate.rejection_category in ("empty_input", "insufficient_text"):
            pred_clinical = False
            score = gate.clinical_relevance_score
        else:
            pred_clinical = score >= tau
            # keep score from score_clinical_relevance

        if gold_clinical and pred_clinical:
            tp += 1
            outcome = "TP"
        elif (not gold_clinical) and pred_clinical:
            fp += 1
            outcome = "FP"
        elif (not gold_clinical) and (not pred_clinical):
            tn += 1
            outcome = "TN"
        else:
            fn += 1
            outcome = "FN"

        rows.append(
            {
                "text": text,
                "label": ex["label"],
                "score": score,
                "pred_clinical": pred_clinical,
                "outcome": outcome,
            }
        )

    n = tp + fp + tn + fn
    sens = tp / (tp + fn) if (tp + fn) else 0.0
    spec = tn / (tn + fp) if (tn + fp) else 0.0
    prec = tp / (tp + fp) if (tp + fp) else 0.0
    acc = (tp + tn) / n if n else 0.0
    return {
        "threshold": tau,
        "n": n,
        "n_clinical": tp + fn,
        "n_non_clinical": tn + fp,
        "tp": tp,
        "fp": fp,
        "tn": tn,
        "fn": fn,
        "false_clinical_rejections": fn,
        "false_clinical_acceptances": fp,
        "accuracy": round(acc, 4),
        "precision": round(prec, 4),
        "recall": round(sens, 4),
        "sensitivity": round(sens, 4),
        "specificity": round(spec, 4),
        "confusion_matrix": {"tp": tp, "fp": fp, "tn": tn, "fn": fn},
        "rows": rows,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--data",
        type=Path,
        default=ROOT / "data" / "gate_eval.json",
        help="Labeled gate evaluation JSON",
    )
    parser.add_argument(
        "--thresholds",
        type=float,
        nargs="+",
        default=[0.30, 0.35],
        help="Thresholds to evaluate",
    )
    parser.add_argument(
        "--out",
        type=Path,
        default=Path(__file__).resolve().parents[3] / "results" / "eval_outputs_gate" / "gate_metrics.json",
        help="Output JSON path",
    )
    args = parser.parse_args()

    examples = load_examples(args.data)
    by_tau = {f"{tau:.2f}": metrics_at_threshold(examples, tau) for tau in args.thresholds}

    # Compact summary without per-row dumps duplicated
    summary = {
        "data": str(args.data),
        "n": len(examples),
        "by_threshold": {
            k: {kk: vv for kk, vv in v.items() if kk != "rows"} for k, v in by_tau.items()
        },
        "false_negatives_at_0.30": [
            r for r in by_tau.get("0.30", {}).get("rows", []) if r["outcome"] == "FN"
        ],
        "false_negatives_at_0.35": [
            r for r in by_tau.get("0.35", {}).get("rows", []) if r["outcome"] == "FN"
        ],
    }
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(summary, indent=2), encoding="utf-8")

    for tau_key, m in summary["by_threshold"].items():
        print(
            f"tau={tau_key}  n={m['n']}  Acc={m['accuracy']:.4f}  "
            f"Prec={m['precision']:.4f}  Sens={m['sensitivity']:.4f}  "
            f"Spec={m['specificity']:.4f}  "
            f"TP={m['tp']} FP={m['fp']} TN={m['tn']} FN={m['fn']}"
        )
    print(f"Wrote {args.out}")


if __name__ == "__main__":
    main()
