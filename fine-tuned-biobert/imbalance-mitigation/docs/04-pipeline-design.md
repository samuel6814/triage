# 04 — Pipeline Design

## Overview

```mermaid
flowchart LR
  A[train.csv + chief_complaints.csv] --> B[merge + encode labels]
  B --> C[stratified 90/10 split]
  C --> D[augment train minority]
  D --> E[oversample to TARGET_COUNTS]
  E --> F[tokenize max_length=128]
  F --> G[WeightedRandomSampler]
  G --> H[BioBERT fine-tune 3 epochs]
  H --> I[per-class metrics + save]
```

## Step-by-step

### 1. Environment (Colab)

- GPU runtime (T4 or better)
- `pip install -r requirements-colab.txt`
- Mount Google Drive
- Add `colab/` folder to Python path

### 2. Data merge

`data_merge.py`:

```python
df = merge_and_encode(train_csv, complaints_csv)
# columns: text, label, acuity_level
```

Same logic as `triage_new.ipynb`: inner join on `patient_id`, drop nulls, category codes 0–4 mapping to acuity 1–5.

### 3. Stratified split

```python
train_df, val_df = stratified_split(df, test_size=0.1, seed=42)
```

**Change from baseline:** `stratify=labels` ensures ~322 Level-1 cases in validation (not 300±20 random noise).

### 4. Augment (train only)

```python
train_df = augment_minority_classes(train_df)
```

Adds paraphrased rows for Levels 1 and 2. Validation set is untouched.

### 5. Oversample (train only)

```python
train_df = balance_dataset(train_df, TARGET_COUNTS)
```

Random oversample with replacement until minority targets met.

### 6. Tokenize

- Model: `dmis-lab/biobert-base-cased-v1.2` or your existing `Yuvrajxms09/biobert-triage-classifier`
- `max_length=128`, `padding=max_length`, `truncation=True`

### 7. Weighted sampling

`WeightedRandomSampler` assigns each sample a weight inversely proportional to class frequency in the **balanced** train set. Prevents remaining skew from dominating batches.

### 8. Training

| Hyperparameter | Value | Notes |
|----------------|-------|-------|
| Epochs | 3 | Match baseline for fair comparison |
| Batch size | 16 | Reduce to 8 if OOM |
| Learning rate | 2e-5 | Standard BERT fine-tuning |
| FP16 | True | Colab GPU |
| Eval | Every epoch | + `compute_metrics` |

### 9. Output

Save to:

```
/content/drive/MyDrive/fine_tuned_biobert_triage_smote/
```

## Baseline vs new pipeline

| Step | `triage_new.ipynb` | `triage_smote_augmented.ipynb` |
|------|--------------------|--------------------------------|
| Split | Random 90/10 | **Stratified** 90/10 |
| Train data | Raw ~72k | **Augmented + oversampled** |
| Sampling | Uniform | **WeightedRandomSampler** |
| Metrics | `eval_loss` only | **F1, recall, confusion matrix** |
| Output dir | `fine_tuned_biobert_triage/` | `fine_tuned_biobert_triage_smote/` |

## Configuration

All tunables live in `colab/config.py`:

```python
TARGET_COUNTS = {1: 10_000, 2: 15_000}
AUGMENT_CLASSES = [1, 2]
AUGMENT_PER_SAMPLE = {1: 2, 2: 1}
USE_EMBEDDING_SMOTE = False  # set True for optional SMOTE cell
RANDOM_SEED = 42
MAX_LENGTH = 128
NUM_EPOCHS = 3
BATCH_SIZE = 16
LEARNING_RATE = 2e-5
```

## Optional: embedding-SMOTE analysis cell

If `USE_EMBEDDING_SMOTE = True`, the notebook:

1. Encodes train texts with frozen BioBERT
2. Runs SMOTE on minority class embeddings
3. Maps synthetic points to nearest real texts
4. Plots 2D PCA of before/after class distribution

This is for **understanding** SMOTE; default training uses augmentation + random oversample.
