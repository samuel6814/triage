# Imbalance Mitigation — SMOTE + Data Augmentation

This folder documents and packages a **Google Colab-only** retraining pipeline to address class imbalance in the BioBERT triage dataset (~9:1 ratio between Level 3 and Level 1).

**No machine learning runs locally.** Read the docs here; execute training in Colab.

## Quick links

| Document | Purpose |
|----------|---------|
| [COLAB_RUN_GUIDE.md](COLAB_RUN_GUIDE.md) | **Start here** — step-by-step Colab execution |
| [docs/01-problem-and-imbalance.md](docs/01-problem-and-imbalance.md) | Why imbalance matters clinically |
| [docs/02-smote-for-text.md](docs/02-smote-for-text.md) | SMOTE theory applied to NLP |
| [docs/03-data-augmentation.md](docs/03-data-augmentation.md) | Text augmentation techniques |
| [docs/04-pipeline-design.md](docs/04-pipeline-design.md) | Full pipeline architecture |
| [docs/05-evaluation-metrics.md](docs/05-evaluation-metrics.md) | How to measure success |
| [docs/06-risks-and-limitations.md](docs/06-risks-and-limitations.md) | Caveats and safety notes |

## Colab package

**Recommended:** build the upload bundle:

```bash
cd fine-tuned-biobert
./scripts/build-colab-bundle.sh
```

This creates [`../triage-smote-colab/`](../triage-smote-colab/) with data, code, and pre-filled `colab/paths.py`. Upload the whole folder to Drive.

| File | Role |
|------|------|
| `colab/triage_smote_augmented.ipynb` | Main training notebook |
| `colab/paths.py` | Google Drive paths (data + model output) |
| `colab/config.py` | Hyperparameters; `OUTPUT_DIR` set in notebook Cell 2 |
| `colab/data_merge.py` | CSV merge and label encoding |
| `colab/augmentation.py` | Text augmentation for minority classes |
| `colab/imbalance.py` | Oversampling and optional embedding-SMOTE |
| `colab/metrics.py` | Confusion matrix and per-class F1 |
| `colab/paths.example.py` | Reference copy of paths template |

## Baseline comparison

The original notebook [`../triage_new.ipynb`](../triage_new.ipynb) is **unchanged** and serves as the baseline (uniform sampling, no stratification, no augmentation).

The new pipeline saves to `MyDrive/triage-smote-colab/output/fine_tuned_biobert_triage_smote/` on Google Drive.

## Data required (not in git)

- `train.csv` (80,000 rows with `triage_acuity`)
- `chief_complaints.csv` (100,000 rows with `chief_complaint_raw`)

Source: [Triagegeist Kaggle competition](https://www.kaggle.com/competitions/triagegeist/data)
