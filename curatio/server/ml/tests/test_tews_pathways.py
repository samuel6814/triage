"""Unit tests for TEWS scoring and pathway lookup."""

from __future__ import annotations

import sys
from pathlib import Path

import pytest

ML_DIR = Path(__file__).resolve().parents[1]
if str(ML_DIR) not in sys.path:
    sys.path.insert(0, str(ML_DIR))

from pathways import lookup_pathway  # noqa: E402
from tews import (  # noqa: E402
    TewsValidationError,
    colour_from_tews,
    compute_tews,
    score_heart_rate,
    score_respiratory_rate,
    score_sbp,
)


def test_hr_rr_partial_yellow():
    """Checklist: HR=125, RR=26 → T=4, Yellow, incomplete."""
    result = compute_tews({"heart_rate_bpm": 125, "respiratory_rate": 26})
    assert result["tews_total"] == 4
    assert result["c_tews"] == "Yellow"
    assert result["tews_incomplete"] is True
    assert score_heart_rate(125) == 2
    assert score_respiratory_rate(26) == 2


def test_tews_red_band():
    assert colour_from_tews(7) == "Red"
    assert colour_from_tews(8) == "Red"
    assert colour_from_tews(6) == "Orange"


def test_sbp_adult_sats_bands():
    assert score_sbp(180) == 2
    assert score_sbp(120) == 0
    assert score_sbp(95) == 1
    assert score_sbp(80) == 3


def test_hr_adult_sats_bands():
    assert score_heart_rate(130) == 3
    assert score_heart_rate(125) == 2
    assert score_heart_rate(35) == 2
    assert score_heart_rate(105) == 1
    assert score_heart_rate(45) == 1
    assert score_heart_rate(78) == 0


def test_rr_adult_sats_bands():
    assert score_respiratory_rate(30) == 3
    assert score_respiratory_rate(6) == 3
    assert score_respiratory_rate(26) == 2
    assert score_respiratory_rate(12) == 1
    assert score_respiratory_rate(18) == 0


def test_empty_vitals():
    result = compute_tews(None)
    assert result["tews_total"] is None
    assert result["c_tews"] is None
    assert result["tews_incomplete"] is True


def test_full_green_vitals():
    result = compute_tews(
        {
            "heart_rate_bpm": 78,
            "respiratory_rate": 16,
            "systolic_bp_mmhg": 120,
            "temperature_c": 36.8,
            "avpu": "alert",
            "mobility": "normal",
            "trauma": False,
        }
    )
    assert result["tews_incomplete"] is False
    assert result["tews_total"] == 0
    assert result["c_tews"] == "Green"


def test_hr_out_of_range():
    with pytest.raises(TewsValidationError):
        compute_tews({"heart_rate_bpm": 400})


def test_pathway_orange_tmax():
    p = lookup_pathway("Orange")
    assert p["t_max_minutes"] == 10
    assert p["colour"] == "Orange"


def test_pathway_unknown():
    with pytest.raises(ValueError):
        lookup_pathway("Purple")


def test_child_marker_overrides_destination():
    from pathways import has_child_markers

    assert has_child_markers("my child has fever") is True
    assert has_child_markers("chest pain and weakness") is False
    adult = lookup_pathway("Yellow")
    assert adult["destination"] != "Pediatrics"
    assert adult["child_markers_matched"] is False
    peds = lookup_pathway("Yellow", complaint="My daughter has fever and cough")
    assert peds["destination"] == "Pediatrics"
    assert peds["child_markers_matched"] is True
    assert peds["t_max_minutes"] == 60
