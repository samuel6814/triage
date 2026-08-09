# PDF outputs

Canonical compiled PDFs for the FYP writing packs:

| File | Source |
|------|--------|
| `01-thesis-first-draft.pdf` | `thesis/first-draft/` |
| `02-project-framing.pdf` | `project-framing/` |
| `03-research-findings.pdf` | `research-findings/` |

Rebuild:

```bash
# Thesis
cd thesis/first-draft && pdflatex -interaction=nonstopmode My_thesis_template.tex && bibtex My_thesis_template && pdflatex My_thesis_template.tex && pdflatex My_thesis_template.tex

# Framing + findings
cd ../../project-framing && pdflatex -interaction=nonstopmode project-framing.tex
cd ../research-findings && pdflatex -interaction=nonstopmode research-findings.tex

# Copy into this folder
cd .. && mkdir -p pdf-outputs
cp thesis/first-draft/My_thesis_template.pdf pdf-outputs/01-thesis-first-draft.pdf
cp project-framing/project-framing.pdf pdf-outputs/02-project-framing.pdf
cp research-findings/research-findings.pdf pdf-outputs/03-research-findings.pdf
```

Or: `python3 scripts/publish_pdfs.py`
