"""Tabular Bayesian fallback for partial evidence / layer conflict."""

from __future__ import annotations

import json
import os
import re
from functools import lru_cache
from pathlib import Path
from typing import Any

from fusion import ORD

_TABLES_PATH = Path(__file__).resolve().parent / "bayes_tables.json"
COLOURS = ("Red", "Orange", "Yellow", "Green")


def mi_threshold() -> float:
    raw = os.getenv("BAYES_MI_THRESHOLD", "0.75")
    try:
        return float(raw)
    except ValueError:
        return 0.75


@lru_cache(maxsize=1)
def _load_tables() -> dict[str, Any]:
    with _TABLES_PATH.open(encoding="utf-8") as fh:
        return json.load(fh)


def _has_phrase(text_lower: str, phrase: str) -> bool:
    pattern = re.compile(rf"(?<!\w){re.escape(phrase.lower())}(?!\w)", re.IGNORECASE)
    return bool(pattern.search(text_lower))


def _chest_pain_signal(
    text: str,
    entities: dict[str, Any] | None,
    discriminators: dict[str, Any] | None,
) -> bool:
    text_lower = (text or "").lower()
    if any(
        p in text_lower
        for p in ("chest pain", "crushing chest", "tight chest", "chest tightness")
    ):
        return True
    if discriminators:
        for d in discriminators.get("discriminators") or []:
            if d.get("id") == "central_chest_pain":
                return True
        if (discriminators.get("d_vector") or {}).get("central_chest_pain", 0) >= 0.8:
            return True
    if entities:
        for ent in entities.get("diseases") or []:
            if ent.get("negated"):
                continue
            t = (ent.get("text") or "").lower()
            if "chest" in t or "myocardial" in t:
                return True
    return False


def _respiratory_signal(text: str, entities: dict[str, Any] | None, vitals: dict | None) -> bool:
    text_lower = (text or "").lower()
    if any(
        p in text_lower
        for p in ("cannot catch breath", "shortness of breath", "dyspnoea", "dyspnea", "gasping")
    ):
        return True
    rr = None
    if vitals and vitals.get("respiratory_rate") is not None:
        try:
            rr = float(vitals["respiratory_rate"])
        except (TypeError, ValueError):
            rr = None
    if rr is not None and rr >= 21:
        return True
    if entities:
        for ent in entities.get("diseases") or []:
            t = (ent.get("text") or "").lower()
            if "dyspn" in t or "breath" in t:
                return True
    return False


def match_scenario_key(
    *,
    text: str,
    entities: dict[str, Any] | None,
    vitals: dict[str, Any] | None,
    tews_incomplete: bool,
    low_nlp_confidence: bool,
    discriminators: dict[str, Any] | None,
) -> str:
    chest = _chest_pain_signal(text, entities, discriminators)
    if chest and tews_incomplete:
        return "chest_pain_partial_vitals"
    if chest:
        return "chest_pain_full_vitals"
    if _respiratory_signal(text, entities, vitals):
        return "respiratory_distress"
    if low_nlp_confidence:
        return "low_confidence_general"
    return "default_ed"


def _normalize_posteriors(priors: dict[str, float], likelihoods: dict[str, float]) -> dict[str, float]:
    raw = {c: float(priors.get(c, 0)) * float(likelihoods.get(c, 0)) for c in COLOURS}
    total = sum(raw.values()) or 1.0
    return {c: round(raw[c] / total, 4) for c in COLOURS}


def _mi_score(text: str) -> float:
    """Heuristic P(MI|S)-style score from crushing/radiation phrases."""
    text_lower = (text or "").lower()
    tables = _load_tables()
    phrases = tables.get("mi_phrases") or []
    hits = sum(1 for p in phrases if _has_phrase(text_lower, p))
    if hits == 0:
        return 0.0
    if hits == 1:
        return 0.70
    if hits == 2:
        return 0.82
    return min(0.95, 0.75 + 0.05 * hits)


def should_invoke_bayes(
    *,
    tews_incomplete: bool,
    low_nlp_confidence: bool,
    c_nlp: str,
    c_tews: str | None,
    force: bool = False,
) -> bool:
    if force:
        return True
    if tews_incomplete:
        return True
    if low_nlp_confidence:
        return True
    if c_tews and c_nlp and ORD.get(c_nlp) != ORD.get(c_tews):
        return True
    return False


def compute_bayes_fallback(
    *,
    text: str,
    entities: dict[str, Any] | None,
    vitals: dict[str, Any] | None,
    c_nlp: str,
    c_tews: str | None,
    confidence: float,
    tews_incomplete: bool,
    discriminators: dict[str, Any] | None,
    force: bool = False,
    confidence_threshold: float = 0.85,
) -> dict[str, Any]:
    low_nlp = float(confidence) < confidence_threshold
    if not should_invoke_bayes(
        tews_incomplete=tews_incomplete,
        low_nlp_confidence=low_nlp,
        c_nlp=c_nlp,
        c_tews=c_tews,
        force=force,
    ):
        return {
            "bayes_invoked": False,
            "scenario_key": None,
            "evidence": [],
            "priors": None,
            "likelihoods": None,
            "posteriors": None,
            "c_bayes": None,
            "override": None,
        }

    scenario_key = match_scenario_key(
        text=text,
        entities=entities,
        vitals=vitals,
        tews_incomplete=tews_incomplete,
        low_nlp_confidence=low_nlp,
        discriminators=discriminators,
    )
    tables = _load_tables()["scenarios"]
    table = tables.get(scenario_key) or tables["default_ed"]
    priors = table["priors"]
    likelihoods = table["likelihoods"]
    posteriors = _normalize_posteriors(priors, likelihoods)
    c_bayes = max(posteriors, key=lambda c: posteriors[c])

    evidence: list[str] = []
    if _chest_pain_signal(text, entities, discriminators):
        evidence.append("chest_pain")
    if vitals:
        if vitals.get("heart_rate_bpm") is not None:
            evidence.append(f"HR={vitals['heart_rate_bpm']}")
        if vitals.get("respiratory_rate") is not None:
            evidence.append(f"RR={vitals['respiratory_rate']}")
    if low_nlp:
        evidence.append("low_nlp_confidence")
    if tews_incomplete:
        evidence.append("tews_incomplete")

    override = None
    mi = _mi_score(text)
    tau_b = mi_threshold()
    if mi > tau_b:
        # Protocol: upgrade at least to Orange (Red if already high MI score)
        target = "Red" if mi >= 0.90 else "Orange"
        if ORD[target] > ORD[c_bayes]:
            c_bayes = target
        override = "mi_protocol"
        evidence.append(f"mi_score={mi:.2f}")

    return {
        "bayes_invoked": True,
        "scenario_key": scenario_key,
        "evidence": evidence,
        "priors": priors,
        "likelihoods": likelihoods,
        "posteriors": posteriors,
        "c_bayes": c_bayes,
        "override": override,
    }
