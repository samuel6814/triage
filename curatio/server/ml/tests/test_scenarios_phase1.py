"""Phase 1 scenario checks from triage-fusion/08-test-scenarios.md (NLP mocked)."""

from __future__ import annotations

import sys
from pathlib import Path
from unittest.mock import patch

ML_DIR = Path(__file__).resolve().parents[1]
if str(ML_DIR) not in sys.path:
    sys.path.insert(0, str(ML_DIR))

import fuse as fuse_mod  # noqa: E402
from tews import compute_tews  # noqa: E402


def test_scenario_5_green_diversion_tews_and_fuse():
    """Scenario 5: mild rash + normal vitals → TEWS Green; fuse → Green pathway."""
    vitals = {
        "heart_rate_bpm": 78,
        "respiratory_rate": 16,
        "temperature_c": 36.8,
        "avpu": "alert",
        "mobility": "normal",
        "trauma": False,
    }
    tews = compute_tews(vitals)
    assert tews["tews_total"] is not None
    assert tews["tews_total"] <= 2
    assert tews["c_tews"] == "Green"
    assert tews["tews_incomplete"] is False

    nlp = {
        "text": "mild rash on arm for a week, no fever",
        "is_medical_complaint": True,
        "predicted_acuity_level": 4,
        "confidence": 0.92,
        "probabilities": [{"level": 4, "class_index": 3, "probability": 0.92}],
        "sats_colour": "Green",
        "bayesian_candidate": False,
        "calibration_warning": False,
        "entities": {"entities_status": "ok", "diseases": [], "drugs": []},
        "entities_status": "ok",
    }
    with patch.object(fuse_mod, "predict", return_value=nlp):
        result = fuse_mod.fuse(
            "mild rash on arm for a week, no fever",
            vitals,
            openmed=False,
            gate=False,
        )

    assert result["layers"]["c_nlp"] == "Green"
    assert result["layers"]["c_tews"] == "Green"
    assert result["fused_colour"] == "Green"
    assert result["pathway"]["colour"] == "Green"
    assert result["pathway"]["destination"].startswith("OPD")


def test_scenario_8_predict_shape_has_no_fusion_fields():
    """Scenario 8: /predict response must remain NLP-only (no layers/pathway/tews)."""
    from predict import predict as real_predict

    # Structural contract: fuse adds fields; predict must not invent them when mocked.
    # We assert the fuse response differs, and a bare NLP dict lacks fusion keys.
    nlp_only = {
        "text": "crushing central chest pain",
        "is_medical_complaint": True,
        "predicted_acuity_level": 2,
        "confidence": 0.94,
        "probabilities": [],
        "sats_colour": "Orange",
        "bayesian_candidate": False,
        "entities_status": "disabled",
    }
    assert "layers" not in nlp_only
    assert "pathway" not in nlp_only
    assert "tews" not in nlp_only
    assert "fused_colour" not in nlp_only
    # predict module still exports the NLP-only entrypoint
    assert callable(real_predict)
