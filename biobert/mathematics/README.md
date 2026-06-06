# Mathematical specification (Beamer)

**Canonical technical reference** for the Hospital Chatbot hybrid triage engine: full equations with **plain-English explanations**, **why each formula is used**, **TikZ flowcharts**, data contracts, and numeric traces.

Companion narrative deck: [`../integration/hybrid-triage-system.pdf`](../integration/hybrid-triage-system.pdf).

## Files

| File | Purpose |
|------|---------|
| `biobert-mathematics.tex` | LaTeX source (~60+ slides, diagrams via TikZ) |
| `biobert-mathematics.pdf` | Compiled deck |

## Compile

```bash
cd biobert/mathematics
pdflatex biobert-mathematics.tex
pdflatex biobert-mathematics.tex
```

## Content outline

| Part | Topics |
|------|--------|
| Big picture | What we build, overall flowchart, why three layers |
| System formalism | Notation (plain + formal), $\mathbf{S}_s$, layer function diagram, execution order |
| Data requirements | Patient input, SATS tables, priors, audit logs, training vs runtime |
| Inter-module interfaces | Session schema, API sequence, invocation timeline |
| Voice pipeline | $g_{\text{ASR}}$, $g_{\text{trans}}$, Google API constraints, error $\epsilon$ |
| Layer 1 NLP | Tokenisation, embeddings, attention, MultiHead, FFN, MLM, classifier $\mathbf{D}$ |
| Layer 2 TEWS | $T=\sum w_k f_k(v_k)$, piecewise $f_1$, $f_2$, colour map, incomplete vitals |
| Layer 3 Bayesian | $P(C_k\mid E)$, $P(D\mid S)$, incomplete evidence |
| Master fusion | Algorithm 1, conflict table, output contract |
| Numeric trace | Chest-pain SMS ($T=4$, $d=0.94$, Orange); Twi voice path |

## Audience

- Thesis examiners and technical appendix
- Implementation reference (what each module needs and produces)

Not intended as motivational overview --- use the integration deck for clinical storytelling.
