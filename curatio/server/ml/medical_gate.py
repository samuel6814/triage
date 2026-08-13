"""Clinical relevance gate with dynamic rejection messages."""

from __future__ import annotations

import os
import re
from dataclasses import dataclass
from typing import Any, Literal

RejectionCategory = Literal[
    "empty_input",
    "insufficient_text",
    "non_clinical_topic",
    "no_clinical_content",
    "too_vague",
]
SuggestedAction = Literal["enter_chief_complaint", "seek_clinical_advice", "emergency_services"]

DEFAULT_THRESHOLD = float(os.getenv("CLINICAL_RELEVANCE_THRESHOLD", "0.35"))
VAGUE_SCORE_MIN = 0.15

# Non-clinical topics — sports, social, travel, school, shopping, greetings-only, etc.
NON_CLINICAL_PATTERNS: tuple[re.Pattern[str], ...] = tuple(
    re.compile(p, re.IGNORECASE)
    for p in (
        r"\bplay(?:ing)?\s+(?:football|soccer|basketball|cricket|tennis|golf)\b",
        r"\bgoing\s+to\s+play\b",
        r"\bwatch(?:ing)?\s+(?:the\s+)?match\b",
        r"\b(?:football|soccer)\s+(?:match|game|training)\b",
        r"\b(?:party|wedding|birthday|graduation)\s+(?:party|celebration)?\b",
        r"\bgo(?:ing)?\s+(?:to|for)\s+(?:the\s+)?(?:beach|cinema|movies|shopping|mall)\b",
        r"\b(?:buy|buying|sell|selling)\s+(?:rice|food|goods|items)\b",
        r"\b(?:homework|assignment|exam|school|lecture|class)\b",
        r"\b(?:cook|cooking|recipe|kitchen)\b",
        r"\b(?:weather|rain|sunny|forecast)\b",
        r"\b(?:travel|travelling|vacation|holiday|flight|airport)\b",
        r"\b(?:job|work|office|meeting|salary|boss)\b",
        r"^(?:hi|hello|hey|good\s+(?:morning|afternoon|evening))(?:\s+there)?[!.?]*$",
        r"\bhow\s+are\s+you\b",
        r"\bwhat(?:'s|\s+is)\s+up\b",
        r"\b(?:netflix|movie|series|game|gaming)\b",
    )
)

GREETING_ONLY_PATTERN = re.compile(
    r"^(?:hi|hello|hey|good\s+(?:morning|afternoon|evening))(?:\s+there)?[!.?]*$",
    re.IGNORECASE,
)

SOCIAL_CHATTER_PATTERN = re.compile(
    r"^(?:hi|hello|hey)\b.*\b(?:how\s+are\s+you|what(?:'s|\s+is)\s+up)\b",
    re.IGNORECASE,
)

TRIAGE_CONTEXT_PATTERNS: tuple[re.Pattern[str], ...] = tuple(
    re.compile(p, re.IGNORECASE)
    for p in (
        r"\b(?:kath|komfo\s+anokye|opd|emergency|a\s*&\s*e|triage|polyclinic)\b",
        r"\b(?:nurse|doctor|clinic|hospital|ward)\b",
        r"\b(?:chief\s+complaint|patient|vitals?|tews)\b",
        r"\b(?:family\s+planning|contraception|suture\s+removal|stitch(?:es)?\s+removal)\b",
        r"\b(?:follow[\s-]?up|review|check[\s-]?up)\b",
        r"\b(?:injection|prescription|medication)\b",
    )
)

SYMPTOM_TERMS: frozenset[str] = frozenset(
    {
        "pain", "ache", "fever", "headache", "vomit", "nausea", "cough", "rash",
        "bleed", "blood", "breath", "breathless", "chest", "abdomen", "stomach",
        "diarrhea", "diarrhoea", "dizzy", "weak", "weakness", "swell", "swollen",
        "seizure", "unconscious", "collapse", "injury", "wound", "burn", "fracture",
        "infection", "pus", "discharge", "itch", "sore", "throat", "ear", "eye",
        "pregnant", "pregnancy", "labour", "labor", "contractions", "bleeding",
        "palpitation", "sweat", "chill", "stiff", "numb", "tingl", "confus",
        "pneumothorax", "meningococcal", "thunderclap", "dissection", "shingles",
        "tonsillitis", "conjunctivitis", "erythema", "purpura", "sepsis", "stemi",
        "anaphylaxis", "hemorrhage", "haemorrhage", "symptom", "sick", "ill",
        "hurt", "injured", "trauma", "poison", "overdose", "allerg", "cramp",
        "spasm", "migraine", "asthma", "diabetes", "hypertension", "malaria",
    }
)

