"""Optional OpenMed NER + PII sidecar for Curatio triage inference."""

from __future__ import annotations

import logging
import os
import re
import threading
from concurrent.futures import ThreadPoolExecutor, TimeoutError as FuturesTimeoutError
from typing import Any

DISEASE_MODEL = "disease_detection_superclinical"
PHARMA_MODEL = "pharma_detection_superclinical"

_DEFAULT_CONFIDENCE = 0.5
# Cold load of two ~434M NER models from disk can take 20–40s; keep a safety net.
_DEFAULT_TIMEOUT_SECONDS = 45.0
_NEGATION_WINDOW = 50
_NER_EXECUTOR = ThreadPoolExecutor(max_workers=1, thread_name_prefix="openmed-ner")
_logger = logging.getLogger(__name__)

# Light expansions for informal Ghanaian chief complaints (NER input only).
_GHANA_SHORTHAND: dict[str, str] = {
    "bp": "blood pressure",
    "rta": "road traffic accident",
    "trotro": "minibus",
    "dm": "diabetes mellitus",
    "htn": "hypertension",
    "sob": "shortness of breath",
    "doa": "dead on arrival",
    "opd": "outpatient department",
    "hpt": "hypertension",
}

_openmed_loaded = False
_models_warmed = False
_loader: Any = None
_loader_lock = threading.Lock()
_negation_cues: tuple[re.Pattern[str], ...] | None = None


def is_enabled() -> bool:
    raw = os.getenv("OPENMED_ENABLED", "true").strip().lower()
    return raw in {"1", "true", "yes", "on"}


def warm_on_startup() -> bool:
    raw = os.getenv("OPENMED_WARM_ON_STARTUP", "true").strip().lower()
    return raw in {"1", "true", "yes", "on"}


def entity_prefix_enabled() -> bool:
    """Prefix BioBERT input with [DISEASE:]/[DRUG:] tags.

    Default **false**: baseline BioBERT was not trained with these prefixes.
    Set OPENMED_ENTITY_PREFIX=true only for prefix experiments.
    """
    raw = os.getenv("OPENMED_ENTITY_PREFIX", "false").strip().lower()
    return raw in {"1", "true", "yes", "on"}


def confidence_threshold() -> float:
    raw = os.getenv("OPENMED_CONFIDENCE_THRESHOLD", str(_DEFAULT_CONFIDENCE))
    try:
        return float(raw)
    except ValueError:
        return _DEFAULT_CONFIDENCE


def timeout_seconds() -> float:
    """Max seconds to wait for NER before returning entities_status=error."""
    raw = os.getenv("OPENMED_TIMEOUT_SECONDS", str(_DEFAULT_TIMEOUT_SECONDS))
    try:
        value = float(raw)
    except ValueError:
        return _DEFAULT_TIMEOUT_SECONDS
    return max(0.5, value)


def health_info() -> dict[str, Any]:
    return {
        "openmed_enabled": is_enabled(),
        "openmed_loaded": _openmed_loaded,
        "openmed_models_warmed": _models_warmed,
        "entity_prefix_enabled": entity_prefix_enabled(),
        "confidence_threshold": confidence_threshold(),
        "timeout_seconds": timeout_seconds(),
        "disease_model": DISEASE_MODEL,
        "pharma_model": PHARMA_MODEL,
    }


def _get_loader():
    """Reuse one OpenMed ModelLoader so pipelines stay in memory."""
    global _loader, _openmed_loaded
    with _loader_lock:
        if _loader is not None:
            return _loader
        os.environ.setdefault("OPENMED_TORCH_ATTENTION_BACKEND", "eager")
        try:
            from openmed.core.models import ModelLoader
        except ImportError as exc:
            raise RuntimeError(
                "openmed package not installed. Run: pip install openmed==1.7.0"
            ) from exc
        _loader = ModelLoader()
        _openmed_loaded = True
        return _loader


def _ensure_openmed():
    if not is_enabled():
        raise RuntimeError(
            "OpenMed is disabled. Set OPENMED_ENABLED=true to use entity enrichment."
        )
    _get_loader()


def warm_ner_models() -> None:
    """Load disease + pharma pipelines into the shared ModelLoader (idempotent)."""
    global _models_warmed
    if not is_enabled() or _models_warmed:
        return
    _ensure_openmed()
    loader = _get_loader()
    from openmed import analyze_text

    # Tiny probe text forces pipeline creation; results discarded.
    probe = "chest pain"
    for model_name in (DISEASE_MODEL, PHARMA_MODEL):
        analyze_text(
            probe,
            model_name=model_name,
            loader=loader,
            aggregation_strategy="simple",
            confidence_threshold=confidence_threshold(),
            sentence_detection=False,
        )
    _models_warmed = True
    _logger.info("OpenMed NER models warmed (%s, %s)", DISEASE_MODEL, PHARMA_MODEL)


def start_background_warmup() -> None:
    """Warm NER models in a daemon thread so startup is not blocked."""
    if not is_enabled() or not warm_on_startup() or _models_warmed:
        return

    def _run():
        try:
            warm_ner_models()
        except Exception as exc:  # noqa: BLE001 — warmup must not crash the API
            _logger.warning("OpenMed warmup failed: %s", exc)

    threading.Thread(target=_run, name="openmed-warmup", daemon=True).start()


