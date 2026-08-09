"""Optional OpenMed NER + PII sidecar for Curatio triage inference."""

from __future__ import annotations

import os
import re
from typing import Any

DISEASE_MODEL = "disease_detection_superclinical"
PHARMA_MODEL = "pharma_detection_superclinical"

_openmed_loaded = False
_negation_cues: tuple[re.Pattern[str], ...] | None = None


def is_enabled() -> bool:
    raw = os.getenv("OPENMED_ENABLED", "true").strip().lower()
    return raw in {
        "1",
        "true",
        "yes",
        "on",
    }


def entity_prefix_enabled() -> bool:
    raw = os.getenv("OPENMED_ENTITY_PREFIX", "true").strip().lower()
    return raw in {
        "1",
        "true",
        "yes",
        "on",
    }


def health_info() -> dict[str, Any]:
    return {
        "openmed_enabled": is_enabled(),
        "openmed_loaded": _openmed_loaded,
        "entity_prefix_enabled": entity_prefix_enabled(),
        "disease_model": DISEASE_MODEL,
        "pharma_model": PHARMA_MODEL,
    }


def _ensure_openmed():
    global _openmed_loaded
    if not is_enabled():
        raise RuntimeError(
            "OpenMed is disabled. Set OPENMED_ENABLED=true to use entity enrichment."
        )
    # DeBERTa-v2 PII models reject SDPA; OpenMed auto-picks sdpa when available.
    os.environ.setdefault("OPENMED_TORCH_ATTENTION_BACKEND", "eager")
    try:
        import openmed  # noqa: F401
    except ImportError as exc:
        raise RuntimeError(
            "openmed package not installed. Run: pip install openmed==1.7.0"
        ) from exc
    _openmed_loaded = True


def _negation_patterns() -> tuple[re.Pattern[str], ...]:
    global _negation_cues
    if _negation_cues is not None:
        return _negation_cues

    try:
        from openmed.clinical.context import NEGATION_CUES, PSEUDO_NEGATION_CUES

        cues = sorted(
            {c.lower() for c in (*NEGATION_CUES, *PSEUDO_NEGATION_CUES) if c},
            key=len,
            reverse=True,
        )
    except ImportError:
        cues = [
            "no evidence of",
            "denies",
            "denied",
            "without",
            "negative for",
            "no ",
            "not ",
        ]

    _negation_cues = tuple(
        re.compile(rf"\b{re.escape(cue)}\b", re.IGNORECASE) for cue in cues
    )
    return _negation_cues


def _is_negated(text: str, start: int, end: int) -> bool:
    """Heuristic negation check using ConText-style cues before the entity span."""
    window_start = max(0, start - 80)
    prefix = text[window_start:start]
    for pattern in _negation_patterns():
        if pattern.search(prefix):
            return True
    return False


def _entity_dict(entity: Any, text: str) -> dict[str, Any]:
    start = int(getattr(entity, "start", 0) or 0)
    end = int(getattr(entity, "end", start) or start)
    label = str(getattr(entity, "label", "") or "")
    span_text = str(getattr(entity, "text", "") or text[start:end])
    score = getattr(entity, "score", None)
    negated = _is_negated(text, start, end)
    return {
        "text": span_text,
        "label": label,
        "start": start,
        "end": end,
        "score": round(float(score), 4) if score is not None else None,
        "negated": negated,
    }


def _run_model(text: str, model_name: str) -> list[dict[str, Any]]:
    from openmed import analyze_text

    result = analyze_text(
        text,
        model_name=model_name,
        aggregation_strategy="simple",
        confidence_threshold=0.5,
        sentence_detection=False,
    )
    entities = getattr(result, "entities", []) or []
    return [_entity_dict(entity, text) for entity in entities]


def analyze_entities(text: str) -> dict[str, Any]:
    """Extract disease and medication entities with negation flags."""
    _ensure_openmed()
    text = (text or "").strip()
    if not text:
        raise ValueError("text must not be empty")

    diseases = _run_model(text, DISEASE_MODEL)
    drugs = _run_model(text, PHARMA_MODEL)

    negated = [
        e
        for e in (*diseases, *drugs)
        if e.get("negated") and e.get("text")
    ]

    return {
        "diseases": diseases,
        "drugs": drugs,
        "negated": negated,
        "disease_count": len(diseases),
        "drug_count": len(drugs),
        "has_negated_critical_symptom": bool(negated),
    }


def build_entity_prefix(entities: dict[str, Any]) -> str:
    """Build a structured prefix for BioBERT text-prefix enrichment (experiment A)."""
    disease_terms = [
        e["text"]
        for e in entities.get("diseases", [])
        if e.get("text") and not e.get("negated")
    ]
    drug_terms = [
        e["text"]
        for e in entities.get("drugs", [])
        if e.get("text") and not e.get("negated")
    ]

    parts: list[str] = []
    if disease_terms:
        parts.append(f"[DISEASE: {', '.join(dict.fromkeys(disease_terms))}]")
    if drug_terms:
        parts.append(f"[DRUG: {', '.join(dict.fromkeys(drug_terms))}]")
    return " ".join(parts)


def enrich_text_for_prediction(text: str) -> tuple[str, dict[str, Any] | None]:
    """Prefix complaint text with OpenMed entity tags when enabled."""
    if not is_enabled():
        return text, None

    entities = analyze_entities(text)
    if not entity_prefix_enabled():
        return text, entities

    prefix = build_entity_prefix(entities)
    if not prefix:
        return text, entities
    return f"{prefix} {text}".strip(), entities


def deidentify_text(text: str, method: str = "mask") -> dict[str, Any]:
    """De-identify clinical text for training-data hygiene."""
    _ensure_openmed()
    from openmed import deidentify

    text = (text or "").strip()
    if not text:
        raise ValueError("text must not be empty")

    allowed = {"mask", "replace", "hash", "shift_dates"}
    if method not in allowed:
        raise ValueError(f"method must be one of {sorted(allowed)}")

    result = deidentify(text, method=method)
    safe_text = getattr(result, "deidentified_text", None) or getattr(
        result, "text", str(result)
    )
    entities = getattr(result, "entities", None) or []
    return {
        "original_length": len(text),
        "deidentified_text": safe_text,
        "method": method,
        "entity_count": len(entities),
    }
