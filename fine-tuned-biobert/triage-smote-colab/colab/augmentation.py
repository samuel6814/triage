"""Text augmentation for minority chief complaints."""

from __future__ import annotations

import random
import re
from typing import Optional

import pandas as pd

import config

# Tokens we avoid swapping or deleting
MEDICAL_KEYWORDS = frozenset({
    "pain", "chest", "headache", "fever", "feverish", "bleeding", "blood",
    "unconscious", "breath", "breathing", "heart", "stroke", "seizure",
    "trauma", "fracture", "vomit", "nausea", "glaucoma", "acute",
    "severe", "crushing", "thunderclap", "dyspnea", "cough", "injury",
    "wound", "burn", "pregnant", "pregnancy", "child", "infant",
})

_SYNONYMS = {
    "worsening": ["deteriorating", "getting worse", "increasing"],
    "severe": ["bad", "intense", "strong"],
    "mild": ["slight", "minor", "light"],
    "acute": ["sudden", "rapid onset"],
    "chronic": ["long-standing", "persistent"],
    "intermittent": ["on and off", "occasional"],
    "associated": ["with", "along with"],
    "movement": ["motion", "activity"],
    "advice": ["consultation", "guidance"],
}


def _tokenize(text: str) -> list[str]:
    return re.findall(r"\b[\w']+\b", text.lower())


def _is_protected(token: str) -> bool:
    return token.lower() in MEDICAL_KEYWORDS


def _synonym_replace(text: str, rng: random.Random) -> str:
    words = text.split()
    if not words:
        return text
    indices = [i for i, w in enumerate(words) if w.lower() in _SYNONYMS and not _is_protected(w.lower())]
    if not indices:
        return text
    i = rng.choice(indices)
    key = words[i].lower()
    repl = rng.choice(_SYNONYMS[key])
    words[i] = repl
    return " ".join(words)


def _word_swap(text: str, rng: random.Random) -> str:
    words = text.split()
    if len(words) < 3:
        return text
    candidates = [
        i for i in range(len(words) - 1)
        if not _is_protected(words[i]) and not _is_protected(words[i + 1])
    ]
    if not candidates:
        return text
    i = rng.choice(candidates)
    words[i], words[i + 1] = words[i + 1], words[i]
    return " ".join(words)


def _random_deletion(text: str, rng: random.Random, p: float = 0.1) -> str:
    words = text.split()
    if len(words) <= 3:
        return text
    kept = [
        w for w in words
        if _is_protected(w.lower()) or rng.random() > p
    ]
    return " ".join(kept) if len(kept) >= 2 else text


def augment_complaint(text: str, n: int = 1, seed: Optional[int] = None) -> list[str]:
    """Return up to n augmented variants of a chief complaint."""
    rng = random.Random(seed)
    ops = [_synonym_replace, _word_swap, _random_deletion]
    results: list[str] = []
    seen = {text.strip().lower()}

    for i in range(n * 3):
        if len(results) >= n:
            break
        op = ops[i % len(ops)]
        variant = op(text, rng).strip()
        key = variant.lower()
        if key and key not in seen and variant != text:
            seen.add(key)
            results.append(variant)

    return results


def augment_minority_classes(
    train_df: pd.DataFrame,
    augment_classes: Optional[list[int]] = None,
    per_sample: Optional[dict[int, int]] = None,
    seed: int = config.RANDOM_SEED,
) -> pd.DataFrame:
    """Add augmented rows for specified acuity levels. Returns expanded train_df."""
    augment_classes = augment_classes or config.AUGMENT_CLASSES
    per_sample = per_sample or config.AUGMENT_PER_SAMPLE
    rng = random.Random(seed)

    extra_rows = []
    for level in augment_classes:
        subset = train_df[train_df["acuity_level"] == level]
        n_aug = per_sample.get(level, 1)
        for _, row in subset.iterrows():
            variants = augment_complaint(
                row["text"],
                n=n_aug,
                seed=rng.randint(0, 2**31 - 1),
            )
            for v in variants:
                extra_rows.append({
                    "text": v,
                    "label": row["label"],
                    "acuity_level": row["acuity_level"],
                    "is_augmented": True,
                })

    if not extra_rows:
        out = train_df.copy()
        out["is_augmented"] = out.get("is_augmented", False)
        return out

    aug_df = pd.DataFrame(extra_rows)
    base = train_df.copy()
    base["is_augmented"] = False
    return pd.concat([base, aug_df], ignore_index=True)
