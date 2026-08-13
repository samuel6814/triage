"""Orchestrate NLP + TEWS + discriminators + Bayes + max-urgency fusion + pathway."""

from __future__ import annotations

from typing import Any

from bayes_fallback import compute_bayes_fallback
from discriminators import evaluate_discriminators
from fusion import fuse as fuse_layers
from pathways import lookup_pathway
from predict import CONFIDENCE_THRESHOLD, predict
from tews import TewsValidationError, compute_tews


def fuse(
    text: str,
    vitals: dict[str, Any] | None = None,
    *,
    openmed: bool = True,
    gate: bool = True,
    force_bayes: bool = False,
) -> dict[str, Any]:
    """
    Run full Phase 2 fusion pipeline.

    Gate rejections from predict() are returned unchanged (no fusion).
    """
    nlp = predict(text, openmed=openmed, gate=gate)
    if nlp.get("is_medical_complaint") is False:
        return nlp

    c_nlp = nlp.get("sats_colour") or "Green"
    confidence = float(nlp.get("confidence") or 0)
    entities = nlp.get("entities")

    tews_result = compute_tews(vitals)
    c_tews = tews_result.get("c_tews")
    tews_incomplete = bool(tews_result.get("tews_incomplete"))

    disc = evaluate_discriminators(text, entities)
    c_disc = disc.get("c_disc")

    low_nlp = confidence < CONFIDENCE_THRESHOLD or bool(nlp.get("bayesian_candidate"))

    bayes = compute_bayes_fallback(
        text=text,
        entities=entities,
        vitals=vitals,
        c_nlp=c_nlp,
        c_tews=c_tews,
        confidence=confidence,
        tews_incomplete=tews_incomplete,
        discriminators=disc,
        force=force_bayes,
        confidence_threshold=CONFIDENCE_THRESHOLD,
    )
    c_bayes = bayes.get("c_bayes") if bayes.get("bayes_invoked") else None

    flags = {
        "tews_incomplete": tews_incomplete,
        "low_nlp_confidence": low_nlp,
        "bayes_invoked": bool(bayes.get("bayes_invoked")),
    }

    fusion_out = fuse_layers(
        c_nlp=c_nlp,
        c_tews=c_tews,
        c_disc=c_disc,
        c_bayes=c_bayes,
        flags=flags,
    )

    fused_colour = fusion_out["fused_colour"]
    pathway = lookup_pathway(fused_colour)

    return {
        **nlp,
        "layers": fusion_out["layers"],
        "fused_colour": fused_colour,
        "sats_colour": fused_colour,
        "tews": {
            "tews_total": tews_result.get("tews_total"),
            "c_tews": c_tews,
            "tews_incomplete": tews_incomplete,
            "breakdown": tews_result.get("tews_breakdown", []),
            "vitals_observed": tews_result.get("vitals_observed", []),
        },
        "discriminators": {
            "c_disc": c_disc,
            "active": disc.get("discriminators") or [],
            "d_vector": disc.get("d_vector") or {},
        },
        "bayes": bayes,
        "fusion": fusion_out["fusion"],
        "pathway": pathway,
        "flags": fusion_out["flags"],
    }


__all__ = ["fuse", "TewsValidationError", "compute_tews"]
