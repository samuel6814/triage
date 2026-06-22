# Colab Run Guide — SMOTE + Augmentation Training

**All training runs in Google Colab only.** Do not run ML code on your local machine.

## Before you start

- [ ] Google account with Google Drive space (~2 GB free for model + data)
- [ ] Colab runtime: **GPU** (Runtime → Change runtime type → T4 GPU)
- [ ] Triagegeist CSV files on Drive:
  - `train.csv` (80,000 rows)
  - `chief_complaints.csv` (100,000 rows)
- [ ] Hugging Face token (optional) if using a gated model

Data source: [Triagegeist Kaggle](https://www.kaggle.com/competitions/triagegeist/data)

---

## Files to upload to Google Drive

Create a folder on Drive, e.g. `MyDrive/imbalance-mitigation/`:

```
MyDrive/
├── triagegeist/data/
│   ├── train.csv
│   └── chief_complaints.csv
└── imbalance-mitigation/
    ├── requirements-colab.txt
    └── colab/
        ├── triage_smote_augmented.ipynb   ← open this in Colab
        ├── config.py
        ├── data_merge.py
        ├── augmentation.py
        ├── imbalance.py
        ├── metrics.py
        └── paths.py                       ← copy from paths.example.py
```

**Alternative:** Clone your GitHub repo in Colab (`!git clone ...`) and point paths to the cloned `fine-tuned-biobert/imbalance-mitigation/colab/` folder.

---

## Setup `paths.py`

Copy `colab/paths.example.py` → `colab/paths.py` and edit:

```python
DATA_DIR = "/content/drive/MyDrive/triagegeist/data"
TRAIN_CSV = f"{DATA_DIR}/train.csv"
COMPLAINTS_CSV = f"{DATA_DIR}/chief_complaints.csv"
OUTPUT_DIR = "/content/drive/MyDrive/fine_tuned_biobert_triage_smote"
HELPERS_DIR = "/content/drive/MyDrive/imbalance-mitigation/colab"
```

---

## Cell-by-cell expectations

| Cell | What it does | What you should see |
|------|--------------|---------------------|
| **1** | `pip install` + GPU check | `CUDA available: True`, GPU name T4 |
| **2** | Mount Drive, set paths | Permission popup; paths printed |
| **3** | Merge CSVs, stratified split | Level 1: ~3,222 total; train ~2,900; val ~322 |
| **4** | Augment + oversample | Train grows to ~70k+ rows; Level 1 → ~10,000 |
| **5** | Bar charts | Two plots: before vs after balance |
| **6** | Optional embedding SMOTE | Skipped unless `USE_EMBEDDING_SMOTE=True` |
| **7** | Tokenize | Train/val token counts printed |
| **8** | Train 3 epochs | Progress bar ~25–40 min on T4 |
| **9** | Confusion matrix + recall | Per-class report; **Level 1 recall** highlighted |
| **10** | Save to Drive | `model.safetensors` in output folder |

---

## Expected class counts (default config)

After Cell 4 with default `TARGET_COUNTS = {1: 10000, 2: 15000}`:

| Level | Train (before) | Train (after) |
|-------|----------------|---------------|
| 1 | ~2,900 | **~10,000** |
| 2 | ~12,100 | **~15,000** |
| 3 | ~26,000 | ~26,000 |
| 4 | ~20,700 | ~20,700 |
| 5 | ~10,300 | ~10,300 |

Exact numbers depend on stratified split and augmentation randomness.

---

## Tuning knobs (`colab/config.py`)

| Setting | Default | When to change |
|---------|---------|----------------|
| `TARGET_COUNTS[1]` | 10,000 | Level 1 recall still low → increase |
| `AUGMENT_PER_SAMPLE[1]` | 2 | More paraphrases for Red cases |
| `USE_EMBEDDING_SMOTE` | False | Professor wants classic SMOTE demo |
| `BATCH_SIZE` | 16 | OOM error → set to 8 |
| `NUM_EPOCHS` | 3 | Match baseline; try 4 if underfitting |

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `FileNotFoundError` for CSV | Check `paths.py` paths; run `!ls` on DATA_DIR |
| `ModuleNotFoundError: config` | Set `HELPERS_DIR` in Cell 2 `sys.path` |
| CUDA OOM | `BATCH_SIZE = 8` in config.py |
| Training very slow | Confirm GPU runtime (not CPU) |
| nlpaug errors | Augmentation uses simple fallbacks; back-translation stays off |
| `ignore_mismatched_sizes` warning | Normal when loading 3-class checkpoint into 5-class head |

---

## Compare with baseline

Keep your original `triage_new.ipynb` model at:

```
MyDrive/fine_tuned_biobert_triage/
```

Run Cell 9 metrics on **both** models using the **same** `val_df` (seed=42) and compare:

| Metric | Baseline | SMOTE+Aug |
|--------|----------|-----------|
| Level 1 recall | ? | ? |
| Level 2 recall | ? | ? |
| Macro-F1 | ? | ? |

Document results in your report.

---

## Use new model in Curatio (inference only — local)

Training stays in Colab. For local inference:

1. Download from Drive:
   - `fine_tuned_biobert_triage_smote/model.safetensors`
   - `config.json`, `tokenizer.json`, `tokenizer_config.json`
2. Place in:
   ```
   fine-tuned-biobert/fine_tuned_biobert_triage_smote/
   ```
3. Set in `curatio/server/.env`:
   ```
   MODEL_PATH=../../fine-tuned-biobert/fine_tuned_biobert_triage_smote
   ```
4. Restart the Curatio ML server and test on `/test`

Fusion (TEWS + Bayesian) rules are unchanged — still required at inference.

---

## Re-run checklist

1. Edit `config.py` if needed
2. Runtime → Restart session
3. Run all cells top to bottom
4. Save notebook to Drive (File → Save a copy in Drive)

---

## Related docs

- [README.md](README.md) — folder overview
- [docs/01-problem-and-imbalance.md](docs/01-problem-and-imbalance.md) — why we do this
- [docs/02-smote-for-text.md](docs/02-smote-for-text.md) — SMOTE theory
- [docs/05-evaluation-metrics.md](docs/05-evaluation-metrics.md) — what metrics to report
