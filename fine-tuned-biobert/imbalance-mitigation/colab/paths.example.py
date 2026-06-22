"""Copy this file to paths.py and set your Google Drive paths."""

# Folder containing train.csv and chief_complaints.csv
DATA_DIR = "/content/drive/MyDrive/triagegeist/data"

TRAIN_CSV = f"{DATA_DIR}/train.csv"
COMPLAINTS_CSV = f"{DATA_DIR}/chief_complaints.csv"

# Where to save the fine-tuned model
OUTPUT_DIR = "/content/drive/MyDrive/fine_tuned_biobert_triage_smote"

# Folder containing this colab/ package (config.py, augmentation.py, etc.)
HELPERS_DIR = "/content/drive/MyDrive/imbalance-mitigation/colab"
