# 05 — Evaluation Metrics

## Why accuracy and eval_loss are not enough

On a 36% majority class, a model that **always predicts Level 3** gets 36% accuracy. Cross-entropy can be very low while **Level 1 recall is 0%**.

You need **per-class** metrics, especially recall on Levels 1 and 2.

## Metrics to report

### Confusion matrix

Rows = true label, columns = predicted label. Shows where urgent cases are misrouted.

```
              Pred 1  Pred 2  Pred 3  Pred 4  Pred 5
True Level 1    45      12       8       2       1
True Level 2    ...
```

### Per-class precision, recall, F1

\[
\text{Precision}_k = \frac{TP_k}{TP_k + FP_k}, \quad
\text{Recall}_k = \frac{TP_k}{TP_k + FN_k}
\]

\[
F1_k = 2 \cdot \frac{\text{Precision}_k \cdot \text{Recall}_k}{\text{Precision}_k + \text{Recall}_k}
\]

### Macro-F1

Average F1 across all five classes (equal weight per class):

\[
\text{Macro-F1} = \frac{1}{K} \sum_{k=1}^{K} F1_k
\]

Better than accuracy for imbalanced data.

### Weighted-F1

F1 weighted by class support — closer to accuracy; use macro-F1 as primary.

## Primary success criteria (clinical)

| Metric | Baseline concern | Target after mitigation |
|--------|------------------|-------------------------|
| **Level 1 recall** | Near 0% possible | **Increase** (any improvement is meaningful) |
| **Level 2 recall** | Under-predicted | Increase |
| Macro-F1 | Low | Higher than baseline |
| Level 3 accuracy | High (easy class) | May drop slightly — acceptable trade-off |

## Validation protocol

1. Use **same stratified split** (seed=42) for baseline and new model
2. Never train on validation data
3. Compare `triage_new.ipynb` checkpoint vs `fine_tuned_biobert_triage_smote/` on identical val set
4. Log results in a table in the notebook final cell

## Implementation

`colab/metrics.py` provides:

- `compute_metrics(eval_pred)` — Hugging Face Trainer callback
- `plot_confusion_matrix(y_true, y_pred, labels)` — seaborn heatmap
- `print_classification_report(y_true, y_pred)` — sklearn report

## What to tell your professor

> "We addressed the 9:1 imbalance with stratified splitting, text augmentation and oversampling on Levels 1–2, and weighted sampling during training. We evaluate with per-class recall and macro-F1, prioritising Level 1 recall because false negatives on Red cases are clinically unacceptable."

## Metrics not in scope (future work)

- Calibration plots (confidence vs accuracy)
- Evaluation on held-out `test.csv` (20k)
- Cohen's κ vs nurse labels
- Cost-sensitive metrics (weight false negatives on Level 1 higher)

See [06-risks-and-limitations.md](06-risks-and-limitations.md).
