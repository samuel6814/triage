# 02 — SMOTE for Text Classification

## What is SMOTE?

**SMOTE** (Synthetic Minority Over-sampling Technique) creates new training examples for rare classes by interpolating between existing samples in **numeric feature space**.

For two minority samples \(\mathbf{x}_a\) and \(\mathbf{x}_b\) (feature vectors):

\[
\mathbf{x}_{\text{new}} = \mathbf{x}_a + \lambda (\mathbf{x}_b - \mathbf{x}_a), \quad \lambda \in [0, 1]
\]

SMOTE picks \(\mathbf{x}_a\), finds its \(k\) nearest minority neighbors, chooses one as \(\mathbf{x}_b\), and generates \(\mathbf{x}_{\text{new}}\).

**Library:** `imbalanced-learn` (`from imblearn.over_sampling import SMOTE`)

## Why you cannot SMOTE raw text directly

Chief complaints are **strings**, not numeric vectors. You cannot interpolate between:

- `"thunderclap headache, worsening with movement"`
- `"crushing central chest pain radiating to left arm"`

There is no meaningful \(\lambda\) between two sentences in token space.

## Three options for NLP triage

### Option A — Random oversampling (simplest)

Duplicate minority rows until each class reaches a target count.

| Pros | Cons |
|------|------|
| Easy to implement | Exact copies → overfitting risk |
| Preserves real clinical text | No new linguistic diversity |

**Implemented in:** `colab/imbalance.py` → `random_oversample()`

### Option B — Embedding-space SMOTE (professor’s SMOTE concept)

1. Encode each complaint with a **frozen** BioBERT model → 768-d `[CLS]` vector
2. Apply SMOTE on the embedding matrix (minority classes only)
3. For each synthetic embedding, assign the **nearest real minority complaint text**

| Pros | Cons |
|------|------|
| True SMOTE mathematics | Synthetic point maps to existing text (not a new phrase) |
| Good for analysis / visualisation | Extra GPU step before training |

**Implemented in:** `colab/imbalance.py` → `embedding_smote_oversample()` (optional cell in notebook)

### Option C — Text data augmentation (recommended alongside A or B)

Generate **new complaint strings** via synonym swap, word shuffle, or back-translation. See [03-data-augmentation.md](03-data-augmentation.md).

**Implemented in:** `colab/augmentation.py`

## Recommended combined strategy

We use **C + A** as the default pipeline:

1. Augment Levels 1 and 2 (new paraphrased text)
2. Random oversample to `TARGET_COUNTS` in `config.py`
3. Optionally run embedding-SMOTE analysis to visualise class separation

Default targets (partial rebalance — not forced 1:1 across all five classes):

```python
TARGET_COUNTS = {
    1: 10_000,   # boost from 3,222
    2: 15_000,   # boost from 13,439
}
# Levels 3, 4, 5 keep natural counts
```

Edit `colab/config.py` to change targets. Full 1:1 balance is possible but may over-correct majority classes.

## SMOTE parameters (when using Option B)

| Parameter | Default | Meaning |
|-----------|---------|---------|
| `k_neighbors` | 5 | Neighbors for interpolation (capped by minority count − 1) |
| `random_state` | 42 | Reproducibility |

For Level 1 with only ~2,900 training samples after split, SMOTE uses fewer neighbors automatically.

## Before vs after (expected train counts)

Approximate training set after 90/10 stratified split (~72k rows), then augmentation + oversampling:

| Level | Before (train) | After (default targets) |
|-------|----------------|-------------------------|
| 1 | ~2,900 | ~10,000 |
| 2 | ~12,100 | ~15,000 |
| 3 | ~26,000 | ~26,000 (unchanged) |
| 4 | ~20,700 | ~20,700 |
| 5 | ~10,300 | ~10,300 |

Exact numbers print in the notebook after the balance step.
