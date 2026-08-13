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
Optional `POST /fuse` adds TEWS + max-urgency fusion + pathway (Phase 1).

## Endpoints

- `GET /health` — model variant, weights, OpenMed + voice status
- `POST /predict` — chief complaint → acuity + entities (medical gate on by default; non-medical rejection)
- `POST /fuse` — NLP + optional vitals (TEWS) → fused colour + pathway + layer audit
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
| `OPENMED_ENTITY_PREFIX` | Prepend `[DISEASE: ...]` before BioBERT (default **`false`** — baseline was not trained with prefixes) |
| `OPENMED_CONFIDENCE_THRESHOLD` | NER span confidence cutoff (default `0.5`) |
| `OPENMED_TIMEOUT_SECONDS` | Max seconds for NER before acuity continues with `entities_status=error` (default `45`) |
| `OPENMED_WARM_ON_STARTUP` | Prefetch NER pipelines in background on ML boot (default `true`) |
| `HF_TOKEN` | Optional Hugging Face token for authenticated / faster model downloads |
| `OPENMED_TORCH_ATTENTION_BACKEND` | Attention backend for OpenMed models (`eager` required for DeBERTa-v2 PII / de-identify) |
| `SUPPRESS_TEWS_GREEN_WHEN_INCOMPLETE` | Drop incomplete TEWS Green from fusion max (default `true`) |
| `DISCRIMINATOR_THRESHOLD` | Activates discriminator hits at/above this confidence (default `0.85`) |
| `BAYES_MI_THRESHOLD` | MI-style disease override threshold for Bayes (default `0.75`) |
| `CONFIDENCE_THRESHOLD` | Bayesian fallback flag threshold |

## Local development

```bash
cd curatio/server/ml
pip install -r requirements.txt
export OPENMED_ENABLED=true
export OPENMED_TORCH_ATTENTION_BACKEND=eager
uvicorn app:app --reload --port 8001
```

## Tests

```bash
cd curatio/server/ml
pytest tests/ -q
```
