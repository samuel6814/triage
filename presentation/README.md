# Friday presentation

Beamer deck for the Friday mathematics summary: **Hospital Chatbot for Color-Coded Clinical Pathways**.

**Authors:** Quaigraine Samuel, Twum Samuel

## Files

| File | Description |
|------|-------------|
| `presentation_friday.tex` | Source (~21 frames) |
| `presentation_friday.pdf` | Compiled output |

## Compile

```bash
cd presentation
pdflatex presentation_friday.tex
pdflatex presentation_friday.tex
```

Verify frame count:

```bash
grep -c '\\begin{frame}' presentation_friday.tex
pdfinfo presentation_friday.pdf | grep Pages
```

## Slide list

| # | Title |
|---|--------|
| 1 | Title |
| 2 | Contents |
| 3 | From chat and vitals to one triage colour |
| 4 | How three mathematical layers produce one triage colour |
| 5 | Why the pipeline flows this way |
| 6 | What fusion does: combining language, vitals, and probability safely |
| 7 | How fusion works: the mathematics |
| 8 | Fusion inputs and outputs |
| 9 | How patients report symptoms in the chatbot |
| 10 | Why medical English is required for BioBERT |
| 11 | Turning words into vectors the model can compare |
| 12 | Letting each word attend to the rest of the sentence |
| 13 | Detecting SATS danger patterns in the text |
| 14 | Scoring vital signs with the TEWS sum |
| 15 | Mapping the TEWS total to a colour band |
| 16 | Estimating colour probability when evidence is partial |
| 17 | Building evidence from symptoms and measured vitals |
| 18 | Applying the fusion algorithm in priority order |
| 19 | Resolving conflicts so patients are not under-triaged |
| 20 | Data and software required to run the system |
| 21 | References |

## Related decks

- Full mathematics spec: `biobert/mathematics/biobert-mathematics.pdf`
- System integration narrative: `biobert/integration/hybrid-triage-system.pdf`
