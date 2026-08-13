"""Unit tests for fusion + fuse orchestrator (NLP mocked)."""

from __future__ import annotations

import sys
from pathlib import Path
from unittest.mock import patch

ML_DIR = Path(__file__).resolve().parents[1]
if str(ML_DIR) not in sys.path:
    sys.path.insert(0, str(ML_DIR))

from fusion import fuse as fuse_layers, fuse_max_urgency  # noqa: E402
import fuse as fuse_mod  # noqa: E402


def test_max_urgency_orange_beats_yellow():
    assert fuse_max_urgency({"c_nlp": "Orange", "c_tews": "Yellow"}) == "Orange"


def test_fusion_nlp_orange_tews_yellow():
    out = fuse_layers(c_nlp="Orange", c_tews="Yellow", flags={"tews_incomplete": True})
    assert out["fused_colour"] == "Orange"
    assert out["layers"]["c_nlp"] == "Orange"
    assert out["layers"]["c_tews"] == "Yellow"
    assert out["flags"]["layer_conflict"] is True


def test_incomplete_tews_green_suppressed(monkeypatch):
    monkeypatch.setenv("SUPPRESS_TEWS_GREEN_WHEN_INCOMPLETE", "true")
    out = fuse_layers(
        c_nlp="Yellow",
        c_tews="Green",
        flags={"tews_incomplete": True},
    )
    assert out["fused_colour"] == "Yellow"
    assert out["flags"]["tews_green_suppressed"] is True
    assert out["fusion"]["c_tews_effective"] is None


def test_text_only_fuse_equals_nlp():
    nlp_payload = {
        "text": "mild headache",
        "is_medical_complaint": True,
        "predicted_acuity_level": 4,
        "confidence": 0.9,
        "probabilities": [{"level": 4, "class_index": 3, "probability": 0.9}],
        "sats_colour": "Green",
        "bayesian_candidate": False,
        "calibration_warning": False,
        "entities": {"entities_status": "disabled", "diseases": [], "drugs": []},
        "entities_status": "disabled",
    }
    with patch.object(fuse_mod, "predict", return_value=nlp_payload):
        result = fuse_mod.fuse("mild headache", None, openmed=False, gate=False)

    assert result["fused_colour"] == "Green"
    assert result["pathway"]["colour"] == "Green"
    assert result["layers"]["c_nlp"] == "Green"
    assert result["layers"]["c_tews"] is None
    assert result["tews"]["tews_total"] is None


def test_fuse_gate_rejection_passthrough():
    rejected = {
        "text": "hello",
        "is_medical_complaint": False,
        "rejection_category": "greeting_only",
        "message": "Please describe symptoms.",
    }
    with patch.object(fuse_mod, "predict", return_value=rejected):
        result = fuse_mod.fuse("hello", {"heart_rate_bpm": 80})
    assert result["is_medical_complaint"] is False
    assert "pathway" not in result
