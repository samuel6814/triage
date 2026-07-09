# OpenMed integration (Curatio / BioBERT)

[OpenMed](https://github.com/maziyarpanahi/openmed) v1.7.0 is used as an **optional sidecar** for clinical NLP tasks that complement BioBERT triage classification:

| OpenMed capability | Curatio use |
|--------------------|-------------|
| `disease_detection_superclinical` | Extract symptom/condition spans for entity features |
| `pharma_detection_superclinical` | Extract medication spans |
| `deidentify()` | PII-safe training CSVs before Colab fine-tuning |
| Clinical context (negation cues) | Flag negated entities before feature engineering |

OpenMed does **not** predict triage acuity. BioBERT remains the acuity classifier.

## Enable locally

```bash
# curatio/server/ml
export OPENMED_ENABLED=true
# optional: prepend entity tags before BioBERT tokenization
export OPENMED_ENTITY_PREFIX=false
```

Keep `OPENMED_ENABLED=false` on Hugging Face Spaces only if the Space OOMs — baseline BioBERT + two NER models need substantial RAM.

## Install

```bash
pip install openmed==1.7.0
```

## Scripts

| Script | Purpose |
|--------|---------|
| `scripts/deidentify_training_data.py` | Build `chief_complaints_deidentified.csv` |
| `scripts/evaluate_triage.py` | Compare baseline vs SMOTE BioBERT checkpoints |
| `notebooks/entity_features.ipynb` | Batch NER features + text-prefix experiment |

## Default models (bounded memory)

Only two NER models are loaded by default in `curatio/server/ml/openmed_enrich.py`:

- `disease_detection_superclinical`
- `pharma_detection_superclinical`

Track upstream releases at [maziyarpanahi/openmed](https://github.com/maziyarpanahi/openmed), not the empty fork mirror.
