# Curatio Server — BioBERT Triage API

Express gateway + Python FastAPI service for fine-tuned BioBERT text inference.

## Prerequisites

- Node.js 18+
- Python 3.10+
- Fine-tuned model at `../../fine-tuned-biobert/fine_tuned_biobert_triage-20260602T132911Z-3-001/fine_tuned_biobert_triage/` (includes `model.safetensors`)

## Setup

```bash
# 1. Node dependencies
cd curatio/server
npm install

# 2. Python virtual environment + dependencies
python3 -m venv .venv
.venv/bin/pip install -r ml/requirements.txt

# 3. Optional: copy env file
cd ..
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

First model load takes ~10–30 seconds on CPU.

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
| POST | `/api/triage/predict` | Body: `{ "text": "chief complaint..." }` |

### Example response

```json
{
  "text": "thunderclap headache, worsening with movement",
  "predicted_acuity_level": 2,
  "confidence": 0.94,
  "probabilities": [
    { "level": 2, "class_index": 1, "probability": 0.94 }
  ],
  "sats_colour": "Orange",
  "bayesian_candidate": false
}
```

## Environment variables

See `.env.example`:

- `MODEL_PATH` — path to model folder (relative to `ml/` or absolute)
- `ML_SERVICE_URL` — Python service URL for Express proxy
- `PORT` — Express port (default 5000)
- `CONFIDENCE_THRESHOLD` — Bayesian fallback threshold (default 0.85)
