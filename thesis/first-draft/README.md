# Thesis — first draft

**Title:** Hospital Chatbot for Color-Coded Clinical Pathways

Copied from `MYKNUST THESIS TEMPLATE/` and rewritten for this FYP.

## Compile

```bash
cd thesis/first-draft
pdflatex My_thesis_template.tex
bibtex My_thesis_template
pdflatex My_thesis_template.tex
pdflatex My_thesis_template.tex
```

Requires a LaTeX install with the packages in `mystyle.sty`.

## Architecture claim (do not drift)

NLP (BioBERT) → acuity → \(f_{\mathrm{SATS}}\) colour → pathway protocols \(P(C)\).  
**No Bayesian fusion** in this draft’s methodology.

## Related folders

- `../../project-framing/` — RQs, pathways, maths scope
- `../../research-findings/` — reading list and notes
- `../../systematic-review-prisma/` — PRISMA templates
- `../../results/` — evaluation numbers cited in Ch.4
