# 10 — Implementation checklist

Ordered tasks for building triage fusion. Check off as you complete each item.

---

## Phase 0 — Prep

- [ ] Read [README.md](README.md) and [01-architecture.md](01-architecture.md)
- [ ] Confirm ML service runs: `cd curatio/server && npm run dev`
- [ ] Skim [`equations.js`](../curatio/client/src/components/presentation/equations.js) for equation parity

---

## Phase 1 — Deterministic core

### TEWS

- [x] Create `curatio/server/ml/tews.py`
- [x] Implement \(f_1\)–\(f_6\) scoring (HR/RR from equations.js; others from SATS manual)
- [x] Implement partial sum + `tews_incomplete` flag
- [x] Implement \(C_{\mathrm{TEWS}}(T)\) colour bands
- [x] Unit tests: HR=125, RR=26 → T=4, Yellow

### Pathways

- [x] Create `curatio/server/ml/pathways.py`
- [x] Load protocol table from [06-pathways.md](06-pathways.md) / `acuityLevels.js` copy
- [x] `lookup_pathway(colour)` returns full pathway object
- [x] Unit test: Orange → t_max 10

### Fusion (minimal)

- [x] Create `curatio/server/ml/fusion.py`
- [x] Implement `ORD` map and `fuse_max_urgency`
- [x] Phase 1: only `c_nlp` + `c_tews` inputs
- [x] Partial TEWS Green suppression flag
- [x] Unit tests for max-urgency rule

### Orchestrator

- [x] Create `curatio/server/ml/fuse.py`
- [x] Call existing `predict()` for NLP layer
- [x] Call `tews.compute_tews(vitals)` when vitals present
- [x] Call `fusion.fuse()` then `pathways.lookup_pathway()`
- [x] Build audit JSON per [05-fusion-engine.md](05-fusion-engine.md)

### API

- [x] Add `FuseRequest` + `POST /fuse` to [`app.py`](../curatio/server/ml/app.py)
- [x] Add `POST /fuse` proxy to [`triage.js`](../curatio/server/routes/triage.js)
- [x] Document in [`curatio/server/ml/README.md`](../curatio/server/ml/README.md)

### Client (optional but recommended)

- [x] Vitals form on [`TriageTestPage.jsx`](../curatio/client/src/pages/test/TriageTestPage.jsx)
- [x] Call `/api/triage/fuse` when vitals filled
- [x] Display pathway card + layer audit panel

### Phase 1 verification

- [x] Run Scenario 5 (Green diversion) from [08-test-scenarios.md](08-test-scenarios.md)
- [x] Confirm `/predict` unchanged (Scenario 8)

---

## Phase 2 — Discriminators + tabular Bayes

### Discriminators

- [x] Create `curatio/server/ml/discriminators.py`
- [x] Add `discriminators_rules.json` (or inline dict) from [03-discriminators.md](03-discriminators.md)
- [x] Keyword + OpenMed entity mapping
- [x] Return `c_disc`, active list, `d_vector`
- [x] Unit test: chest pain text → Orange floor

### Bayesian fallback

- [x] Create `curatio/server/ml/bayes_fallback.py`
- [x] Add `bayes_tables.json` with chest pain table from [04-bayesian-fallback.md](04-bayesian-fallback.md)
- [x] Scenario key matcher
- [x] Trigger logic: incomplete TEWS, low confidence, layer conflict
- [x] Optional MI override rule (\(\tau_B = 0.75\))
- [x] Unit test: chest pain scenario → Orange posterior ~0.89

### Fusion (full)

- [x] Extend `fusion.py` to accept `c_disc`, `c_bayes`
- [x] Wire in `fuse.py`
- [x] Populate full `layers` and `flags` in response

### Phase 2 verification

- [x] Run Scenario 1 (chest pain) — full layer audit
- [x] Run Scenarios 2, 3, 6, 7
- [x] Add `curatio/server/ml/tests/test_fuse.py`

---

## Phase 3 — Evaluation + thesis

- [x] Export fusion scenario table for thesis Ch.4
- [x] Update [`project-framing/02-research-questions.md`](../project-framing/02-research-questions.md) (RQ10)
- [x] Update [`project-framing/04-mathematics-scope.md`](../project-framing/04-mathematics-scope.md)
- [x] Update [`project-framing/03-pathways-design.md`](../project-framing/03-pathways-design.md)
- [x] Revise thesis per [09-thesis-integration.md](09-thesis-integration.md)
- [x] Rebuild PDFs: `python scripts/publish_pdfs.py`
- [x] Update presentation slides “future work” → “implemented”

---

## Files to add (summary)

```text
triage-fusion/                    # this spec (done)
curatio/server/ml/
  tews.py
  pathways.py
  fusion.py
  fuse.py
  discriminators.py               # Phase 2 done
  bayes_fallback.py               # Phase 2 done
  bayes_tables.json               # Phase 2 done
  discriminators_rules.json       # Phase 2 done
  tests/test_fuse.py
```

---

## Environment variables (new)

| Variable | Default | Module |
|----------|---------|--------|
| `TEWS_ALLOW_PARTIAL` | `true` | tews.py |
| `FUSION_RULE` | `max_urgency` | fusion.py |
| `SUPPRESS_TEWS_GREEN_WHEN_INCOMPLETE` | `true` | fusion.py |
| `DISCRIMINATOR_THRESHOLD` | `0.85` | discriminators.py |
| `BAYES_MI_THRESHOLD` | `0.75` | bayes_fallback.py |
| `OPENMED_TIMEOUT_SECONDS` | `20` | openmed_enrich.py |

Existing: `CONFIDENCE_THRESHOLD`, `CLINICAL_RELEVANCE_THRESHOLD`, OpenMed vars — unchanged.

---

## Definition of done

- [x] All Phase 1–2 checklist items checked
- [x] Scenarios 1–8 pass (with noted NLP variability on Scenario 2)
- [x] `/predict` regression clean
- [x] Thesis Ch.3–4 draft updated with fusion content
- [x] `project-framing/` pointers live
