# 01 — Problem and Class Imbalance

## The data

After merging `train.csv` and `chief_complaints.csv` on `patient_id`, you have **80,000** labeled chief complaints. Each row has:

- **Input:** `chief_complaint_raw` (free-text symptoms)
- **Label:** `triage_acuity` (levels 1–5, nurse-assigned)

## Class distribution

| Level | Clinical meaning | Count | Proportion |
|-------|------------------|-------|------------|
| 1 | Most urgent (Red) | 3,222 | **4.0%** |
| 2 | Highly urgent (Orange) | 13,439 | 16.8% |
| 3 | Moderate (Yellow) | 28,921 | **36.2%** |
| 4 | Less urgent (Green) | 23,020 | 28.8% |
| 5 | Least urgent (Green) | 11,398 | 14.3% |
| **Total** | | **80,000** | 100% |

## The 9:1 imbalance

The majority class (Level 3) has **8.98× more samples** than the minority (Level 1):

\[
\frac{n_3}{n_1} = \frac{28{,}921}{3{,}222} \approx 9 : 1
\]

Your professor’s concern is valid: with this skew, a model can achieve ~36% accuracy by **always predicting Level 3**, while missing every Red and Orange patient.

## What happens during training (baseline)

The current [`triage_new.ipynb`](../triage_new.ipynb) pipeline:

1. Merges CSVs
2. Splits 90/10 with `train_test_split(seed=42)` — **no stratification**
3. Trains with **uniform random sampling** (batch size 16)
4. Uses plain cross-entropy — **no class weights**
5. Reports only `eval_loss` — **no per-class recall**

### Mini-batch effect

With batch size \(B = 16\) and class proportions \(p_k\):

| Level | \(p_k\) | Expected samples per batch |
|-------|---------|---------------------------|
| 1 | 0.040 | **0.64** (often zero) |
| 2 | 0.168 | 2.69 |
| 3 | 0.362 | **5.78** |
| 4 | 0.288 | 4.60 |
| 5 | 0.143 | 2.28 |

Level 1 appears in fewer than one batch in six. The gradient \(\nabla_\theta \mathcal{L}\) is dominated by Levels 3 and 4.

## Clinical risk

| Error type | Consequence |
|------------|-------------|
| **False negative on Level 1** | Red patient routed as Green — delayed resuscitation |
| **False negative on Level 2** | Orange patient under-prioritised |
| False positive on Level 5 | Extra wait time — less dangerous |

Cross-entropy does not encode this asymmetry unless we add **class weights**, **oversampling**, or **augmentation**.

## What we will fix

The Colab pipeline in this folder adds:

1. **Stratified train/validation split** — every class represented proportionally in validation
2. **Text augmentation** on minority classes (Levels 1 and 2)
3. **Controlled oversampling** toward configurable target counts
4. **WeightedRandomSampler** during training
5. **Per-class precision, recall, F1** and confusion matrix

See [04-pipeline-design.md](04-pipeline-design.md) for the full flow.