def normalize_for_ner(text: str) -> str:
    """Collapse whitespace and expand common local shorthand for NER only."""
    collapsed = re.sub(r"\s+", " ", (text or "").strip())
    if not collapsed:
        return collapsed

    def repl(match: re.Match[str]) -> str:
        key = match.group(0).lower()
        return _GHANA_SHORTHAND.get(key, match.group(0))

    pattern = re.compile(
        r"\b(" + "|".join(re.escape(k) for k in sorted(_GHANA_SHORTHAND, key=len, reverse=True)) + r")\b",
        re.IGNORECASE,
    )
    return pattern.sub(repl, collapsed)


def _negation_patterns() -> tuple[re.Pattern[str], ...]:
    global _negation_cues
    if _negation_cues is not None:
        return _negation_cues

    try:
        from openmed.clinical.context import NEGATION_CUES

        # Omit PSEUDO_NEGATION_CUES — they inflate false positives (e.g. "not only").
        cues = sorted({c.lower() for c in NEGATION_CUES if c}, key=len, reverse=True)
    except ImportError:
        cues = [
            "no evidence of",
            "negative for",
            "denies",
            "denied",
            "without",
            "no",
            "not",
        ]

    _negation_cues = tuple(
        re.compile(rf"\b{re.escape(cue)}\b", re.IGNORECASE) for cue in cues
    )
    return _negation_cues


def _is_negated(text: str, start: int, end: int) -> bool:
    """Heuristic negation check using ConText-style cues before the entity span."""
    window_start = max(0, start - _NEGATION_WINDOW)
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


def merge_overlapping_spans(entities: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Prefer higher-score, then longer, spans when intervals overlap."""
    if not entities:
        return []

    def sort_key(e: dict[str, Any]) -> tuple:
        score = e.get("score")
        return (
            -(score if score is not None else -1.0),
            -(int(e.get("end", 0)) - int(e.get("start", 0))),
            int(e.get("start", 0)),
        )

    kept: list[dict[str, Any]] = []
    for ent in sorted(entities, key=sort_key):
        s, e = int(ent.get("start", 0)), int(ent.get("end", 0))
        overlaps = any(
            not (e <= int(k.get("start", 0)) or s >= int(k.get("end", 0))) for k in kept
        )
        if not overlaps:
            kept.append(ent)
    kept.sort(key=lambda x: (int(x.get("start", 0)), int(x.get("end", 0))))
    return kept


def _run_model(text: str, model_name: str) -> list[dict[str, Any]]:
    from openmed import analyze_text

    result = analyze_text(
        text,
        model_name=model_name,
        loader=_get_loader(),
        aggregation_strategy="simple",
        confidence_threshold=confidence_threshold(),
        sentence_detection=False,
    )
    entities = getattr(result, "entities", []) or []
    return merge_overlapping_spans([_entity_dict(entity, text) for entity in entities])


def _empty_entities(
    *,
    status: str,
    error: str | None = None,
) -> dict[str, Any]:
    payload: dict[str, Any] = {
        "diseases": [],
        "drugs": [],
        "negated": [],
        "disease_count": 0,
        "drug_count": 0,
        "has_negated_entity": False,
        "entities_status": status,
    }
    if error:
        payload["entities_error"] = error
    return payload


def analyze_entities(text: str) -> dict[str, Any]:
    """Extract disease and medication entities with negation flags."""
    _ensure_openmed()
    original = (text or "").strip()
    if not original:
        raise ValueError("text must not be empty")

    ner_text = normalize_for_ner(original)

    # Run disease + pharma in parallel (shared ModelLoader is thread-safe for cached pipes).
    with ThreadPoolExecutor(max_workers=2, thread_name_prefix="openmed-pair") as pool:
        fut_d = pool.submit(_run_model, ner_text, DISEASE_MODEL)
        fut_p = pool.submit(_run_model, ner_text, PHARMA_MODEL)
        diseases = fut_d.result()
        drugs = fut_p.result()

    negated = [
        e for e in (*diseases, *drugs) if e.get("negated") and e.get("text")
    ]

    return {
        "diseases": diseases,
        "drugs": drugs,
        "negated": negated,
        "disease_count": len(diseases),
        "drug_count": len(drugs),
        "has_negated_entity": bool(negated),
        # Backward-compatible alias (prefer has_negated_entity).
        "has_negated_critical_symptom": bool(negated),
        "entities_status": "ok",
        "ner_text": ner_text if ner_text != original else None,
    }


def fetch_entities(text: str, *, enabled: bool = True) -> dict[str, Any]:
    """Return entities with explicit status — never silently swallow failures.

    NER runs in a worker with OPENMED_TIMEOUT_SECONDS so Hugging Face model
    downloads cannot block BioBERT acuity forever.
    """
    if not enabled or not is_enabled():
        return _empty_entities(status="disabled")
    limit = timeout_seconds()
    future = _NER_EXECUTOR.submit(analyze_entities, text)
    try:
        return future.result(timeout=limit)
    except FuturesTimeoutError:
        hint = (
            " Models may still be warming — wait until /health shows "
            "openmed_models_warmed=true, then retry."
            if not _models_warmed
            else ""
        )
        return _empty_entities(
            status="error",
            error=(
                f"OpenMed NER timed out after {limit:.0f}s "
                f"(model download or CPU inference).{hint} "
                "Acuity continues without entities."
            ),
        )
    except Exception as exc:
        return _empty_entities(status="error", error=str(exc))


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
