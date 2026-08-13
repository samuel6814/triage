# Roadmap

## Done

- [x] BioBERT fine-tune + Curatio demo (Part 1)
- [x] Medical gate, OpenMed, de-identify, voice intake
- [x] Holdout evaluation + results slides
- [x] Framing pack + findings folder + thesis scaffold
- [x] Phase 1–2 triage fusion (`/fuse`: TEWS, discriminators, tabular Bayes, pathways)
- [x] OpenMed NER timeout so `/predict` cannot hang on HF downloads
- [x] Thesis + project-framing updated for fusion (RQ10–RQ11)

## Write next (thesis)

1. Flesh Ch.2 from Tier-1/Tier-2 reading notes in `research-findings/`
2. Fill PRISMA flow counts if you run a formal systematic search
3. Expand `myref.bib` from papers you actually cite
4. Rebuild thesis PDFs after LaTeX polish: `python scripts/publish_pdfs.py`

## Build next (optional polish)

1. Pathway timers / HIS escalation middleware
2. EMR-calibrated Bayes priors
3. Prospective clinician evaluation

## Do not schedule (unless justified)

- Full Bayesian network structure learning as a rewrite of Part 1
- Autonomous routing without nurse oversight given softmax overconfidence
