"""BioBERT triage inference — mirrors fine-tuned-biobert/triage_new.ipynb."""

import os
import re
from pathlib import Path

from dotenv import load_dotenv
from transformers import AutoModelForSequenceClassification, AutoTokenizer, pipeline

load_dotenv(Path(__file__).resolve().parent.parent / ".env")

# Default = baseline (original triage_new.ipynb fine-tune, no SMOTE)
DEFAULT_MODEL_PATH = (
    Path(__file__).resolve().parent.parent.parent.parent
    / "fine-tuned-biobert"
    / "fine_tuned_biobert_triage-20260602T132911Z-3-001"
    / "fine_tuned_biobert_triage"
)

# Alternate checkpoint from imbalance-mitigation Colab (optional MODEL_PATH override)
SMOTE_MODEL_PATH = (
    Path(__file__).resolve().parent.parent.parent.parent
    / "fine-tuned-biobert"
    / "fine_tuned_biobert_triage_smote"
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


def model_variant() -> str:
    resolved = str(resolve_model_path())
    if "smote" in resolved.lower():
        return "smote"
    return "baseline"


def resolve_model_source() -> tuple[str, bool]:
    """Return (source, is_local).

    Prefer MODEL_ID (a Hugging Face Hub repo id, e.g. "user/curatio-biobert")
    when set, which lets the deployed service pull weights from the Hub instead
    of bundling the 414MB file. Falls back to a local MODEL_PATH for dev.
    """
    model_id = os.getenv("MODEL_ID", "").strip()
    if model_id:
        return model_id, False
    return str(resolve_model_path()), True


def load_model():
    """Load tokenizer + classification pipeline once."""
    global _pipeline, _model_path

    if _pipeline is not None:
        return _pipeline

    source, is_local = resolve_model_source()
    _model_path = source

    if is_local:
        local_dir = Path(source)
        if not (local_dir / "model.safetensors").exists() and not (
            local_dir / "pytorch_model.bin"
        ).exists():
            raise FileNotFoundError(
                f"Model weights not found at {local_dir}. "
                "Set MODEL_PATH (local dir) or MODEL_ID (Hugging Face Hub repo id)."
            )

    tokenizer = AutoTokenizer.from_pretrained(source)
    model = AutoModelForSequenceClassification.from_pretrained(source)

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


def _fetch_entities(text: str, *, enabled: bool) -> dict | None:
    from openmed_enrich import analyze_entities, is_enabled

    if not enabled or not is_enabled():
        return None
    try:
        return analyze_entities(text)
    except Exception:
        return None


def predict(text: str, *, openmed: bool = True, gate: bool = True) -> dict:
    """Run medical gate + OpenMed enrichment (both default on), then BioBERT inference."""
    text = (text or "").strip()
    if not text:
        raise ValueError("text must not be empty")

    from medical_gate import evaluate as gate_evaluate, rejection_payload
    from openmed_enrich import build_entity_prefix, entity_prefix_enabled

    entities = _fetch_entities(text, enabled=openmed)
    gate_result = None
    if gate:
        gate_result = gate_evaluate(text, entities)
        if not gate_result.is_medical:
            return rejection_payload(text, gate_result, entities)

    model_input = text
    if openmed and entity_prefix_enabled() and entities:
        prefix = build_entity_prefix(entities)
        if prefix:
            model_input = f"{prefix} {text}".strip()

    pipe = load_model()
    results = pipe(model_input, truncation=True, max_length=128)

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
            {
                "level": level,
                "class_index": idx,
                "probability": float(item["score"]),
            }
        )

    probabilities.sort(key=lambda x: x["probability"], reverse=True)
    best = probabilities[0]
    confidence = best["probability"]
    acuity = best["level"]
    sats = SATS_BY_ACUITY.get(acuity, "Green")

    response = {
        "text": text,
        "is_medical_complaint": True,
        "predicted_acuity_level": acuity,
        "predicted_class_index": best["class_index"],
        "confidence": confidence,
        "probabilities": probabilities,
        "sats_colour": sats,
        "bayesian_candidate": confidence < CONFIDENCE_THRESHOLD,
        "calibration_warning": confidence >= 0.999,
    }
    if gate_result is not None:
        response["clinical_relevance_score"] = gate_result.clinical_relevance_score
        response["gate_signals"] = gate_result.signals
    if entities is not None:
        response["entities"] = entities
    return response


def health_info() -> dict:
    source, is_local = resolve_model_source()
    if is_local:
        local_dir = Path(source)
        weights_ok = (local_dir / "model.safetensors").exists() or (
            local_dir / "pytorch_model.bin"
        ).exists()
    else:
        # Hub source: weights are fetched on load; treat as available.
        weights_ok = True
    return {
        "model_path": source,
        "model_source": "local" if is_local else "huggingface_hub",
        "model_variant": model_variant(),
        "weights_found": weights_ok,
        "model_loaded": _pipeline is not None,
    }
