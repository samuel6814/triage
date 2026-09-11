"""TEWS / SATS vital-sign scoring for triage fusion Phase 1."""

from __future__ import annotations

from typing import Any

# Adult SATS / TEWS: seven parameters including systolic blood pressure (SBP).
VITAL_KEYS = (
    "heart_rate_bpm",
    "respiratory_rate",
    "systolic_bp_mmhg",
    "mobility",
    "temperature_c",
    "avpu",
    "trauma",
)

MOBILITY_POINTS = {
    "normal": 0,
    "walking": 0,
    "assisted": 1,
    "with help": 1,
    "immobile": 3,
    "stretcher": 3,
}

AVPU_POINTS = {
    "alert": 0,
    "verbal": 1,
    "pain": 2,
    "unresponsive": 3,
}


class TewsValidationError(ValueError):
    """Raised when a vital is present but out of acceptable range / enum."""


def score_heart_rate(hr: float) -> int:
    """f1 — adult SATS TEWS heart-rate bands (beats/min)."""
    if hr >= 130:
        return 3
    if 111 <= hr <= 129:
        return 2
    if hr <= 40:
        return 2
    if 101 <= hr <= 110:
        return 1
    if 41 <= hr <= 50:
        return 1
    if 51 <= hr <= 100:
        return 0
    return 1  # unused if bands cover the validated range


def score_respiratory_rate(rr: float) -> int:
    """f2 — adult SATS TEWS respiratory-rate bands (breaths/min)."""
    if rr >= 30:
        return 3
    if rr <= 8:
        return 3
    if 21 <= rr <= 29:
        return 2
    if 9 <= rr <= 14:
        return 1
    if 15 <= rr <= 20:
        return 0
    return 1


def score_sbp(sbp: float) -> int:
    """f3 — adult SATS systolic blood pressure (mmHg)."""
    if sbp > 170:
        return 2
    if 101 <= sbp <= 170:
        return 0
    if 90 <= sbp <= 100:
        return 1
    return 3  # < 90


def score_mobility(value: str) -> int:
    key = str(value).strip().lower()
    if key not in MOBILITY_POINTS:
        raise TewsValidationError(
            f"mobility must be one of {sorted(MOBILITY_POINTS)}; got {value!r}"
        )
    return MOBILITY_POINTS[key]


def score_temperature(temp_c: float) -> int:
    """f5 — adult SATS-style temperature bands."""
    if 35.0 <= temp_c <= 38.4:
        return 0
    if (38.5 <= temp_c <= 38.9) or (34.0 <= temp_c <= 34.9):
        return 1
    if temp_c >= 39.0 or temp_c <= 33.9:
        return 2
    # Gap bands (e.g. 34.95) treated as mild derangement
    return 1


def score_avpu(value: str) -> int:
    key = str(value).strip().lower()
    if key not in AVPU_POINTS:
        raise TewsValidationError(
            f"avpu must be one of {sorted(AVPU_POINTS)}; got {value!r}"
        )
    return AVPU_POINTS[key]


def score_trauma(value: bool) -> int:
    return 2 if bool(value) else 0


def colour_from_tews(total: int) -> str:
    """C_TEWS(T) bands — Red when T >= 7 (adult SATS)."""
    if total >= 7:
        return "Red"
    if 5 <= total <= 6:
        return "Orange"
    if 3 <= total <= 4:
        return "Yellow"
    return "Green"


def _validate_numeric(name: str, value: float, lo: float, hi: float) -> float:
    if value < lo or value > hi:
        raise TewsValidationError(f"{name} out of range [{lo}, {hi}]: {value}")
    return value


def _observed(vitals: dict[str, Any] | None) -> dict[str, Any]:
    if not vitals:
        return {}
    out: dict[str, Any] = {}
    for key in VITAL_KEYS:
        if key not in vitals:
            continue
        val = vitals[key]
        if val is None or val == "":
            continue
        out[key] = val
    return out


def compute_tews(vitals: dict[str, Any] | None) -> dict[str, Any]:
    """
    Compute partial or full TEWS from optional vitals.

    Returns:
      tews_total, tews_breakdown, c_tews, tews_incomplete, vitals_observed
    """
    observed = _observed(vitals)
    if not observed:
        return {
            "tews_total": None,
            "tews_breakdown": [],
            "c_tews": None,
            "tews_incomplete": True,
            "vitals_observed": [],
        }

    breakdown: list[dict[str, Any]] = []
    total = 0

    if "heart_rate_bpm" in observed:
        hr = float(observed["heart_rate_bpm"])
        _validate_numeric("heart_rate_bpm", hr, 0, 300)
        pts = score_heart_rate(hr)
        breakdown.append({"vital": "heart_rate_bpm", "value": hr, "points": pts})
        total += pts

    if "respiratory_rate" in observed:
        rr = float(observed["respiratory_rate"])
        _validate_numeric("respiratory_rate", rr, 0, 100)
        pts = score_respiratory_rate(rr)
        breakdown.append({"vital": "respiratory_rate", "value": rr, "points": pts})
        total += pts

    if "systolic_bp_mmhg" in observed:
        sbp = float(observed["systolic_bp_mmhg"])
        _validate_numeric("systolic_bp_mmhg", sbp, 40, 300)
        pts = score_sbp(sbp)
        breakdown.append({"vital": "systolic_bp_mmhg", "value": sbp, "points": pts})
        total += pts

    if "mobility" in observed:
        pts = score_mobility(observed["mobility"])
        breakdown.append(
            {"vital": "mobility", "value": observed["mobility"], "points": pts}
        )
        total += pts

    if "temperature_c" in observed:
        temp = float(observed["temperature_c"])
        _validate_numeric("temperature_c", temp, 20.0, 45.0)
        pts = score_temperature(temp)
        breakdown.append({"vital": "temperature_c", "value": temp, "points": pts})
        total += pts

    if "avpu" in observed:
        pts = score_avpu(observed["avpu"])
        breakdown.append({"vital": "avpu", "value": observed["avpu"], "points": pts})
        total += pts

    if "trauma" in observed:
        trauma = observed["trauma"]
        if not isinstance(trauma, bool):
            if str(trauma).strip().lower() in {"1", "true", "yes", "on"}:
                trauma = True
            elif str(trauma).strip().lower() in {"0", "false", "no", "off"}:
                trauma = False
            else:
                raise TewsValidationError(f"trauma must be boolean; got {trauma!r}")
        pts = score_trauma(trauma)
        breakdown.append({"vital": "trauma", "value": trauma, "points": pts})
        total += pts

    incomplete = len(breakdown) < 7
    return {
        "tews_total": total,
        "tews_breakdown": breakdown,
        "c_tews": colour_from_tews(total),
        "tews_incomplete": incomplete,
        "vitals_observed": [b["vital"] for b in breakdown],
    }
