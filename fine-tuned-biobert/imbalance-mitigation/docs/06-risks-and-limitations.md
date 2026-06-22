# 06 — Risks and Limitations

## Oversampling risks

### Exact duplicates

Random oversampling copies real rows. The model may **memorise** specific patient phrasings rather than generalise.

**Mitigation:** Text augmentation creates paraphrases before oversampling; weighted sampling reduces duplicate dominance in batches.

### Synthetic SMOTE embeddings

Embedding-space SMOTE does not create new clinical sentences — it picks the nearest real text to a synthetic 768-d point. The "synthetic" label is correct but the text is not novel.

**Mitigation:** Prefer augmentation (doc 03) for linguistic diversity; use embedding-SMOTE for analysis only.

## Augmentation risks

- Synonym swap may produce ungrammatical or ambiguous phrases
- Back-translation can alter clinical meaning (e.g. severity words)
- Augmented rows share labels with source — if source label was nurse error, error is duplicated

**Mitigation:** Protect medical keywords; keep back-translation off by default; spot-check 20 augmented Level-1 examples manually.

## Training risks

### Overfitting to minority class patterns

Boosting Level 1 from 4% to ~12% of training data can increase **false positives** on Level 1 (Green patients predicted Red).

**Mitigation:** Monitor precision on Level 1, not just recall. Compare confusion matrix before/after.

### Validation leakage

Augmenting or oversampling the validation set would inflate metrics.

**Mitigation:** Pipeline applies balance steps **only to `train_df`** after stratified split.

## Modelling limitations (unchanged)

| Limitation | Detail |
|------------|--------|
| Text-only | Vitals discarded — same as baseline |
| Nominal classes | Ordinal structure (1 < 2 < … < 5) not used in loss |
| 128-token cap | Long complaints truncated |
| No test.csv eval | 20k held-out set still not evaluated in notebook |

## Deployment limitations

Training fixes in Colab **do not replace** Curatio's fusion safety rules:

- TEWS vitals pathway
- Bayesian fallback on low confidence
- Fusion priority checklist (never under-triage strong language)

A better-trained BioBERT improves the NLP pathway; fusion still required at inference.

## When imbalance mitigation is not enough

If Level 1 recall remains low after SMOTE + augmentation:

1. Increase `TARGET_COUNTS[1]` further
2. Add **class weights** to loss (`trainer` with weighted CE)
3. Try **focal loss** for hard examples
4. Consider **binary** urgent vs non-urgent stage before 5-class head
5. Include vitals in a multimodal model (separate project scope)

## Reproducibility

Set `RANDOM_SEED = 42` in `config.py`. Colab GPU nondeterminism may cause small metric variance between runs.

## Data provenance

Triagegeist-style data; nurse labels may contain noise. Imbalance mitigation improves **learning signal** but cannot fix incorrect labels.
