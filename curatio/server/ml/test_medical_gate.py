"""Unit tests for clinical relevance gate (no OpenMed / BioBERT required)."""

from __future__ import annotations

import unittest

from medical_gate import (
    build_rejection_message,
    evaluate,
    score_clinical_relevance,
)


class MedicalGateTests(unittest.TestCase):
  def test_football_rejected_with_dynamic_message(self):
    text = "kofi is going to play football"
    gate = evaluate(text, None)
    self.assertFalse(gate.is_medical)
    self.assertEqual(gate.rejection_category, "non_clinical_topic")
    self.assertIn("kofi", gate.message or "")
    self.assertTrue(gate.guidance)
    self.assertLess(gate.clinical_relevance_score, 0.35)

  def test_shopping_rejected(self):
    gate = evaluate("I need to buy rice at Kejetia tomorrow", None)
    self.assertFalse(gate.is_medical)
    self.assertEqual(gate.rejection_category, "non_clinical_topic")

  def test_greeting_rejected(self):
    gate = evaluate("hello how are you", None)
    self.assertFalse(gate.is_medical)
    self.assertEqual(gate.rejection_category, "no_clinical_content")

  def test_family_planning_passes(self):
    text = "I come for family planning visit at OPD, no pain"
    gate = evaluate(text, None)
    self.assertTrue(gate.is_medical)
    self.assertGreaterEqual(gate.clinical_relevance_score, 0.35)

  def test_chest_pain_passes(self):
    text = "chest pain and fever since this morning"
    gate = evaluate(text, None)
    self.assertTrue(gate.is_medical)
    self.assertGreater(gate.clinical_relevance_score, 0.35)

  def test_messages_differ_by_category(self):
    a = build_rejection_message("play football", "non_clinical_topic", {}, 0.1)
    b = build_rejection_message("hello", "no_clinical_content", {}, 0.0)
    self.assertNotEqual(a, b)

  def test_score_ordering(self):
    football = score_clinical_relevance("going to play football", None)
    clinical = score_clinical_relevance("severe chest pain and vomiting", None)
    self.assertLess(football, clinical)

  def test_suture_removal_passes(self):
    text = "come for suture removal only, wound clean, pain small"
    gate = evaluate(text, None)
    self.assertTrue(gate.is_medical)

  def test_rejection_payload_fields(self):
    from medical_gate import rejection_payload

    gate = evaluate("watching netflix tonight", None)
    payload = rejection_payload("watching netflix tonight", gate, None)
    self.assertIn("guidance", payload)
    self.assertIn("suggested_action", payload)
    self.assertIn("clinical_relevance_score", payload)


if __name__ == "__main__":
  unittest.main()
