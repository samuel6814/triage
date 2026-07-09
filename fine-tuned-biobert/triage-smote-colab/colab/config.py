"""Central configuration for imbalance-mitigation Colab training."""

# --- Paths (set at runtime from paths.MODEL_OUTPUT_DIR in notebook Cell 2) ---
TRAIN_CSV = "train.csv"
COMPLAINTS_CSV = "chief_complaints.csv"
DEIDENTIFIED_COMPLAINTS_CSV = "chief_complaints_deidentified.csv"
OUTPUT_DIR = None  # injected after Drive mount: config.OUTPUT_DIR = paths.MODEL_OUTPUT_DIR

# --- Model ---
MODEL_NAME = "dmis-lab/biobert-base-cased-v1.2"
# Alternative warm-start from prior fine-tune:
# MODEL_NAME = "Yuvrajxms09/biobert-triage-classifier"

TEXT_COLUMN = "chief_complaint_raw"
LABEL_COLUMN = "triage_acuity"

# --- Imbalance targets (acuity levels 1–5, not label codes) ---
# Partial rebalance: boost minority classes; leave 3–5 at natural counts
TARGET_COUNTS = {
    1: 10_000,
    2: 15_000,
}

# --- Augmentation ---
AUGMENT_CLASSES = [1, 2]  # acuity levels to augment
AUGMENT_PER_SAMPLE = {1: 2, 2: 1}  # new variants per original row
USE_BACK_TRANSLATION = False  # slow; enable only if needed

# --- Optional embedding-SMOTE (analysis / alternative balance) ---
USE_EMBEDDING_SMOTE = False
SMOTE_K_NEIGHBORS = 5

# --- Training ---
RANDOM_SEED = 42
TEST_SIZE = 0.1
MAX_LENGTH = 128
NUM_EPOCHS = 3
BATCH_SIZE = 16
LEARNING_RATE = 2e-5
WEIGHT_DECAY = 0.01

# Label code (0–4) to acuity level (1–5) — filled at runtime after merge
LABEL_TO_ACUITY = {}
ACUITY_TO_LABEL = {}