GUIDANCE_POOL: dict[str, tuple[str, ...]] = {
    "non_clinical_topic": (
        "If you or someone else has symptoms, describe them here — pain, fever, breathing difficulty, injury, or when the problem started.",
        "For non-emergency health questions, speak to a nurse or doctor at the hospital. This tool is for triage chief complaints only.",
        "If you need medical advice, seek help from a qualified clinician — describe what the patient feels, not everyday plans.",
    ),
    "no_clinical_content": (
        "Enter a chief complaint: what symptom or problem brought the patient to hospital?",
        "Describe the illness or injury in the patient's own words, including when it started and how severe it feels.",
        "For health concerns, please consult a nurse or doctor. This demo predicts triage urgency from clinical text only.",
    ),
    "too_vague": (
        "Add more detail — where is the pain, how long has it lasted, and what makes it better or worse?",
        "Include key clinical terms if known, or describe what the patient can no longer do because of the problem.",
        "If unsure whether it is urgent, seek professional assessment at OPD rather than guessing from a short message.",
    ),
    "empty_input": (
        "Type what the patient said — for example: chest pain since this morning, or fever and vomiting for two days.",
    ),
    "insufficient_text": (
        "Chief complaints need enough detail for triage. Describe symptoms, injury, or the reason for the hospital visit.",
    ),
    "default": (
        "If you need urgent medical help, go to the nearest emergency department or call emergency services — do not rely on this demo for emergencies.",
        "For ongoing health problems, seek professional help from a nurse or doctor at your facility.",
    ),
}

CATEGORY_ACTION: dict[str, SuggestedAction] = {
    "non_clinical_topic": "enter_chief_complaint",
    "no_clinical_content": "enter_chief_complaint",
    "too_vague": "seek_clinical_advice",
    "empty_input": "enter_chief_complaint",
    "insufficient_text": "enter_chief_complaint",
}


@dataclass(frozen=True)
class GateResult:
    is_medical: bool
    clinical_relevance_score: float = 0.0
    rejection_reason: str | None = None
    rejection_category: RejectionCategory | None = None
    message: str | None = None
    guidance: str | None = None
    suggested_action: SuggestedAction | None = None
    signals: dict[str, Any] | None = None


def threshold() -> float:
    return DEFAULT_THRESHOLD


def _normalize(text: str) -> str:
    return re.sub(r"\s+", " ", (text or "").strip().lower())


def _quote_snippet(text: str, max_len: int = 80) -> str:
    cleaned = (text or "").strip()
    if len(cleaned) <= max_len:
        return cleaned
    return cleaned[: max_len - 1].rstrip() + "…"


def has_triage_context(text: str) -> bool:
    return any(p.search(text) for p in TRIAGE_CONTEXT_PATTERNS)


def symptom_terms_found(text: str) -> list[str]:
    lowered = _normalize(text)
    return sorted({term for term in SYMPTOM_TERMS if term in lowered})


def has_symptom_lexicon(text: str) -> bool:
    return bool(symptom_terms_found(text))


def matches_non_clinical_pattern(text: str) -> bool:
    return any(p.search(text) for p in NON_CLINICAL_PATTERNS)


def is_greeting_only(text: str) -> bool:
    stripped = text.strip()
    return bool(GREETING_ONLY_PATTERN.match(stripped) or SOCIAL_CHATTER_PATTERN.match(stripped))


def count_openmed_entities(entities: dict[str, Any] | None) -> tuple[int, int]:
    if not entities:
        return 0, 0
    diseases = sum(
        1
        for e in entities.get("diseases", [])
        if e.get("text") and not e.get("negated")
    )
    drugs = sum(
        1
        for e in entities.get("drugs", [])
        if e.get("text") and not e.get("negated")
    )
    return diseases, drugs


def has_openmed_clinical_entities(entities: dict[str, Any] | None) -> bool:
    d, dr = count_openmed_entities(entities)
    return d > 0 or dr > 0


def collect_signals(text: str, entities: dict[str, Any] | None) -> dict[str, Any]:
    disease_count, drug_count = count_openmed_entities(entities)
    symptoms = symptom_terms_found(text)
    return {
        "triage_context": has_triage_context(text),
        "symptom_lexicon": bool(symptoms),
        "symptom_terms": symptoms,
        "openmed_entities": has_openmed_clinical_entities(entities),
        "disease_entity_count": disease_count,
        "drug_entity_count": drug_count,
        "non_clinical_pattern": matches_non_clinical_pattern(text),
        "greeting_only": is_greeting_only(text),
    }


