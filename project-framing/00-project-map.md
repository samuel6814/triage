# Project map — Hospital Chatbot for Color-Coded Clinical Pathways

## One-sentence summary

A hospital chatbot that maps a patient’s chief complaint to a SATS acuity level and colour, then attaches a concrete clinical pathway (destination, time target, actions)—without requiring a TEWS+Bayesian fusion stack at intake.

## Architecture (implemented)

```
Chief complaint text
  → Medical gate (reject non-clinical input)
  → OpenMed NER enrichment (optional entity tags)
  → Fine-tuned BioBERT (5-class acuity)
  → Softmax → acuity ĉ ∈ {1…5}
  → C = f_SATS(ĉ)   // 1→Red, 2→Orange, 3→Yellow, 4/5→Green
  → Pathway protocol P(C)  // Part 2 design: destination, T_max, actions
```

## Part 1 — done (software + evaluation)

| Component | Location |
|-----------|----------|
| Fine-tuned BioBERT (baseline + SMOTE) | `fine-tuned-biobert/` |
| ML API (predict, gate, OpenMed, de-identify, voice) | `curatio/server/ml/` |
| Express gateway | `curatio/server/` |
| React demo + presentation UI | `curatio/client/` |
| Holdout eval (~99.92% colour accuracy) | `results/eval_outputs/` |
| Results slides | `results/slides/` |

Colour mapping in code: `curatio/server/ml/predict.py` (`SATS_BY_ACUITY`).

## Part 2 — designed here, partially UI-only

| Concept | Status |
|---------|--------|
| SATS colour label from NLP | Implemented |
| Five-path protocols (Red→Blue) | Specified in synopsis + `project-framing/03-pathways-design.md` |
| Pathway card in chatbot (destination + timer + actions) | To implement / document in thesis |
| TEWS calculator from vitals | Deferred (nurse-side / future) |
| Bayesian fusion | **Out of scope** |

## Explicit non-goals

- No Bayesian network implementation
- No three-layer fusion controller (NLP + TEWS + Bayes)
- No claim that BioBERT “already does Bayesian fusion” — it does **text→acuity classification**; pathways attach **deterministically** to colour

## Related folders

| Folder | Role |
|--------|------|
| `project-framing/` | What we are doing (this pack) |
| `research-findings/` | Reading notes and discoveries |
| `systematic-review-prisma/` | PRISMA checklist + flow diagram templates |
| `thesis/first-draft/` | KNUST thesis first draft |
| `papers/`, `biobert/papers/` | Literature PDFs |
| `latex/synopsis-article/` | Original synopsis |
| `slides_saturday/` | Clinical + fusion math decks (historical; Bayes = future work) |
