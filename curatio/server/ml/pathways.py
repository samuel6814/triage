"""Colour → clinical pathway P(C) lookup (deterministic)."""

from __future__ import annotations

from typing import Any

# Aligned with curatio/client/src/data/acuityLevels.js and triage-fusion/06-pathways.md
PATHWAYS: dict[str, dict[str, Any]] = {
    "Red": {
        "t_max_minutes": 0,
        "t_max_label": "Immediate (0 min)",
        "destination": "Resuscitation bay",
        "meaning": "Life-threatening — immediate resuscitation",
        "actions": [
            "Code Red",
            "Bypass registration/payment if needed",
            "ACLS/ATLS as indicated",
        ],
        "escalation": "Immediate senior clinician alert",
        "detail": "Red protocol: resuscitation room; bypass registration if needed.",
    },
    "Orange": {
        "t_max_minutes": 10,
        "t_max_label": "Within 10 minutes",
        "destination": "Acute / high-dependency bed",
        "meaning": "Very urgent — high dependency",
        "actions": [
            "Allocate bed",
            "Start 10-minute countdown",
            "Continuous monitoring",
        ],
        "escalation": "Escalate to head nurse if unclaimed within T_max",
        "detail": "Orange protocol: majors/emergency area; seen within 10 minutes.",
    },
    "Yellow": {
        "t_max_minutes": 60,
        "t_max_label": "Within 60 minutes",
        "destination": "ED waiting / urgent stream",
        "meaning": "Urgent — physician review needed",
        "actions": [
            "Standing orders in parallel (e.g. malaria RDT, basic labs)",
            "Reassess if symptoms worsen",
        ],
        "escalation": "Re-assess if timer expires or symptoms worsen",
        "detail": "Yellow protocol: majors area; standing orders while waiting.",
    },
    "Green": {
        "t_max_minutes": 240,
        "t_max_label": "Within 4 hours",
        "destination": "OPD / Minors / Polyclinic",
        "meaning": "Non-urgent — stable, can wait",
        "actions": [
            "Divert away from acute ED",
            "Digital ticket to non-acute stream",
        ],
        "escalation": "Return to ED only if deterioration / re-triage",
        "detail": "Green protocol: minors, OPD, or polyclinic — away from critical ER.",
    },
}


def lookup_pathway(colour: str) -> dict[str, Any]:
    if colour not in PATHWAYS:
        raise ValueError(f"Unknown colour: {colour}")
    return {"colour": colour, **PATHWAYS[colour]}
