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

- [ ] Create `curatio/server/ml/tews.py`
- [ ] Implement \(f_1\)–\(f_6\) scoring (HR/RR from equations.js; others from SATS manual)
- [ ] Implement partial sum + `tews_incomplete` flag
- [ ] Implement \(C_{\mathrm{TEWS}}(T)\) colour bands
- [ ] Unit tests: HR=125, RR=26 → T=4, Yellow

### Pathways

- [ ] Create `curatio/server/ml/pathways.py`
- [ ] Load protocol table from [06-pathways.md](06-pathways.md) / `acuityLevels.js` copy
- [ ] `lookup_pathway(colour)` returns full pathway object
- [ ] Unit test: Orange → t_max 10

### Fusion (minimal)

- [ ] Create `curatio/server/ml/fusion.py`
- [ ] Implement `ORD` map and `fuse_max_urgency`
- [ ] Phase 1: only `c_nlp` + `c_tews` inputs
- [ ] Partial TEWS Green suppression flag
- [ ] Unit tests for max-urgency rule

### Orchestrator

- [ ] Create `curatio/server/ml/fuse.py`
- [ ] Call existing `predict()` for NLP layer
- [ ] Call `tews.compute_tews(vitals)` when vitals present
- [ ] Call `fusion.fuse()` then `pathways.lookup_pathway()`
- [ ] Build audit JSON per [05-fusion-engine.md](05-fusion-engine.md)

### API

- [ ] Add `FuseRequest` + `POST /fuse` to [`app.py`](../curatio/server/ml/app.py)
- [ ] Add `POST /fuse` proxy to [`triage.js`](../curatio/server/routes/triage.js)
- [ ] Document in [`curatio/server/ml/README.md`](../curatio/server/ml/README.md)

### Client (optional but recommended)

- [ ] Vitals form on [`TriageTestPage.jsx`](../curatio/client/src/pages/test/TriageTestPage.jsx)
- [ ] Call `/api/triage/fuse` when vitals filled
- [ ] Display pathway card + layer audit panel

### Phase 1 verification

- [ ] Run Scenario 5 (Green diversion) from [08-test-scenarios.md](08-test-scenarios.md)
- [ ] Confirm `/predict` unchanged (Scenario 8)

---

## Phase 2 — Discriminators + tabular Bayes

### Discriminators

- [ ] Create `curatio/server/ml/discriminators.py`
- [ ] Add `discriminators_rules.json` (or inline dict) from [03-discriminators.md](03-discriminators.md)
- [ ] Keyword + OpenMed entity mapping
- [ ] Return `c_disc`, active list, `d_vector`
- [ ] Unit test: chest pain text → Orange floor

### Bayesian fallback

- [ ] Create `curatio/server/ml/bayes_fallback.py`
- [ ] Add `bayes_tables.json` with chest pain table from [04-bayesian-fallback.md](04-bayesian-fallback.md)
- [ ] Scenario key matcher
- [ ] Trigger logic: incomplete TEWS, low confidence, layer conflict
- [ ] Optional MI override rule (\(\tau_B = 0.75\))
- [ ] Unit test: chest pain scenario → Orange posterior ~0.89

### Fusion (full)

- [ ] Extend `fusion.py` to accept `c_disc`, `c_bayes`
- [ ] Wire in `fuse.py`
- [ ] Populate full `layers` and `flags` in response

### Phase 2 verification

- [ ] Run Scenario 1 (chest pain) — full layer audit
- [ ] Run Scenarios 2, 3, 6, 7
- [ ] Add `curatio/server/ml/tests/test_fuse.py`

---

## Phase 3 — Evaluation + thesis

- [ ] Export fusion scenario table for thesis Ch.4
- [ ] Update [`project-framing/02-research-questions.md`](../project-framing/02-research-questions.md) (RQ10)
- [ ] Update [`project-framing/04-mathematics-scope.md`](../project-framing/04-mathematics-scope.md)
- [ ] Update [`project-framing/03-pathways-design.md`](../project-framing/03-pathways-design.md)
- [ ] Revise thesis per [09-thesis-integration.md](09-thesis-integration.md)
- [ ] Rebuild PDFs: `python scripts/publish_pdfs.py`
- [ ] Update presentation slides “future work” → “implemented”

---

## Files to add (summary)

```text
triage-fusion/                    # this spec (done)
curatio/server/ml/
  tews.py
  pathways.py
  fusion.py
  fuse.py
  discriminators.py               # Phase 2
  bayes_fallback.py               # Phase 2
  bayes_tables.json               # Phase 2
  discriminators_rules.json       # Phase 2
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

Existing: `CONFIDENCE_THRESHOLD`, `CLINICAL_RELEVANCE_THRESHOLD`, OpenMed vars — unchanged.

---

## Definition of done

- [ ] All Phase 1–2 checklist items checked
- [ ] Scenarios 1–8 pass (with noted NLP variability on Scenario 2)
- [ ] `/predict` regression clean
- [ ] Thesis Ch.3–4 draft updated with fusion content
- [ ] `project-framing/` pointers live
