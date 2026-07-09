"""Copy this file to paths.py and set your Google Drive paths.

Recommended: use the triage-smote-colab bundle (see ../scripts/build-colab-bundle.sh).
"""

# === EDIT ONLY THIS if your Drive folder has a different name ===
BUNDLE_ROOT = "/content/drive/MyDrive/triage-smote-colab"

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
