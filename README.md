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

Fine-tuned BioBERT weights (`model.safetensors`, ~414 MB each) are **not stored in Git**. Place them locally under:

- `fine-tuned-biobert/fine_tuned_biobert_triage-20260602T132911Z-3-001/fine_tuned_biobert_triage/` (baseline)
- `fine-tuned-biobert/fine_tuned_biobert_triage_smote/` (SMOTE variant, optional)

For deployment, publish to the Hugging Face Hub — see [curatio/DEPLOYMENT.md](curatio/DEPLOYMENT.md).
