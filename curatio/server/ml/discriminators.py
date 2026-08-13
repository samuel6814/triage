"""SATS clinical discriminators → D vector and C_disc colour floor."""

from __future__ import annotations

import json
import os
import re
from functools import lru_cache
from pathlib import Path
from typing import Any

ORD = {"Green": 1, "Yellow": 2, "Orange": 3, "Red": 4}

_RULES_PATH = Path(__file__).resolve().parent / "discriminators_rules.json"


def discriminator_threshold() -> float:
    raw = os.getenv("DISCRIMINATOR_THRESHOLD", "0.85")
    try:
        return float(raw)
    except ValueError:
        return 0.85


@lru_cache(maxsize=1)
def _load_rules() -> dict[str, Any]:
    with _RULES_PATH.open(encoding="utf-8") as fh:
        return json.load(fh)


def _has_phrase(text_lower: str, phrase: str) -> bool:
    phrase = phrase.lower().strip()
    if not phrase:
        return False
    # Word-boundary-ish for multi-word; allow slash variants
    pattern = re.compile(rf"(?<!\w){re.escape(phrase)}(?!\w)", re.IGNORECASE)
    return bool(pattern.search(text_lower))


def _entity_texts(entities: dict[str, Any] | None) -> list[str]:
    if not entities:
        return []
    texts: list[str] = []
    for key in ("diseases", "drugs"):
        for ent in entities.get(key, []) or []:
            if ent.get("negated"):
                continue
            t = (ent.get("text") or "").strip().lower()
            if t:
                texts.append(t)
    return texts


def _confidence_from_keyword_hits(hits: int) -> float:
    if hits <= 0:
        return 0.0
    if hits == 1:
        return 0.90
    return min(0.98, 0.85 + 0.05 * hits)


def evaluate_discriminators(
    text: str,
    entities: dict[str, Any] | None = None,
    *,
    threshold: float | None = None,
) -> dict[str, Any]:
    """
    Return active discriminators, c_disc, and d_vector.

    Confidence:
      - single keyword → 0.90
      - multiple keywords → min(0.98, 0.85 + 0.05*hits)
      - entity-only → 0.80
      - keyword + entity → max, capped at 0.98
    """
    tau = discriminator_threshold() if threshold is None else threshold
    cfg = _load_rules()
    text_lower = (text or "").lower()
    entity_texts = _entity_texts(entities)
    entity_map: dict[str, str] = cfg.get("entity_map") or {}

    # Aggregate keyword + entity evidence per discriminator id
    keyword_hits: dict[str, int] = {}
    entity_hits: dict[str, int] = {}
    meta: dict[str, dict[str, Any]] = {}
    sources: dict[str, list[str]] = {}

    for rule in cfg.get("rules") or []:
        rid = rule["id"]
        meta[rid] = rule
        sources.setdefault(rid, [])
        for phrase in rule.get("phrases") or []:
            if _has_phrase(text_lower, phrase):
                keyword_hits[rid] = keyword_hits.get(rid, 0) + 1
                sources[rid].append(f"keyword:{phrase}")

    for span in entity_texts:
        mapped = entity_map.get(span)
        if mapped is None:
            for key, disc_id in entity_map.items():
                if key in span or span in key:
                    mapped = disc_id
                    break
        if mapped:
            entity_hits[mapped] = entity_hits.get(mapped, 0) + 1
            sources.setdefault(mapped, []).append(f"entity:{span}")
            if mapped not in meta:
                # Infer colour from any rule with this id
                for rule in cfg.get("rules") or []:
                    if rule["id"] == mapped:
                        meta[mapped] = rule
                        break

    # Compound rules
    for rule in cfg.get("compound_rules") or []:
        rid = rule["id"]
        meta[rid] = rule
        sources.setdefault(rid, [])
        any_ok = any(_has_phrase(text_lower, p) for p in rule.get("any_of") or [])
        and_ok = any(
            _has_phrase(text_lower, p) or any(p in e for e in entity_texts)
            for p in rule.get("and_any_of") or []
        )
        if any_ok and and_ok:
            keyword_hits[rid] = keyword_hits.get(rid, 0) + 1
            sources[rid].append("compound:haemodynamic")

    all_ids = set(keyword_hits) | set(entity_hits) | set(meta)
    d_vector: dict[str, float] = {rid: 0.0 for rid in (r["id"] for r in cfg.get("rules") or [])}
    for rule in cfg.get("compound_rules") or []:
        d_vector.setdefault(rule["id"], 0.0)

    active: list[dict[str, Any]] = []
    for rid in all_ids:
        if rid not in meta:
            continue
        kw = keyword_hits.get(rid, 0)
        ent = entity_hits.get(rid, 0)
        conf = 0.0
        if kw and ent:
            conf = max(_confidence_from_keyword_hits(kw), 0.80)
            conf = min(0.98, conf)
        elif kw:
            conf = _confidence_from_keyword_hits(kw)
            # Compound may set fixed confidence
            if meta[rid].get("confidence") is not None and rid in keyword_hits:
                conf = float(meta[rid]["confidence"])
        elif ent:
            conf = 0.80
        d_vector[rid] = round(conf, 4)
        if conf >= tau:
            # Deduplicate sources while preserving order
            uniq_sources = list(dict.fromkeys(sources.get(rid) or []))
            active.append(
                {
                    "id": rid,
                    "label": meta[rid].get("label", rid),
                    "colour_floor": meta[rid]["colour_floor"],
                    "confidence": round(conf, 4),
                    "sources": uniq_sources,
                }
            )

    active.sort(key=lambda d: (-ORD[d["colour_floor"]], -d["confidence"]))
    c_disc = None
    if active:
        c_disc = max(active, key=lambda d: ORD[d["colour_floor"]])["colour_floor"]

    return {
        "discriminators": active,
        "c_disc": c_disc,
        "d_vector": d_vector,
        "threshold": tau,
    }
