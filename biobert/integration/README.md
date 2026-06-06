# Hybrid triage system (Beamer)

End-to-end presentation: how **voice (Twi)**, **translation**, **BioBERT NLP**, **deterministic TEWS**, and **Bayesian fusion** work together in the Hospital Chatbot project.

## Files

| File | Purpose |
|------|---------|
| `hybrid-triage-system.tex` | LaTeX source (~30 slides) |
| `hybrid-triage-system.pdf` | Compiled deck |

## Compile

```bash
cd biobert/integration
pdflatex hybrid-triage-system.tex
pdflatex hybrid-triage-system.tex
```

## Content

1. Introduction — hybrid design goals  
2. Input channels — SMS, voice, pipeline overview  
3. Voice and translation — Google Speech/Translation, Twi caveat, API sequence  
4. Layer 1 — BioBERT NLP and discriminator output **D**  
5. Layer 2 — TEWS deterministic **T**  
6. Layer 3 — Bayesian **P(D|S)** and overrides  
7. Master fusion — priority rules and conflict resolution  
8. Scenarios — English SMS, Twi voice, TEWS vs NLP conflict  
9. Implementation outlook and references  

## Related decks

| Deck | Focus |
|------|--------|
| [`../mathematics/biobert-mathematics.pdf`](../mathematics/biobert-mathematics.pdf) | BioBERT internal mathematics |
| [`../slides/nlp-deep-dive.pdf`](../slides/nlp-deep-dive.pdf) | Original deep-dive NLP slides |
