# Research gaps this project answers

These are gaps that **Hospital Chatbot for Color-Coded Clinical Pathways** is positioned to fill, based on the synopsis, literature decks, and what Part 1 actually built.

## 1. Acuity discontinuity

**Gap:** In LMIC hospitals, the SATS colour assigned at triage often stops guiding care after the front desk. Urgency is not continuously tracked as a hospital-wide pathway.

**Our answer:** Treat colour as a digital pathway object \(P(C)\) with destination, \(T_{\max}\), and actions—not only a badge.

## 2. LMIC / Ghanaian chief-complaint NLP

**Gap:** Generic symptom checkers (e.g. Ada/Babylon-style tools) are not tuned to local SATS pathways or informal LMIC complaint language.

**Our answer:** Fine-tuned BioBERT on triage chief complaints → SATS acuity/colour; Curatio chatbot as the intake interface.

## 3. Green Tag Burden

**Gap:** Non-urgent patients congest acute ED capacity.

**Our answer:** Explicit **Green pathway** diversion to OPD / Minors / Polyclinic when NLP assigns levels 4–5.

## 4. Constrained classification vs open-ended LLM risk

**Gap:** Generative clinical chatbots can hallucinate dangerous triage advice.

**Our answer:** Fixed 5-class classifier + deterministic \(f_{\mathrm{SATS}}\) colour map + protocol table—no free-text urgency generation.

## 5. Text-only pre-triage (before vitals)

**Gap:** Full TEWS needs six vitals; patients at home or in the queue often have none.

**Our answer:** NLP acuity as the **entry** Digital Acuity Engine. TEWS remains nurse-side / future overlay—not required for chatbot v1. Bayesian completion of missing vitals is **out of scope**.

## 6. Minority Red safety under class imbalance

**Gap:** Rare Level-1 (Red) cases can be under-recalled if training is majority-skewed.

**Our answer:** Baseline vs SMOTE evaluation; report L1 recall as a safety metric (baseline 98.14%; SMOTE 100% on holdout with trade-offs).

## 7. Colour must mean an operational pathway

**Gap:** Systems that only print “Orange” without destination, timer, or escalation still leave acuity discontinuous.

**Our answer:** Protocol-mapped pathways (Red/Orange/Yellow/Green/Blue) defined for the chatbot output card and thesis methodology.

## Gaps we deliberately do *not* claim to close in this thesis

- Live TEWS algebraic engine in production
- Bayesian posterior fusion with vitals
- Full hospital HIS integration / SMS–USSD nationwide rollout
- Prospective clinical trial at KATH (simulation / holdout eval instead)
