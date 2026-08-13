"""Tokenizer explainability for triage test lab (no re-inference)."""

from __future__ import annotations

from typing import Any

from predict import resolve_model_source
from transformers import AutoTokenizer

_tokenizer = None

PIPELINE_STAGES = [
    {
        "id": "tokenize",
        "title": "Tokenize",
        "blurb": "WordPiece splits the complaint into subword tokens (max 128).",
    },
    {
        "id": "embed",
        "title": "Embed",
        "blurb": "Each token ID looks up a 768-d vector from the embedding table.",
    },
    {
        "id": "encode",
        "title": "Encode",
        "blurb": "Twelve transformer layers refine context via self-attention.",
    },
    {
        "id": "cls",
        "title": "[CLS]",
        "blurb": "The [CLS] vector summarises the whole complaint for classification.",
    },
    {
        "id": "linear",
        "title": "Linear head",
        "blurb": "A linear layer maps [CLS] to five acuity logits.",
    },
    {
        "id": "softmax",
        "title": "Softmax",
        "blurb": "Softmax turns logits into probabilities over levels 1–5.",
    },
    {
        "id": "colour",
        "title": "Colour / fuse",
        "blurb": "f_SATS maps acuity to colour; /fuse may raise urgency with TEWS/disc/Bayes.",
    },
]


def _get_tokenizer():
    global _tokenizer
    if _tokenizer is not None:
        return _tokenizer
    source, _ = resolve_model_source()
    _tokenizer = AutoTokenizer.from_pretrained(source)
    return _tokenizer


def explain_tokenization(text: str, *, max_length: int = 128) -> dict[str, Any]:
    text = (text or "").strip()
    if not text:
        raise ValueError("text must not be empty")

    tokenizer = _get_tokenizer()
    encoded = tokenizer(
        text,
        truncation=True,
        max_length=max_length,
        add_special_tokens=True,
        return_attention_mask=True,
    )
    ids = list(encoded["input_ids"])
    tokens = tokenizer.convert_ids_to_tokens(ids)
    full_ids = tokenizer.encode(text, add_special_tokens=True)
    truncated = len(full_ids) > max_length

    return {
        "text": text,
        "tokens": tokens,
        "token_ids": ids,
        "token_count": len(tokens),
        "max_length": max_length,
        "truncated": truncated,
        "stages": PIPELINE_STAGES,
    }
