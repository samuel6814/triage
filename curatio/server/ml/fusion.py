"""Max-urgency fusion of triage colour layers (Phase 1: NLP + TEWS)."""

from __future__ import annotations

import os
from typing import Any

ORD = {"Green": 1, "Yellow": 2, "Orange": 3, "Red": 4}
INV = {v: k for k, v in ORD.items()}


def suppress_incomplete_tews_green() -> bool:
    raw = os.getenv("SUPPRESS_TEWS_GREEN_WHEN_INCOMPLETE", "true").strip().lower()
    return raw in {"1", "true", "yes", "on"}


def fuse_max_urgency(layers: dict[str, str | None]) -> str:
    present = [ORD[c] for c in layers.values() if c]
    if not present:
        return "Green"
    return INV[max(present)]


def fuse(
    *,
    c_nlp: str,
    c_tews: str | None = None,
    c_disc: str | None = None,
    c_bayes: str | None = None,
    flags: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """Combine layer colours (NLP, TEWS, discriminators, Bayes) via max-urgency."""
    flags = dict(flags or {})
    tews_green_suppressed = False
    c_tews_effective = c_tews

    if (
        suppress_incomplete_tews_green()
        and flags.get("tews_incomplete")
        and c_tews == "Green"
    ):
        c_tews_effective = None
        tews_green_suppressed = True

    layer_votes: dict[str, str | None] = {
        "c_nlp": c_nlp,
        "c_tews": c_tews_effective,
    }
    # Phase 2 hooks — only include when non-null so Phase 1 audit stays clean
    if c_disc is not None:
        layer_votes["c_disc"] = c_disc
    if c_bayes is not None:
        layer_votes["c_bayes"] = c_bayes

    fused = fuse_max_urgency(layer_votes)
    ord_values = {k: ORD[v] for k, v in layer_votes.items() if v}
    winning = [k for k, v in layer_votes.items() if v and ORD[v] == ORD[fused]]

    present_colours = {v for v in layer_votes.values() if v}
    layer_conflict = len(present_colours) > 1

    flags_out = {
        **flags,
        "tews_green_suppressed": tews_green_suppressed,
        "layer_conflict": layer_conflict,
        "bayes_invoked": bool(flags.get("bayes_invoked", False)),
    }

    # Display layers show raw TEWS colour (before suppression) for audit
    layers_display = {
        "c_nlp": c_nlp,
        "c_tews": c_tews,
        "c_disc": c_disc,
        "c_bayes": c_bayes,
    }

    return {
        "fused_colour": fused,
        "layers": layers_display,
        "fusion": {
            "rule": "max_urgency",
            "ord_values": ord_values,
            "winning_layers": winning,
            "fused_colour": fused,
            "c_tews_effective": c_tews_effective,
        },
        "flags": flags_out,
    }
