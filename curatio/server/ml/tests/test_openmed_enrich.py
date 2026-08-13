"""Offline unit tests for openmed_enrich helpers (mocked analyze_text)."""

from __future__ import annotations

import sys
from pathlib import Path
from unittest.mock import patch

import pytest

ML_DIR = Path(__file__).resolve().parents[1]
if str(ML_DIR) not in sys.path:
    sys.path.insert(0, str(ML_DIR))

import openmed_enrich as om  # noqa: E402


@pytest.fixture(autouse=True)
def _reset_negation_cache():
    om._negation_cues = None
    yield
    om._negation_cues = None


def test_normalize_for_ner_expands_ghana_shorthand():
    out = om.normalize_for_ner("  high  BP  after  RTA  in  trotro  ")
    assert "blood pressure" in out.lower()
    assert "road traffic accident" in out.lower()
    assert "minibus" in out.lower()


def test_merge_overlapping_spans_prefers_higher_score():
    spans = [
        {"text": "chest", "start": 0, "end": 5, "score": 0.6, "label": "A", "negated": False},
        {
            "text": "chest pain",
            "start": 0,
            "end": 10,
            "score": 0.9,
            "label": "B",
            "negated": False,
        },
        {"text": "fever", "start": 20, "end": 25, "score": 0.8, "label": "C", "negated": False},
    ]
    merged = om.merge_overlapping_spans(spans)
    assert len(merged) == 2
    assert merged[0]["text"] == "chest pain"
    assert merged[1]["text"] == "fever"


def test_is_negated_detects_denies():
    text = "patient denies chest pain today"
    start = text.index("chest")
    end = start + len("chest pain")
    assert om._is_negated(text, start, end) is True


def test_is_negated_false_without_cue():
    text = "severe chest pain radiating to arm"
    start = text.index("chest")
    end = start + len("chest pain")
    assert om._is_negated(text, start, end) is False


def test_entity_prefix_default_off(monkeypatch):
    monkeypatch.delenv("OPENMED_ENTITY_PREFIX", raising=False)
    assert om.entity_prefix_enabled() is False
    monkeypatch.setenv("OPENMED_ENTITY_PREFIX", "true")
    assert om.entity_prefix_enabled() is True


def test_fetch_entities_disabled(monkeypatch):
    monkeypatch.setenv("OPENMED_ENABLED", "false")
    result = om.fetch_entities("chest pain", enabled=True)
    assert result["entities_status"] == "disabled"
    assert result["diseases"] == []


def test_fetch_entities_timeout(monkeypatch):
    monkeypatch.setenv("OPENMED_ENABLED", "true")
    monkeypatch.setenv("OPENMED_TIMEOUT_SECONDS", "0.5")

    def slow(_text):
        import time

        time.sleep(2.0)
        return {"entities_status": "ok", "diseases": [], "drugs": []}

    with patch.object(om, "analyze_entities", side_effect=slow):
        result = om.fetch_entities("chest pain", enabled=True)
    assert result["entities_status"] == "error"
    assert "timed out" in result["entities_error"].lower()


def test_analyze_entities_mocked(monkeypatch):
    monkeypatch.setenv("OPENMED_ENABLED", "true")

    disease_ent = {
        "text": "malaria",
        "label": "DISEASE",
        "start": 10,
        "end": 17,
        "score": 0.91,
        "negated": False,
    }
    drug_ent = {
        "text": "paracetamol",
        "label": "DRUG",
        "start": 30,
        "end": 41,
        "score": 0.88,
        "negated": False,
    }

    def fake_run(text, model_name):
        if model_name == om.DISEASE_MODEL:
            return [disease_ent]
        return [drug_ent]

    with patch.object(om, "_ensure_openmed"), patch.object(om, "_run_model", side_effect=fake_run):
        result = om.analyze_entities("fever malaria given paracetamol")

    assert result["entities_status"] == "ok"
    assert result["has_negated_entity"] is False
    assert result["disease_count"] == 1
    assert result["drug_count"] == 1
    assert "has_negated_critical_symptom" in result


GHANA_COMPLAINTS = [
    "high BP since morning, headache",
    "involved in RTA on Accra road",
    "came by trotro with chest pain",
    "known DM, sugar high",
    "HTN patient with SOB",
    "fever malaria no vomiting",
    "waist pain after carrying load",
    "palpitations and dizziness at market",
]


@pytest.mark.parametrize("complaint", GHANA_COMPLAINTS)
def test_ghana_normalize_smoke(complaint):
    out = om.normalize_for_ner(complaint)
    assert out
    assert "  " not in out
