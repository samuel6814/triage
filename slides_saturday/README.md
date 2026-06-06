# Curatio Saturday Beamer Slides

Detailed Beamer presentation mirroring the **Curatio web presentation** (`curatio/client`).

## Contents

| Section | Topics |
|---------|--------|
| Clinical Foundations | SATS colours, KATH routing |
| Patient Input Pipeline | Steps 1–3: text, voice, ASR/translation |
| BioBERT NLP Layer | Inference, training, data exploration |
| Fusion and Parallel Paths | Steps 4–5, TEWS, Bayesian fallback |
| Mathematics Deep Dives | TEWS piecewise, Bayesian, fusion Algorithm 1 |
| End-to-End Worked Example | Chest pain → Orange at KATH |
| Clinical Protocols and Demo | Resus (Red), web app features |

## Compile

```bash
cd slides_saturday
pdflatex main.tex
pdflatex main.tex   # second pass for TOC and frame numbers
```

Requires a standard TeX Live installation with `beamer`, `amsmath`, `booktabs`, `tikz`.

Output: `main.pdf`

## File structure

```
slides_saturday/
├── main.tex              # Master document
├── preamble.tex          # Theme, colours, TikZ styles
├── sections/
│   ├── 01-clinical.tex
│   ├── 02-pipeline-input.tex
│   ├── 03-biobert.tex
│   ├── 04-fusion-parallel.tex
│   ├── 05-math-deep-dives.tex
│   ├── 06-worked-example.tex
│   └── 07-protocols-demo.tex
└── README.md
```

## Source alignment

Content is derived from:
- `curatio/client/src/pages/dashboard-presentation/slides/`
- `curatio/client/src/components/presentation/equations.js`
- `curatio/client/src/components/presentation/mathExamples.jsx`
- `curatio/client/src/data/biobertStats.js`

Formula + worked example pairs in Beamer mirror the web app's **flip cards**.
