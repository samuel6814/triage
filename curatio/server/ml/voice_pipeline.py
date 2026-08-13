"""Voice intake: Whisper ASR + Twi to English translation."""

from __future__ import annotations

import os
import tempfile
import time
from pathlib import Path
from typing import Any

_whisper_model = None


def whisper_model_size() -> str:
    return os.getenv("WHISPER_MODEL_SIZE", "small").strip() or "small"


def translation_enabled() -> bool:
    raw = os.getenv("VOICE_TRANSLATION_ENABLED", "true").strip().lower()
    return raw in {"1", "true", "yes", "on"}


def voice_health() -> dict[str, Any]:
    return {
        "whisper_model_size": whisper_model_size(),
        "whisper_loaded": _whisper_model is not None,
        "translation_enabled": translation_enabled(),
    }


def _load_whisper():
    global _whisper_model
    if _whisper_model is not None:
        return _whisper_model
    from faster_whisper import WhisperModel

    device = "cpu"
    compute_type = "int8"
    try:
        import torch

        if torch.cuda.is_available():
            device = "cuda"
            compute_type = "float16"
    except ImportError:
        pass

    _whisper_model = WhisperModel(
        whisper_model_size(),
        device=device,
        compute_type=compute_type,
    )
    return _whisper_model


def whisper_language_arg(hint: str | None) -> str | None:
    """Map app language hint to a Whisper-supported code (or None = auto-detect).

    Whisper has no Twi/Akan code; only force English when the client asks for en.
    """
    return "en" if (hint or "").lower() == "en" else None


def _transcribe_file(audio_path: Path, language_hint: str | None) -> tuple[str, str | None, float]:
    model = _load_whisper()
    lang = whisper_language_arg(language_hint)
    segments, info = model.transcribe(
        str(audio_path),
        language=lang,
        beam_size=5,
        vad_filter=True,
    )
    text = " ".join(segment.text.strip() for segment in segments).strip()
    detected = getattr(info, "language", None) or lang
    duration = float(getattr(info, "duration", 0.0) or 0.0)
    return text, detected, duration


# deep-translator / Google: Twi is listed as Akan (`ak`); `tw` is not accepted.
_GOOGLE_SOURCE = {"tw": "ak", "ak": "ak", "en": "en"}


def translate_twi_to_english(text: str, source_lang: str = "tw") -> str:
    if not text.strip():
        return ""
    if not translation_enabled():
        return text
    if source_lang == "en":
        return text

    from deep_translator import GoogleTranslator

    google_src = _GOOGLE_SOURCE.get((source_lang or "tw").lower(), "ak")
    return GoogleTranslator(source=google_src, target="en").translate(text)


def process_voice_intake(
    audio_bytes: bytes,
    filename: str,
    language_hint: str | None = "tw",
) -> dict[str, Any]:
    if not audio_bytes:
        raise ValueError("audio file is empty")

    hint = (language_hint or "tw").lower()
    suffix = Path(filename or "audio.webm").suffix or ".webm"
    start = time.perf_counter()

    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
        tmp.write(audio_bytes)
        tmp_path = Path(tmp.name)

    try:
        transcript, _whisper_lang, audio_duration = _transcribe_file(
            tmp_path,
            language_hint=hint,
        )
    finally:
        tmp_path.unlink(missing_ok=True)

    # Prefer client hint for translation / UI: Twi is not a Whisper language.
    source_lang = "en" if hint == "en" else "tw"
    needs_translation = source_lang != "en" and translation_enabled()
    english = (
        translate_twi_to_english(transcript, source_lang="tw")
        if needs_translation
        else transcript
    )

    elapsed_ms = int((time.perf_counter() - start) * 1000)
    return {
        "transcript_original": transcript,
        "transcript_english": english,
        "detected_language": source_lang,
        "translation_applied": needs_translation,
        "duration_ms": elapsed_ms,
        "audio_duration_sec": round(audio_duration, 2),
    }
