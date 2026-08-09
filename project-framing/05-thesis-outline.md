# Thesis outline (KNUST template → `thesis/first-draft/`)

Title: **Hospital Chatbot for Color-Coded Clinical Pathways**

Template base: `MYKNUST THESIS TEMPLATE/` → `thesis/first-draft/`.

| Chapter | File | Content |
|---------|------|---------|
| Front matter | `titlepage`, `declaration`, `dedication`, `abstract`, `acknowledgment`, `abbreviation` | Project title; authors; abstract of NLP→colour→pathway; SATS/BioBERT/LMIC abbreviations |
| **Ch.1 Introduction** | `chapter1.tex` | Background; acuity discontinuity; problem; objectives; **10 RQs**; scope (no Bayes); contribution; organisation |
| **Ch.2 Literature** | `chapter2.tex` | ED overcrowding / Green Tag; SATS & KATH; triage NLP & BioBERT; conversational triage; pathways vs colour labels; why Bayes deferred |
| **Ch.3 Methodology** | `chapter3.tex` | Data & fine-tuning; medical gate; OpenMed; BioBERT; \(f_{\mathrm{SATS}}\); pathway protocols \(P(C)\); evaluation protocol; system (Curatio) |
| **Ch.4 Results & Discussion** | `chapter4.tex` | Holdout metrics; confusion / Red recall; calibration; gate & OpenMed behaviour; pathway scenarios; limitations |
| **Ch.5 Conclusion** | `chapter5.tex` | Answers to RQs; contributions; future work (TEWS overlay, prospective study—not Bayes as core) |
| Back matter | `myref.bib`, `appendix.tex` | Citations; optional appendix (protocol tables, metrics tables) |

## Seed sources

- `latex/synopsis-article/syn-no-math.tex`
- `project-framing/*.md`
- `results/eval_outputs/EVAL_RESULTS.md`
- `papers/archive/info.txt` (NLP narrative; ignore Bayes-as-required framing)
- `curatio/server/README.md`, `fine-tuned-biobert/`

## PRISMA

Blank templates in `systematic-review-prisma/` support Ch.2 systematic-review reporting discipline when screening literature.
