# Triage fusion — implementation spec

**Part 2 documentation pack** for the Curatio hospital chatbot. This folder records how to implement TEWS, discriminator vector **D**, tabular Bayesian fallback, fusion controller **f_fusion**, and pathway map **P(C)**—without re-deciding architecture when you return to build.

**Documentation only.** No Python modules are created here; see [10-implementation-checklist.md](10-implementation-checklist.md) when you implement.

---

## Notation

\[
C = f_{\mathrm{fusion}}(\mathbf{D},\, T,\, \mathbf{P},\; \text{flags}), \qquad
P(C) = \bigl(T_{\max},\; \text{destination},\; \text{actions},\; \text{escalation}\bigr)
\]

| Symbol | Meaning |
|--------|---------|
| \(X\) | Chief complaint text |
| \(C_{\mathrm{NLP}}\) | SATS colour from BioBERT acuity via `SATS_BY_ACUITY` |
| \(\mathbf{D}\) | Discriminator flags from rules + OpenMed |
| \(T\) | TEWS total from vitals \(\mathbf{v}\) |
| \(C_{\mathrm{TEWS}}\) | Colour band from \(T\) alone |
| \(C_{\mathrm{disc}}\) | Minimum colour implied by active discriminators |
| \(C_{\mathrm{Bayes}}\) | \(\arg\max_k P(C_k \mid E)\) from tabular posterior |
| \(C\) | Final fused SATS colour |
| \(P(C)\) | Pathway card attached to \(C\) |

**Safety rule:**

\[
\mathrm{ord}(C) \geq \max\bigl\{\mathrm{ord}(C_{\mathrm{disc}}),\, \mathrm{ord}(C_{\mathrm{TEWS}}),\, \mathrm{ord}(C_{\mathrm{Bayes}}),\, \mathrm{ord}(C_{\mathrm{NLP}})\bigr\}
\]

with \(\mathrm{ord}(\text{Red})=4 > \mathrm{ord}(\text{Orange})=3 > \mathrm{ord}(\text{Yellow})=2 > \mathrm{ord}(\text{Green})=1\).

Plain language: **fuse parallel triage signals into one SATS colour, then assign a pathway.** Fusion is a priority checklist, not an average.

---

## What exists today

| Layer | Status | Location |
|-------|--------|----------|
| Medical gate | Implemented | [`curatio/server/ml/medical_gate.py`](../curatio/server/ml/medical_gate.py) |
| OpenMed NER | Implemented | [`curatio/server/ml/openmed_enrich.py`](../curatio/server/ml/openmed_enrich.py) |
| BioBERT → \(C_{\mathrm{NLP}}\) | Implemented | [`curatio/server/ml/predict.py`](../curatio/server/ml/predict.py) |
| TEWS calculator | **Not implemented** | Spec: [02-tews-calculator.md](02-tews-calculator.md) |
| Discriminators \(\mathbf{D}\) | **Not implemented** | Spec: [03-discriminators.md](03-discriminators.md) |
| Tabular Bayes | **Not implemented** | Spec: [04-bayesian-fallback.md](04-bayesian-fallback.md) |
| \(f_{\mathrm{fusion}}\) | **Not implemented** | Spec: [05-fusion-engine.md](05-fusion-engine.md) |
| \(P(C)\) pathway cards | UI copy only | Spec: [06-pathways.md](06-pathways.md) |
| `POST /fuse` | **Not implemented** | Spec: [07-api-contract.md](07-api-contract.md) |

`POST /predict` remains NLP-only for backward compatibility. `bayesian_candidate` today is only `confidence < 0.85`.

---

## Spec index

| # | File | Contents |
|---|------|----------|
| 01 | [01-architecture.md](01-architecture.md) | End-to-end flow, module map, Curatio integration |
| 02 | [02-tews-calculator.md](02-tews-calculator.md) | \(T = \sum w_k f_k(v_k)\), partial TEWS, \(C_{\mathrm{TEWS}}(T)\) |
| 03 | [03-discriminators.md](03-discriminators.md) | Rule/NER-based \(\mathbf{D} \to C_{\mathrm{disc}}\) |
| 04 | [04-bayesian-fallback.md](04-bayesian-fallback.md) | Tabular \(P(C_k \mid E)\)—not pgmpy |
| 05 | [05-fusion-engine.md](05-fusion-engine.md) | \(f_{\mathrm{fusion}}\), flags, audit JSON |
| 06 | [06-pathways.md](06-pathways.md) | \(P(C)\): \(T_{\max}\), destination, actions |
| 07 | [07-api-contract.md](07-api-contract.md) | `POST /fuse` JSON schema |
| 08 | [08-test-scenarios.md](08-test-scenarios.md) | Worked cases with expected layer votes |
| 09 | [09-thesis-integration.md](09-thesis-integration.md) | Chapter-by-chapter thesis updates |
| 10 | [10-implementation-checklist.md](10-implementation-checklist.md) | Ordered build tasks |

---

## Implementation phases

### Phase 1 — Deterministic core (build first)

1. `tews.py` — full and partial TEWS
2. `pathways.py` — colour → pathway lookup
3. `fusion.py` — max-urgency over \(C_{\mathrm{NLP}}\) and \(C_{\mathrm{TEWS}}\)
4. `fuse.py` + `POST /fuse` in ML API; Express proxy; vitals form on test page

### Phase 2 — Discriminators + tabular Bayes

5. `discriminators.py` — SATS keyword rules + OpenMed entity mapping
6. `bayes_fallback.py` — scenario-keyed prior/likelihood tables
7. Extend `fusion.py` with \(C_{\mathrm{disc}}\) and \(C_{\mathrm{Bayes}}\)

### Phase 3 — Evaluation + thesis

8. Run scenarios in [08-test-scenarios.md](08-test-scenarios.md)
9. Update thesis per [09-thesis-integration.md](09-thesis-integration.md)

---

## Cross-links

| Resource | Path |
|----------|------|
| LaTeX equation strings | [`curatio/client/src/components/presentation/equations.js`](../curatio/client/src/components/presentation/equations.js) |
| Fusion / TEWS / Bayes slides | [`curatio/client/src/pages/dashboard-presentation/slides/`](../curatio/client/src/pages/dashboard-presentation/slides/) |
| LaTeX slide deck | [`slides_saturday/sections/04-fusion-parallel.tex`](../slides_saturday/sections/04-fusion-parallel.tex) |
| Current ML API | [`curatio/server/ml/app.py`](../curatio/server/ml/app.py) |
| Pathway UI copy | [`curatio/client/src/data/acuityLevels.js`](../curatio/client/src/data/acuityLevels.js) |
| Pathway design (framing) | [`project-framing/03-pathways-design.md`](../project-framing/03-pathways-design.md) |
| Reading list (SATS papers) | [`research-findings/00-reading-list.md`](../research-findings/00-reading-list.md) |

---

## Start here when implementing

1. Read [01-architecture.md](01-architecture.md) and [10-implementation-checklist.md](10-implementation-checklist.md)
2. Implement Phase 1 modules; verify against [07-api-contract.md](07-api-contract.md)
3. Run [08-test-scenarios.md](08-test-scenarios.md) cases
4. Add Phase 2; re-run scenarios
5. Update thesis per [09-thesis-integration.md](09-thesis-integration.md)
