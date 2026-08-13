"""Unit tests for discriminators and tabular Bayes."""

from __future__ import annotations

import sys
from pathlib import Path

ML_DIR = Path(__file__).resolve().parents[1]
if str(ML_DIR) not in sys.path:
    sys.path.insert(0, str(ML_DIR))

from bayes_fallback import compute_bayes_fallback  # noqa: E402
from discriminators import evaluate_discriminators  # noqa: E402


def test_chest_pain_orange_floor():
    result = evaluate_discriminators(
        "crushing central chest pain, sweaty, cannot catch breath"
    )
    assert result["c_disc"] == "Orange"
    ids = {d["id"] for d in result["discriminators"]}
    assert "central_chest_pain" in ids
    assert result["d_vector"]["central_chest_pain"] >= 0.85


def test_entity_only_chest_pain():
    entities = {
        "entities_status": "ok",
        "diseases": [
            {
                "text": "Chest Pain",
                "label": "DISEASE",
                "start": 0,
                "end": 10,
                "score": 0.9,
                "negated": False,
            }
        ],
        "drugs": [],
    }
    # Entity-only confidence is 0.80; default τ_D=0.85 → not active as floor
    result = evaluate_discriminators("patient presents today", entities)
    assert result["d_vector"]["central_chest_pain"] >= 0.80
    assert result["c_disc"] is None

    result_low = evaluate_discriminators(
        "patient presents today", entities, threshold=0.80
    )
    assert result_low["c_disc"] == "Orange"


def test_non_escalating_text():
    result = evaluate_discriminators("mild rash on arm for a week, no fever")
    assert result["c_disc"] is None


def test_chest_pain_bayes_orange_posterior():
    disc = evaluate_discriminators("crushing central chest pain, sweaty")
    bayes = compute_bayes_fallback(
        text="crushing central chest pain, sweaty",
        entities=None,
        vitals={"heart_rate_bpm": 125, "respiratory_rate": 26},
        c_nlp="Orange",
        c_tews="Yellow",
        confidence=0.94,
        tews_incomplete=True,
        discriminators=disc,
    )
    assert bayes["bayes_invoked"] is True
    assert bayes["scenario_key"] == "chest_pain_partial_vitals"
    assert bayes["c_bayes"] == "Orange"
    assert bayes["posteriors"]["Orange"] >= 0.85


def test_bayes_skipped_when_stable():
    bayes = compute_bayes_fallback(
        text="mild headache",
        entities=None,
        vitals={
            "heart_rate_bpm": 78,
            "respiratory_rate": 12,
            "temperature_c": 36.8,
            "avpu": "alert",
            "mobility": "normal",
            "trauma": False,
        },
        c_nlp="Green",
        c_tews="Green",
        confidence=0.95,
        tews_incomplete=False,
        discriminators={"discriminators": [], "c_disc": None, "d_vector": {}},
    )
    assert bayes["bayes_invoked"] is False
    assert bayes["c_bayes"] is None
