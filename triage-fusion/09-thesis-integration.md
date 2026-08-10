# 09 — Thesis integration

How to revise the KNUST thesis when triage fusion (Part 2) is implemented. Current first draft ([`thesis/first-draft/`](../thesis/first-draft/)) scopes Part 2 as NLP-only pathways without TEWS or Bayes—this document records the delta.

---

## Scope shift (one paragraph for Ch.1)

**Before:** BioBERT maps text → acuity → deterministic colour → pathway \(P(C)\); TEWS and Bayesian fusion deferred.

**After:** The chatbot runs parallel layers (NLP acuity, TEWS when vitals supplied, rule-based discriminators **D**, tabular Bayesian fallback) combined by \(f_{\mathrm{fusion}}\) with a max-urgency safety rule; pathway \(P(C)\) attaches to the **fused** colour \(C\). Tabular Bayes is a **fallback** for partial evidence—not a full Bayesian network.

---

## Chapter-by-chapter updates

### Abstract

- Mention multi-signal fusion controller \(f_{\mathrm{fusion}}\) and protocol pathways \(P(C)\).
- State evaluation: (1) 8k holdout NLP metrics unchanged; (2) scenario-based fusion table for conflict cases.

### Chapter 1 — Introduction

| Section | Change |
|---------|--------|
| Problem statement | Chatbot intake may include optional vitals; fusion prevents under-triage when language and vitals disagree |
| Objectives | Add objective: implement and evaluate \(f_{\mathrm{fusion}}\) + \(P(C)\) |
| Scope | **Include** TEWS calculator, discriminators, tabular Bayes; **exclude** full BN / pgmpy |
| Architecture figure | Replace NLP-only diagram with pipeline from [01-architecture.md](01-architecture.md) |

### Chapter 2 — Literature review

| Topic | Action |
|-------|--------|
| SATS / KATH | Keep; emphasise TEWS + discriminators as complementary |
| TEWS | Restore as implemented parallel path, not “nurse desk only” |
| Bayesian triage | Cite multimodal BN paper as **related work**; position tabular fallback as deliberate simplification |
| NLP triage | BioBERT remains primary language signal; discriminators are explicit rules |
| Fusion safety | Cite max-urgency rule; contrast with score averaging |

Update [`thesis/first-draft/chapter2.tex`](../thesis/first-draft/chapter2.tex) line that says TEWS is not implemented—revise when code exists.

### Chapter 3 — Methodology

Add subsections (with equations matching [`equations.js`](../curatio/client/src/components/presentation/equations.js)):

1. **Medical gate** — unchanged
2. **BioBERT acuity** — unchanged (\(\hat{\mathbf{y}} = \mathrm{softmax}(\ldots)\))
3. **TEWS** — \(T = \sum w_k f_k(v_k)\), partial sum, \(C_{\mathrm{TEWS}}(T)\)
4. **Discriminators** — \(\mathbf{D} = f_{\mathrm{disc}}(X)\), threshold \(\tau_D\)
5. **Tabular Bayesian fallback** — \(P(C_k \mid E)\), scenario tables, trigger conditions
6. **Fusion** — \(\mathrm{ord}(C) \geq \max\{\ldots\}\)
7. **Pathways** — \(P(C)\) protocol table
8. **API** — `/predict` vs `/fuse`

Include chest-pain worked example from [08-test-scenarios.md](08-test-scenarios.md).

### Chapter 4 — Results

| Result block | Content |
|--------------|---------|
| NLP holdout | Keep existing ~99.92% colour accuracy under \(f_{\mathrm{SATS}}\) |
| Fusion scenarios | New table: layer votes + fused \(C\) for 5–8 cases |
| Safety metric | Count conflict cases where fusion strictly more urgent than NLP alone |
| Limitations | Tabular priors not hospital-calibrated; vitals optional at intake |

Do **not** claim fusion improves holdout accuracy on text-only labels—TEWS/Bayes are not in the 8k label set.

### Chapter 5 — Discussion and conclusion

| Topic | Change |
|-------|--------|
| RQ10 | Revise from “architecture without TEWS+Bayes” to fusion safety question (below) |
| LMIC deployment | Optional vitals from patient self-report vs nurse measurement |
| Future work | Full BN calibration, discriminator ML head, prospective KATH pilot |

Remove statements that final architecture excludes TEWS and Bayes at intake.

---

## Research questions

Update [`project-framing/02-research-questions.md`](../project-framing/02-research-questions.md) when implementing:

**Revised RQ10 (example):**

> Does \(f_{\mathrm{fusion}}\) assign a safer SATS colour than \(C_{\mathrm{NLP}}\) alone when TEWS and language disagree?

**Optional RQ11:**

> Are protocol pathway cards \(P(C)\) correctly attached to fused colours in end-to-end API tests?

Keep RQ1–RQ9; RQ2 still holds under \(f_{\mathrm{SATS}}\) for NLP-only evaluation.

---

## Mathematics scope

Update [`project-framing/04-mathematics-scope.md`](../project-framing/04-mathematics-scope.md):

**Move from “deferred” to “in scope”:**

- TEWS sum and \(C_{\mathrm{TEWS}}(T)\)
- Tabular \(P(C_k \mid E)\)
- Fusion safety max rule
- Discriminator vector \(\mathbf{D}\)

**Keep deferred:**

- Full Bayesian network (pgmpy)
- Learned discriminator neural head
- Prospective clinical trial

Add pointer: “Implementation spec → [`triage-fusion/`](../triage-fusion/)”.

---

## Pathways design

Update [`project-framing/03-pathways-design.md`](../project-framing/03-pathways-design.md):

- Change “no TEWS at intake” to “pathway on **fused** \(C\)”
- Remove “What we are not building” TEWS/Bayes bullets when implemented
- Add cross-link to [06-pathways.md](06-pathways.md)

---

## Slides and presentation

Existing fusion slides remain valid:

- [`slides_saturday/sections/04-fusion-parallel.tex`](../slides_saturday/sections/04-fusion-parallel.tex)
- Dashboard presentation slides (Fusion, TEWS, Bayesian)

Update any slide that says “future work” to “implemented in `/fuse`” after Phase 2.

---

## PRISMA / systematic review

No change required unless you add papers on multimodal triage—optional citation in Ch.2 only.

---

## PDF rebuild

After thesis edits:

```bash
python scripts/publish_pdfs.py
```

---

## Checklist before submission

- [ ] Ch.3 equations match `equations.js` / slides
- [ ] Ch.4 fusion scenario table populated from real `/fuse` runs
- [ ] Abstract does not claim full BN
- [ ] Code appendix lists `triage-fusion/` spec + `curatio/server/ml/` modules
- [ ] RQ10 wording consistent in Ch.1, Ch.5, and `project-framing/02-research-questions.md`
