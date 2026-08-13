"""Phase 2 fuse orchestration tests (NLP mocked)."""

from __future__ import annotations

import sys
from pathlib import Path
from unittest.mock import patch

import pytest

ML_DIR = Path(__file__).resolve().parents[1]
if str(ML_DIR) not in sys.path:
    sys.path.insert(0, str(ML_DIR))

import fuse as fuse_mod  # noqa: E402
from fusion import ORD  # noqa: E402


def _nlp(colour: str, level: int, confidence: float = 0.94, text: str = "complaint"):
    return {
        "text": text,
        "is_medical_complaint": True,
        "predicted_acuity_level": level,
        "confidence": confidence,
        "probabilities": [{"level": level, "class_index": level - 1, "probability": confidence}],
        "sats_colour": colour,
        "bayesian_candidate": confidence < 0.85,
        "calibration_warning": False,
        "entities": {"entities_status": "disabled", "diseases": [], "drugs": []},
        "entities_status": "disabled",
    }


def test_scenario_1_chest_pain_fusion_orange():
    text = "crushing central chest pain, sweaty, cannot catch breath"
    vitals = {"heart_rate_bpm": 125, "respiratory_rate": 26}
    with patch.object(fuse_mod, "predict", return_value=_nlp("Orange", 2, text=text)):
        result = fuse_mod.fuse(text, vitals, openmed=False, gate=False)

    assert result["layers"]["c_tews"] == "Yellow"
    assert result["layers"]["c_disc"] == "Orange"
    assert result["layers"]["c_bayes"] == "Orange"
    assert result["fused_colour"] == "Orange"
    assert result["flags"]["tews_incomplete"] is True
    assert result["flags"]["bayes_invoked"] is True
    assert result["flags"]["layer_conflict"] is True
    assert result["pathway"]["t_max_minutes"] == 10


def test_scenario_2_vitals_win_over_mild_language():
    text = "I feel a bit unwell, bit dizzy"
    vitals = {
        "heart_rate_bpm": 135,
        "respiratory_rate": 32,
        "avpu": "verbal",
        "mobility": "immobile",
    }
    with patch.object(fuse_mod, "predict", return_value=_nlp("Green", 4, text=text)):
        result = fuse_mod.fuse(text, vitals, openmed=False, gate=False)

    assert result["layers"]["c_tews"] in {"Orange", "Red"}
    assert ORD[result["fused_colour"]] >= ORD[result["layers"]["c_tews"]]


def test_scenario_3_missing_vitals_invokes_bayes():
    text = "severe abdominal pain, vomiting blood"
    with patch.object(fuse_mod, "predict", return_value=_nlp("Orange", 2, text=text)):
        result = fuse_mod.fuse(text, None, openmed=False, gate=False)

    assert result["layers"]["c_tews"] is None
    assert result["flags"]["tews_incomplete"] is True
    assert result["flags"]["bayes_invoked"] is True
    assert result["fused_colour"] in {"Orange", "Red", "Yellow"}


def test_scenario_6_style_conflict_max_urgency():
    """NLP Yellow + TEWS Red → fused Red."""
    text = "feeling odd"
    vitals = {
        "heart_rate_bpm": 140,
        "respiratory_rate": 34,
        "avpu": "pain",
        "mobility": "immobile",
        "trauma": True,
        "temperature_c": 39.5,
    }
    with patch.object(fuse_mod, "predict", return_value=_nlp("Yellow", 3, text=text)):
        result = fuse_mod.fuse(text, vitals, openmed=False, gate=False)

    assert result["layers"]["c_tews"] == "Red"
    assert result["fused_colour"] == "Red"


def test_scenario_7_all_green():
    text = "mild rash on arm for a week, no fever"
    vitals = {
        "heart_rate_bpm": 78,
        "respiratory_rate": 12,
        "temperature_c": 36.8,
        "avpu": "alert",
        "mobility": "normal",
        "trauma": False,
    }
    with patch.object(fuse_mod, "predict", return_value=_nlp("Green", 4, 0.92, text=text)):
        result = fuse_mod.fuse(text, vitals, openmed=False, gate=False)

    assert result["fused_colour"] == "Green"
    assert result["pathway"]["colour"] == "Green"
