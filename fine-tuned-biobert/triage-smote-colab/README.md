# triage-smote-colab — Google Colab Upload Bundle

Upload **this entire folder** to Google Drive as `MyDrive/triage-smote-colab/`.

## Quick start

1. Upload `triage-smote-colab/` to Google Drive.
2. Open `colab/triage_smote_augmented.ipynb` in Google Colab.
3. Runtime → Change runtime type → **GPU (T4)**.
4. Run all cells top to bottom.

## Google Drive paths (set in `colab/paths.py`)

| Purpose | Path |
|---------|------|
| Input data | `MyDrive/triage-smote-colab/data/` |
| Code | `MyDrive/triage-smote-colab/colab/` |
| **Saved model** | `MyDrive/triage-smote-colab/output/fine_tuned_biobert_triage_smote/` |

If you renamed the folder on Drive, edit **only** `BUNDLE_ROOT` in `colab/paths.py`.

## After training

Download from Drive (or use in Colab):

- `output/fine_tuned_biobert_triage_smote/model.safetensors`
- `config.json`, `tokenizer.json`, `tokenizer_config.json`

For Curatio local inference, place files in `fine-tuned-biobert/fine_tuned_biobert_triage_smote/` and set `MODEL_PATH` in `curatio/server/.env`.

## Rebuild locally

```bash
cd fine-tuned-biobert
./scripts/build-colab-bundle.sh
```

Requires `csv files/train.csv` and `csv files/chief_complaints.csv`.
