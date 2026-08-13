#!/usr/bin/env bash
# Assemble triage-smote-colab/ for Google Drive upload.
# Run from fine-tuned-biobert/:  ./scripts/build-colab-bundle.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
BUNDLE="$ROOT/triage-smote-colab"
SRC_IMB="$ROOT/imbalance-mitigation"
CSV_DIR="$ROOT/csv files"
BUNDLE_NAME="triage-smote-colab"
DRIVE_BUNDLE_ROOT="/content/drive/MyDrive/${BUNDLE_NAME}"

echo "Building Colab bundle at: $BUNDLE"

rm -rf "$BUNDLE"
mkdir -p "$BUNDLE/data" "$BUNDLE/colab" "$BUNDLE/output" "$BUNDLE/docs"

# --- Python helpers + notebook (source of truth: imbalance-mitigation/colab) ---
cp "$SRC_IMB/colab/"*.py "$BUNDLE/colab/"
cp "$SRC_IMB/colab/triage_smote_augmented.ipynb" "$BUNDLE/colab/"
cp "$SRC_IMB/requirements-colab.txt" "$BUNDLE/"
cp "$SRC_IMB/docs/"*.md "$BUNDLE/docs/"

# --- CSV data ---
TRAIN_SRC="$CSV_DIR/train.csv"
COMPLAINTS_SRC="$CSV_DIR/chief_complaints.csv"
MISSING=()
[[ -f "$TRAIN_SRC" ]] || MISSING+=("train.csv")
[[ -f "$COMPLAINTS_SRC" ]] || MISSING+=("chief_complaints.csv")

if [[ ${#MISSING[@]} -gt 0 ]]; then
  echo "ERROR: Missing required CSV files in '$CSV_DIR':"
  for f in "${MISSING[@]}"; do echo "  - $f"; done
  echo ""
  echo "Download from: https://www.kaggle.com/competitions/triagegeist/data"
  echo "Place train.csv and chief_complaints.csv in: $CSV_DIR"
  exit 1
fi

cp "$TRAIN_SRC" "$BUNDLE/data/train.csv"
cp "$COMPLAINTS_SRC" "$BUNDLE/data/chief_complaints.csv"
echo "Copied train.csv and chief_complaints.csv -> data/"

# --- paths.py (single edit point for Google Drive) ---
cat > "$BUNDLE/colab/paths.py" << EOF
"""Google Drive paths for triage-smote-colab bundle.

Edit BUNDLE_ROOT only if you renamed the folder on Drive.
"""

# === EDIT ONLY THIS if your Drive folder has a different name ===
BUNDLE_ROOT = "${DRIVE_BUNDLE_ROOT}"

# Input data (CSVs uploaded with the bundle)
DATA_DIR = f"{BUNDLE_ROOT}/data"
TRAIN_CSV = f"{DATA_DIR}/train.csv"
COMPLAINTS_CSV = f"{DATA_DIR}/chief_complaints.csv"

# Python helpers (this colab/ folder)
HELPERS_DIR = f"{BUNDLE_ROOT}/colab"

# === Model output on Google Drive (saved after training) ===
MODEL_OUTPUT_DIR = f"{BUNDLE_ROOT}/output/fine_tuned_biobert_triage_smote"

# Alias used by training code
OUTPUT_DIR = MODEL_OUTPUT_DIR
EOF

touch "$BUNDLE/output/.gitkeep"

# --- Bundle README ---
cat > "$BUNDLE/README.md" << 'EOF'
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
EOF

echo ""
echo "Done. Upload to Drive:"
echo "  $BUNDLE"
echo "  -> MyDrive/${BUNDLE_NAME}/"
echo ""
echo "Model will save to:"
echo "  ${DRIVE_BUNDLE_ROOT}/output/fine_tuned_biobert_triage_smote/"
