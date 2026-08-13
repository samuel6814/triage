"""Unit tests for voice pipeline (mocked ASR/translation)."""

from __future__ import annotations

import unittest
from unittest.mock import patch

from voice_pipeline import process_voice_intake, translation_enabled, whisper_language_arg


class VoicePipelineTests(unittest.TestCase):
    def test_whisper_language_arg_maps_tw_to_none(self):
        self.assertIsNone(whisper_language_arg("tw"))
        self.assertIsNone(whisper_language_arg("TW"))
        self.assertIsNone(whisper_language_arg(None))
        self.assertEqual(whisper_language_arg("en"), "en")

    @patch("voice_pipeline.translate_twi_to_english")
    @patch("voice_pipeline._transcribe_file")
    def test_process_voice_intake_translates_twi(self, mock_transcribe, mock_translate):
        # Whisper may auto-detect a non-tw code; client hint still drives translation.
        mock_transcribe.return_value = ("me ho yɛ", "yo", 2.5)
        mock_translate.return_value = "I am sick"

        result = process_voice_intake(b"fake-audio", "sample.webm", language_hint="tw")

        self.assertEqual(result["transcript_original"], "me ho yɛ")
        self.assertEqual(result["transcript_english"], "I am sick")
        self.assertTrue(result["translation_applied"])
        self.assertEqual(result["detected_language"], "tw")
        mock_translate.assert_called_once_with("me ho yɛ", source_lang="tw")
        mock_transcribe.assert_called_once()
        self.assertEqual(mock_transcribe.call_args.kwargs.get("language_hint"), "tw")

    @patch("voice_pipeline._transcribe_file")
    def test_process_voice_intake_skips_translation_for_english(self, mock_transcribe):
        mock_transcribe.return_value = ("chest pain since morning", "en", 1.8)

        result = process_voice_intake(b"fake-audio", "sample.webm", language_hint="en")

        self.assertEqual(result["transcript_english"], "chest pain since morning")
        self.assertFalse(result["translation_applied"])
        self.assertEqual(result["detected_language"], "en")

    def test_empty_audio_raises(self):
        with self.assertRaises(ValueError):
            process_voice_intake(b"", "sample.webm", language_hint="tw")

    def test_translation_enabled_default(self):
        self.assertTrue(translation_enabled())


if __name__ == "__main__":
    unittest.main()
