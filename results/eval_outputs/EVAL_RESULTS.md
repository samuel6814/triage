# BioBERT Triage Evaluation Results

**Eval split:** stratified_holdout_10pct  
**Eval rows:** 8000

## Summary

| Metric | Baseline | SMOTE |
|--------|----------|-------|
| Accuracy | 0.9992 | 0.9985 |
| Macro-F1 | 0.9977 | 0.9954 |
| Recall L1 (Red) | 0.9814 | 1.0000 |
| Mean confidence | 0.9997 | 0.9992 |
| % conf = 1.0 | 79.05% | 82.99% |
| Latency p50 (ms/sample) | 100.30 | 95.50 |

## Artifacts

- `baseline_confusion.png`, `smote_confusion.png`
- `baseline_calibration.png`, `smote_calibration.png`
- `baseline_metrics.json`, `smote_metrics.json`

Re-run: `python scripts/evaluate_triage.py --train-csv train.csv --complaints-csv chief_complaints.csv`
