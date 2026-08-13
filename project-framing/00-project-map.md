# Project map — Hospital Chatbot for Color-Coded Clinical Pathways

## One-sentence summary

A hospital chatbot that maps a patient’s chief complaint to a SATS acuity level and colour, optionally fuses TEWS / discriminators / tabular Bayes, then attaches a concrete clinical pathway (destination, time target, actions) to the fused colour.

## Architecture (implemented)

```
Chief complaint text (+ optional vitals)
  → Medical gate (reject non-clinical input)
  → OpenMed NER enrichment (timeout-hardened)
  → Fine-tuned BioBERT → C_NLP = f_SATS(ĉ)
  → TEWS → C_TEWS (if vitals)
  → Discriminators → C_disc
  → Tabular Bayes → C_Bayes (when triggered)
  → C = f_fusion(...)   // max-urgency
  → Pathway protocol P(C)
```

`POST /predict` = NLP-only. `POST /fuse` = full fusion + pathway.

## Part 1 — done (software + evaluation)

| Component | Location |
|-----------|----------|
| Fine-tuned BioBERT (baseline + SMOTE) | `fine-tuned-biobert/` |
| ML API (predict, gate, OpenMed, de-identify, voice) | `curatio/server/ml/` |
| Express gateway | `curatio/server/` |
| React demo + presentation UI | `curatio/client/` |
| Holdout eval (~99.92% colour accuracy) | `results/eval_outputs/` |
| Results slides | `results/slides/` |

## Part 2 — fusion + pathways (done)

| Concept | Status |
|---------|--------|
| SATS colour label from NLP | Implemented |
| Five-path protocols (Red→Blue) | Implemented (`pathways.py`) |
| Pathway card on fused colour | Implemented (`/fuse` + TriageTestPage) |
| TEWS calculator from vitals | Implemented (`tews.py`) |
| Discriminators + tabular Bayes | Implemented |
| Spec pack | `triage-fusion/` |

## Explicit non-goals (still)

- No full Bayesian network (pgmpy / structure learning)
- No claim that BioBERT “is” Bayesian TEWS fusion — it provides \(C_{\mathrm{NLP}}\); fusion is a separate controller
- No prospective KATH trial in this draft

## Related folders

| Folder | Role |
|--------|------|
| `triage-fusion/` | Implementation spec + scenario results |
| `project-framing/` | RQs, math scope, pathways framing |
| `thesis/first-draft/` | Thesis chapters |
| `slides_saturday/` | Clinical + fusion math decks |
| `research-findings/` | Reading notes |
