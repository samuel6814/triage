# Curatio Results

Evaluation metrics, calibration plots, and Beamer slides for the BioBERT triage project.

## Evaluation

From `fine-tuned-biobert/` (requires `train.csv` and `chief_complaints.csv`):

```bash
python scripts/evaluate_triage.py \
  --train-csv "fine_tuned_biobert_triage-20260602T132911Z-3-001/fine_tuned_biobert_triage/train.csv" \
  --complaints-csv "fine_tuned_biobert_triage-20260602T132911Z-3-001/fine_tuned_biobert_triage/chief_complaints.csv" \
  --output-dir ../results/eval_outputs
```

Outputs land in `eval_outputs/`:

- `EVAL_RESULTS.md` — summary table (baseline vs SMOTE)
- `baseline_confusion.png`, `baseline_calibration.png`
- `baseline_metrics.json`, `smote_metrics.json`

**Default inference model:** baseline BioBERT (not SMOTE).

## Slides

```bash
cd results/slides
pdflatex main.tex
pdflatex main.tex
```

Produces `main.pdf` — Ann Arbor theme, green Curatio palette.

Sections: Methodology, Results, Analysis, Recommendations.