def score_clinical_relevance(text: str, entities: dict[str, Any] | None) -> float:
    """Return 0.0–1.0 estimate of how clinical the input is."""
    signals = collect_signals(text, entities)
    score = 0.0

    disease_score = min(0.6, signals["disease_entity_count"] * 0.45)
    drug_score = min(0.35, signals["drug_entity_count"] * 0.25)
    symptom_score = min(0.45, len(signals["symptom_terms"]) * 0.15)

    score += disease_score + drug_score + symptom_score
    if signals["triage_context"]:
        score += 0.25
    if signals["non_clinical_pattern"] or signals["greeting_only"]:
        score -= 0.5

    return round(max(0.0, min(1.0, score)), 3)


def classify_rejection(
    text: str,
    signals: dict[str, Any],
    score: float,
) -> RejectionCategory:
    if signals.get("greeting_only"):
        return "no_clinical_content"
    if signals.get("non_clinical_pattern"):
        return "non_clinical_topic"
    if VAGUE_SCORE_MIN <= score < threshold():
        return "too_vague"
    return "no_clinical_content"


def _pick_guidance(text: str, category: str) -> str:
    pool = GUIDANCE_POOL.get(category) or GUIDANCE_POOL["default"]
    idx = hash(_normalize(text)) % len(pool)
    return pool[idx]


def build_rejection_message(
    text: str,
    category: RejectionCategory,
    signals: dict[str, Any],
    score: float,
) -> str:
    snippet = _quote_snippet(text)

    if category == "empty_input":
        return "Please enter a chief complaint before triage can run."

    if category == "insufficient_text":
        return (
            f"\"{snippet}\" is too short to assess. "
            "Describe symptoms, injury, or why the patient came to hospital."
        )

    if category == "non_clinical_topic":
        return (
            f"You wrote: \"{snippet}\" — that sounds like everyday life, "
            "not an illness, symptom, or reason for hospital triage."
        )

    if category == "too_vague":
        return (
            f"\"{snippet}\" is too vague for triage (relevance score {score:.2f}). "
            "Describe what the patient feels or why they came to the hospital."
        )

    # no_clinical_content
    if snippet:
        return (
            f"We could not find symptoms, conditions, or a clinical visit reason in: "
            f"\"{snippet}\"."
        )
    return "We could not find symptoms, conditions, or a clinical reason for triage in what you entered."


def build_guidance(text: str, category: RejectionCategory) -> str:
    primary = _pick_guidance(text, category)
    if category in ("non_clinical_topic", "no_clinical_content", "too_vague"):
        emergency = _pick_guidance(text, "default")
        if emergency not in primary:
            return f"{primary} {emergency}"
    return primary


def evaluate(text: str, entities: dict[str, Any] | None = None) -> GateResult:
    """Return whether text should proceed to BioBERT triage."""
    text = (text or "").strip()
    if not text:
        category: RejectionCategory = "empty_input"
        return GateResult(
            is_medical=False,
            clinical_relevance_score=0.0,
            rejection_reason="empty_input",
            rejection_category=category,
            message=build_rejection_message(text, category, {}, 0.0),
            guidance=build_guidance(text, category),
            suggested_action=CATEGORY_ACTION[category],
            signals={},
        )

    if len(re.sub(r"[^a-zA-Z]", "", text)) < 3:
        category = "insufficient_text"
        return GateResult(
            is_medical=False,
            clinical_relevance_score=0.0,
            rejection_reason="insufficient_text",
            rejection_category=category,
            message=build_rejection_message(text, category, {"too_short": True}, 0.0),
            guidance=build_guidance(text, category),
            suggested_action=CATEGORY_ACTION[category],
            signals={"too_short": True},
        )

    signals = collect_signals(text, entities)
    score = score_clinical_relevance(text, entities)

    if score >= threshold():
        return GateResult(
            is_medical=True,
            clinical_relevance_score=score,
            signals=signals,
        )

    category = classify_rejection(text, signals, score)
    return GateResult(
        is_medical=False,
        clinical_relevance_score=score,
        rejection_reason="not_a_medical_complaint",
        rejection_category=category,
        message=build_rejection_message(text, category, signals, score),
        guidance=build_guidance(text, category),
        suggested_action=CATEGORY_ACTION.get(category, "seek_clinical_advice"),
        signals=signals,
    )


def rejection_payload(text: str, gate: GateResult, entities: dict[str, Any] | None) -> dict:
    return {
        "text": text,
        "is_medical_complaint": False,
        "rejection_reason": gate.rejection_reason,
        "rejection_category": gate.rejection_category,
        "clinical_relevance_score": gate.clinical_relevance_score,
        "message": gate.message,
        "guidance": gate.guidance,
        "suggested_action": gate.suggested_action,
        "signals": gate.signals,
        "entities": entities or {"diseases": [], "drugs": [], "negated": []},
    }
