---
title: Curatio ML
emoji: 🩺
colorFrom: red
colorTo: indigo
sdk: docker
app_port: 7860
pinned: false
---

# Curatio BioBERT Triage — ML service

FastAPI inference service for the fine-tuned BioBERT triage model.

This folder is also a deployable **Hugging Face Space** (Docker SDK). When pushed
to a Space repo, Hugging Face builds the `Dockerfile` and serves the app on
port `7860`.

## Endpoints

- `GET /health` — model/weights status
- `POST /predict` — body `{ "text": "chief complaint" }` → acuity + SATS colour

## Configuration

| Variable   | Purpose                                                                 |
|------------|-------------------------------------------------------------------------|
| `MODEL_ID` | Hugging Face Hub repo id of the fine-tuned model (used in production).   |
| `MODEL_PATH` | Local path to the model dir (used for local development only).        |
| `CONFIDENCE_THRESHOLD` | Below this, a case is flagged as a Bayesian fallback candidate. |

In the Space, set `MODEL_ID` (e.g. `your-username/curatio-biobert-triage`) as a
**Space variable/secret** so weights are pulled from the Hub on startup.

## Local development

```bash
cd curatio/server/ml
pip install -r requirements.txt
uvicorn app:app --reload --port 8001
```
