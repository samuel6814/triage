# 03 — Data Augmentation for Chief Complaints

## Goal

Give the model **more diverse examples** of rare urgent complaints so it does not only memorise 3,222 Red-case phrasings.

Augmentation runs on the **training split only**. Never augment validation data.

## Techniques used

### 1. Synonym replacement (`nlpaug`)

Replace non-medical words with synonyms. Medical tokens (from a small keyword list) are protected.

**Before:** `thunderclap headache, worsening with movement`  
**After:** `thunderclap headache, deteriorating with movement`

### 2. Random word swap

Swap two adjacent non-keyword tokens. Preserves symptom anchors.

**Before:** `crushing central chest pain`  
**After:** `central crushing chest pain`

### 3. Random deletion (light)

Remove one filler word with 10% probability per augmentation. Skips if text would become too short.

### 4. Back-translation (optional, slow)

English → French → English via `nlpaug`. Disabled by default (`USE_BACK_TRANSLATION = False` in `config.py`). Enable only if Colab runtime is not time-limited.

## Which classes to augment

| Level | Augmentation intensity | Rationale |
|-------|------------------------|-----------|
| 1 (Red) | **High** — `AUGMENT_PER_SAMPLE = 2` | Rarest; highest clinical cost if missed |
| 2 (Orange) | **Medium** — `AUGMENT_PER_SAMPLE = 1` | Second priority |
| 3–5 | None by default | Already well represented |

Configured in `colab/config.py`:

```python
AUGMENT_CLASSES = [1, 2]
AUGMENT_PER_SAMPLE = {1: 2, 2: 1}
```

## Example transformations

From project inference examples (`biobertStats.js`):

| Original (Level 2) | Augmented variant |
|--------------------|-------------------|
| `thunderclap headache, worsening with movement` | `thunderclap headache, worsening on movement` |
| `acute angle closure glaucoma with associated nausea` | `acute angle closure glaucoma with nausea` |

Augmented rows keep the **same label** as the source row. A new column `is_augmented=True` marks synthetic rows for analysis.

## Protected keywords

Symptom and urgency terms are not swapped or deleted:

`pain`, `chest`, `headache`, `fever`, `bleeding`, `unconscious`, `breath`, `heart`, `stroke`, `seizure`, `trauma`, `fracture`, `vomit`, `nausea`, `glaucoma`, etc.

See `MEDICAL_KEYWORDS` in `colab/augmentation.py`.

## Augmentation vs SMOTE

| | Augmentation | SMOTE (embedding) |
|--|--------------|-------------------|
| Output | New text string | New vector → mapped to existing text |
| Linguistic diversity | High | Low |
| Implementation | `augmentation.py` | `imbalance.py` |
| Default pipeline | **Yes** | Optional analysis |

Use both: augmentation first (new phrases), then oversample to hit `TARGET_COUNTS`.

## Risks

- Augmented text may be grammatically odd — usually acceptable for robustness
- Over-augmentation on tiny classes can cause **memorisation** of patterns — monitor validation F1
- Back-translation can change clinical meaning — keep disabled unless validated manually
