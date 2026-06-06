"""BioBERT triage inference — mirrors fine-tuned-biobert/triage_new.ipynb."""

import os
import re
from pathlib import Path

from dotenv import load_dotenv
from transformers import AutoModelForSequenceClassification, AutoTokenizer, pipeline

load_dotenv(Path(__file__).resolve().parent.parent / ".env")

DEFAULT_MODEL_PATH = (
    Path(__file__).resolve().parent.parent.parent.parent
    / "fine-tuned-biobert"
    / "fine_tuned_biobert_triage-20260602T132911Z-3-001"
    / "fine_tuned_biobert_triage"
)

CONFIDENCE_THRESHOLD = float(os.getenv("CONFIDENCE_THRESHOLD", "0.85"))

# Class index k (LABEL_k) -> acuity level k+1 when training used categories 1..5
ACUITY_LEVELS = [1, 2, 3, 4, 5]

SATS_BY_ACUITY = {
    1: "Red",
    2: "Orange",
    3: "Yellow",
    4: "Green",
    5: "Green",
}

_pipeline = None
_model_path = None


def resolve_model_path() -> Path:
    raw = os.getenv("MODEL_PATH", "")
    if raw:
        p = Path(raw)
        if not p.is_absolute():
            p = Path(__file__).resolve().parent / p
        return p.resolve()
    return DEFAULT_MODEL_PATH.resolve()


def load_model():
    """Load tokenizer + classification pipeline once."""
    global _pipeline, _model_path

    if _pipeline is not None:
        return _pipeline

    _model_path = resolve_model_path()
    if not (_model_path / "model.safetensors").exists() and not (
        _model_path / "pytorch_model.bin"
    ).exists():
        raise FileNotFoundError(
            f"Model weights not found at {_model_path}. "
            "Set MODEL_PATH in curatio/server/.env"
        )

    tokenizer = AutoTokenizer.from_pretrained(str(_model_path))
    model = AutoModelForSequenceClassification.from_pretrained(str(_model_path))

    device = -1  # CPU; use 0 for CUDA if available
    try:
        import torch

        if torch.cuda.is_available():
            device = 0
    except ImportError:
        pass

    _pipeline = pipeline(
        "text-classification",
        model=model,
        tokenizer=tokenizer,
        device=device,
        top_k=None,
    )
    return _pipeline


def _label_to_class_index(label: str) -> int:
    m = re.match(r"LABEL_(\d+)", label)
    if not m:
        raise ValueError(f"Unexpected label format: {label}")
    return int(m.group(1))


def _class_index_to_acuity(class_index: int) -> int:
    if 0 <= class_index < len(ACUITY_LEVELS):
        return ACUITY_LEVELS[class_index]
    return class_index + 1


def predict(text: str) -> dict:
    text = (text or "").strip()
    if not text:
        raise ValueError("text must not be empty")

    pipe = load_model()
    results = pipe(text, truncation=True, max_length=128)

    # top_k=None returns list of {label, score} for all classes
    if isinstance(results, list) and results and isinstance(results[0], list):
        scores_list = results[0]
    elif isinstance(results, list):
        scores_list = results
    else:
        scores_list = [results]

    probabilities = []
    for item in scores_list:
        idx = _label_to_class_index(item["label"])
        level = _class_index_to_acuity(idx)
        probabilities.append(
            {"level": level, "class_index": idx, "probability": round(float(item["score"]), 4)}
        )

    probabilities.sort(key=lambda x: x["probability"], reverse=True)
    best = probabilities[0]
    confidence = best["probability"]
    acuity = best["level"]
    sats = SATS_BY_ACUITY.get(acuity, "Green")

    return {
        "text": text,
        "predicted_acuity_level": acuity,
        "predicted_class_index": best["class_index"],
        "confidence": confidence,
        "probabilities": probabilities,
        "sats_colour": sats,
        "bayesian_candidate": confidence < CONFIDENCE_THRESHOLD,
    }


def health_info() -> dict:
    path = resolve_model_path()
    weights_ok = (path / "model.safetensors").exists() or (path / "pytorch_model.bin").exists()
    return {
        "model_path": str(path),
        "weights_found": weights_ok,
        "model_loaded": _pipeline is not None,
    }
