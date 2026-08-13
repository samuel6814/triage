# Thesis outline (KNUST template → `thesis/first-draft/`)

Title: **Hospital Chatbot for Color-Coded Clinical Pathways**

Template base: `MYKNUST THESIS TEMPLATE/` → `thesis/first-draft/`.

| Chapter | File | Content |
|---------|------|---------|
| Front matter | `titlepage`, `declaration`, `dedication`, `abstract`, `acknowledgment`, `abbreviation` | Project title; NLP→fusion→pathway abstract; SATS/BioBERT/LMIC abbreviations |
| **Ch.1 Introduction** | `chapter1.tex` | Background; acuity discontinuity; problem; objectives; **RQ1–RQ11**; scope (tabular fusion in; full BN out) |
| **Ch.2 Literature** | `chapter2.tex` | ED overcrowding / Green Tag; SATS & KATH; TEWS as parallel layer; tabular Bayes vs full BN; triage NLP |
| **Ch.3 Methodology** | `chapter3.tex` | Gate; OpenMed; BioBERT; \(f_{\mathrm{SATS}}\); TEWS; discriminators; tabular Bayes; \(f_{\mathrm{fusion}}\); \(P(C)\); Curatio `/predict` + `/fuse` |
| **Ch.4 Results & Discussion** | `chapter4.tex` | Holdout metrics; fusion scenario table; safety when layers conflict; limitations |
| **Ch.5 Conclusion** | `chapter5.tex` | Answers to RQs; contributions; future work (EMR-calibrated priors, prospective study) |
| Back matter | `myref.bib`, `appendix.tex` | Citations; optional appendix |

Fusion scenario export: `triage-fusion/fusion-scenario-results.md`.

## Seed sources

- `latex/synopsis-article/syn-no-math.tex`
- `project-framing/*.md`
- `triage-fusion/`
- `results/eval_outputs/EVAL_RESULTS.md`
- `curatio/server/README.md`, `fine-tuned-biobert/`

## PRISMA

Blank templates in `systematic-review-prisma/` support Ch.2 systematic-review reporting discipline when screening literature.
