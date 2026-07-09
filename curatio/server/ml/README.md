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

FastAPI inference: medical gate → OpenMed NER → baseline BioBERT acuity prediction.

## Endpoints

- `GET /health` — model variant, weights, OpenMed + voice status
- `POST /predict` — chief complaint → acuity + entities (or non-medical rejection)
- `POST /deidentify` — PII redaction (OpenMed)
- `POST /analyze` — entity extraction only
- `POST /voice/intake` — audio upload → Twi transcript + English translation
- `GET /voice/health` — Whisper model status

## Configuration

| Variable | Purpose |
|----------|---------|
| `MODEL_ID` | Hugging Face Hub repo id — **baseline** weights (production) |
| `MODEL_PATH` | Local model dir (development) |
| `OPENMED_ENABLED` | OpenMed on every predict (default `true`; `false` if OOM) |
| `OPENMED_ENTITY_PREFIX` | Prepend `[DISEASE: ...]` before BioBERT (default `true`) |
| `CONFIDENCE_THRESHOLD` | Bayesian fallback flag threshold |

## Local development

```bash
cd curatio/server/ml
pip install -r requirements.txt
export OPENMED_ENABLED=true
uvicorn app:app --reload --port 8001
```
