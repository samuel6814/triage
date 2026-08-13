# Community Hospital — case study and presentation

Synthetic Ghanaian ED case study, analysis charts, transshipment OR model, and presentation slides (KNUST Beamer).

## Quick start (presentation)

| Deliverable | Path |
|-------------|------|
| **Slides PDF** | [`slides/main.pdf`](slides/main.pdf) |
| **Speaker guide PDF** | [`guide/presentation-guide.pdf`](guide/presentation-guide.pdf) |
| **Dataset** | [`data/community_hospital_patients.csv`](data/community_hospital_patients.csv) (N=1000, skewed mix) |
| **Results summary** | [`analysis/CASE_STUDY_RESULTS.md`](analysis/CASE_STUDY_RESULTS.md) |

**Title:** Hospital Chatbot for Color Coded Clinical Pathways

## Key metrics (current run)

| Metric | Value |
|--------|-------|
| Colour-routing accuracy | 97.5% (975/1000) |
| Level 1 recall | 94.0% (47/50) |
| Green diversion | 500 patients (50%) |
| Transshipment cost reduction | 62% (7150 → 2700) |
| Acute-zone load reduction | 44% (900 → 500) |

## Regenerate everything

```bash
python3 community-hospital/scripts/generate_synthetic_data.py
python3 community-hospital/scripts/run_chatbot_eval.py
community-hospital/.venv/bin/python community-hospital/scripts/transshipment_ed.py
community-hospital/.venv/bin/python community-hospital/scripts/analyze_case_study.py
cp community-hospital/analysis/figures/*.png community-hospital/slides/figures/
cd community-hospital/slides && pdflatex main.tex && pdflatex main.tex
cd ../guide && pdflatex presentation-guide.tex && pdflatex presentation-guide.tex
```

## Template

Slides use KNUST Beamer via [`Gabby.sty`](slides/Gabby.sty) (from `MyKnust Beamer Template/`). Logo line is commented out until `KNUSTlogo.png` is added.

## Folder map

```text
community-hospital/
  data/           CSV + schema (skewed 5/15/30/25/25% mix)
  scripts/        generate, eval, analyze, transshipment
  analysis/       CASE_STUDY_RESULTS.md, figures/, slide_metrics.json
  slides/         KNUST Beamer deck → main.pdf
  guide/          Speaker notes → presentation-guide.pdf
```
