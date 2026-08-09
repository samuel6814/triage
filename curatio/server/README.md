# Curatio Server — BioBERT Triage API

Express gateway + Python FastAPI service for fine-tuned BioBERT text inference.

## Model terminology

| Term | Meaning |
|------|---------|
| **Baseline** | Original BioBERT fine-tune (`triage_new.ipynb`) — **default for inference** |
| **SMOTE** | Retrained checkpoint with imbalance mitigation — optional `MODEL_PATH` override |
| **Default** | What loads when `MODEL_PATH` / `MODEL_ID` are unset — equals **baseline** |

## Prerequisites

- Node.js 18+
- Python 3.10+
- Baseline model at `../../fine-tuned-biobert/fine_tuned_biobert_triage-20260602T132911Z-3-001/fine_tuned_biobert_triage/`

## Setup

```bash
# 1. Node dependencies
cd curatio/server
npm install

# 2. Python virtual environment + dependencies
python3 -m venv .venv
.venv/bin/pip install -r ml/requirements.txt

# 3. Optional: copy env file
cp .env.example .env
```

## Run

From `curatio/server`:

```bash
npm run dev
```

This starts:

- **Express API** on `http://localhost:5000`
- **Python ML service** on `http://127.0.0.1:8001`

First model load takes ~10–30 seconds on CPU. OpenMed NER adds load time on first predict when enabled.

### Troubleshooting

If `npm run dev` shows `[Errno 98] Address already in use` for the ML service, a stale process is holding port 8001 or 5000. The `predev` script frees those ports automatically; if it still fails:

```bash
lsof -i :8001
kill <PID>
lsof -i :5000
kill <PID>
```

Then run `npm run dev` again. Both `[api]` and `[ml]` should stay running.

## Frontend test page

In a second terminal:

```bash
cd curatio/client
npm run dev
```

Open `http://localhost:5173/test` or click **Test Model** on the home page.

## API

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Express health |
| GET | `/api/triage/health` | ML model status |
| POST | `/api/triage/predict` | Chief complaint → acuity (gate + OpenMed on by default; `?gate=false` / `?openmed=false`) |
| POST | `/api/triage/analyze` | OpenMed entity extraction only |
| POST | `/api/triage/deidentify` | Body: `{ "text": "...", "method": "mask" }` |
| POST | `/api/voice/intake` | Multipart `audio` + `language=tw` → Twi transcript + English translation |

### Voice intake response

```json
{
  "transcript_original": "me ho yɛ",
  "transcript_english": "I am sick",
  "detected_language": "tw",
  "translation_applied": true,
  "duration_ms": 3200
}
```

**Local dev:** install `ffmpeg` (`sudo apt install ffmpeg`) for Whisper audio decoding.

### Example response (medical)

```json
{
  "text": "thunderclap headache, worsening with movement",
  "is_medical_complaint": true,
  "predicted_acuity_level": 2,
  "confidence": 0.94,
  "probabilities": [{ "level": 2, "class_index": 1, "probability": 0.94 }],
  "sats_colour": "Orange",
  "bayesian_candidate": false,
  "entities": { "diseases": [], "drugs": [] }
}
```

### Example response (non-medical)

```json
{
  "text": "kofi is going to play football",
  "is_medical_complaint": false,
  "rejection_reason": "not_a_medical_complaint",
  "rejection_category": "non_clinical_topic",
  "clinical_relevance_score": 0.0,
  "message": "You wrote: \"kofi is going to play football\" — that sounds like everyday life, not an illness...",
  "guidance": "If you have a health problem, describe what the patient is feeling...",
  "suggested_action": "enter_chief_complaint"
}
```

## Environment variables

See `.env.example`:

- `MODEL_PATH` — local model folder; default **baseline** checkpoint
- `MODEL_ID` — Hugging Face Hub repo id for production (upload baseline weights)
- `OPENMED_ENABLED` — allow OpenMed when requested via `?openmed=true` or `/analyze` (lazy-loaded; default predict stays fast)
- `OPENMED_ENTITY_PREFIX` — prepend `[DISEASE: ...]` tags before BioBERT (default `true`)
- `CLINICAL_RELEVANCE_THRESHOLD` — minimum score (0–1) for text to reach BioBERT (default `0.35`)
- `VOICE_MAX_BYTES` — max upload size for voice intake (default 10MB)
- `WHISPER_MODEL_SIZE` — faster-whisper model (`small` default; use `tiny` on low RAM)
- `VOICE_TRANSLATION_ENABLED` — Twi→English via deep-translator (default `true`)
- `ML_SERVICE_URL` — Python service URL for Express proxy
- `PORT` — Express port (default 5000)
- `CONFIDENCE_THRESHOLD` — Bayesian fallback threshold (default 0.85)
