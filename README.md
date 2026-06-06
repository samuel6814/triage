# Hospital Chatbot for Color-Coded Clinical Pathways

Final Year Project — AI-assisted SATS triage using fine-tuned BioBERT, TEWS, and Bayesian fusion.

## Repository structure

| Path | Description |
|------|-------------|
| `curatio/client/` | React presentation app + `/test` BioBERT demo |
| `curatio/server/` | Express API + Python BioBERT inference service |
| `fine-tuned-biobert/` | Model weights, CSV datasets, training notebook |
| `slides_saturday/` | Beamer presentation (LaTeX) |
| `biobert/` | Mathematics and integration specs |
| `latex/` | Thesis / synopsis documents |

## Quick start

See [curatio/server/README.md](curatio/server/README.md) for running the BioBERT test API.

```bash
# Backend
cd curatio/server && npm install && npm run dev

# Frontend
cd curatio/client && npm install && npm run dev
```

Open `http://localhost:5173` — use **Test Model** or `/test` to run live predictions.

## Model weights

The fine-tuned BioBERT weights (`model.safetensors`, ~414 MB) are tracked with **Git LFS**. After cloning:

```bash
git lfs install
git lfs pull
```
