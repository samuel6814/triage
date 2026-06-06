# Curatio — Deployment Guide (managed / low-cost path)

Curatio has three tiers that are deployed independently:

```
Browser ──▶ Client (Vercel, static SPA)
                │  fetch  ${VITE_API_URL}/api/triage/predict
                ▼
            API (Render, Node/Express)
                │  ML_SERVICE_URL/predict
                ▼
            ML service (Hugging Face Space, FastAPI + BioBERT)
                │  loads weights from
                ▼
            Model repo (Hugging Face Hub)
```

Deploy in this order: **(0) model → (1) ML Space → (2) Express API → (3) client**.
Each step needs the URL/id produced by the previous one.

> **Heads-up — cold starts.** Render's free tier sleeps after ~15 min idle and
> HF Spaces free tier sleeps after ~48 h idle. The first request after sleep can
> take 30–60 s. For a live demo, hit `/health` a few minutes beforehand to warm
> both services, or upgrade to a paid always-on tier.

---

## 0. Publish the fine-tuned model to the Hugging Face Hub

The weights (`model.safetensors`, ~414 MB) should live on the Hub so the ML
service can pull them at startup instead of bundling them in the image.

```bash
pip install -U "huggingface_hub[cli]"
huggingface-cli login            # paste a WRITE token from hf.co/settings/tokens

# Create a model repo (private is fine) and upload the trained model folder.
huggingface-cli repo create curatio-biobert-triage --type model
huggingface-cli upload <your-username>/curatio-biobert-triage \
  "fine-tuned-biobert/fine_tuned_biobert_triage-20260602T132911Z-3-001/fine_tuned_biobert_triage" \
  --repo-type model
```

Record the repo id, e.g. `your-username/curatio-biobert-triage`. This becomes
the `MODEL_ID` value below. If the repo is **private**, you must also set an
`HF_TOKEN` (read token) as a secret on the Space so it can download.

---

## 1. ML service → Hugging Face Space (Docker SDK)

The Space runs the FastAPI app from `curatio/server/ml/` (free CPU tier has
16 GB RAM — plenty for BioBERT).

1. Create a new Space: https://huggingface.co/new-space → **SDK: Docker** → Blank.
2. Push the contents of `curatio/server/ml/` to the Space repo:

```bash
git clone https://huggingface.co/spaces/<your-username>/curatio-ml
cp curatio/server/ml/{Dockerfile,app.py,predict.py,requirements.txt,README.md,.dockerignore} curatio-ml/
cd curatio-ml && git add . && git commit -m "Curatio ML service" && git push
```

3. In the Space → **Settings → Variables and secrets**, add:
   - `MODEL_ID` = `your-username/curatio-biobert-triage`
   - `CONFIDENCE_THRESHOLD` = `0.85`
   - `HF_TOKEN` = *(read token, only if the model repo is private)*
4. Wait for the build, then verify:

```bash
curl https://<your-username>-curatio-ml.hf.space/health
```

Record the Space base URL — this is `ML_SERVICE_URL` for the API.

---

## 2. Express API → Render (Web Service)

1. Push this repo to GitHub (already done) and connect it on https://render.com.
2. **New → Web Service** → pick the repo, then:
   - **Root Directory:** `curatio/server`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance type:** Free (or Starter for always-on)
3. **Environment variables:**
   - `ML_SERVICE_URL` = the HF Space URL from step 1 (no trailing slash)
   - `CLIENT_URL` = your Vercel client URL from step 3 (set after step 3, then redeploy)
   - `CONFIDENCE_THRESHOLD` = `0.85`
   - *(do not set `PORT` — Render injects it)*
4. Verify after deploy:

```bash
curl https://<your-api>.onrender.com/api/health
curl https://<your-api>.onrender.com/api/triage/health
```

Record the API base URL — this is `VITE_API_URL` for the client.

---

## 3. Client → Vercel (static SPA)

1. https://vercel.com → **Add New → Project** → import the repo.
2. Configure:
   - **Root Directory:** `curatio/client`
   - **Framework Preset:** Vite (auto-detected; `vercel.json` is included)
   - **Build Command:** `npm run build` · **Output:** `dist`
3. **Environment variable:**
   - `VITE_API_URL` = the Render API base URL from step 2 (e.g. `https://curatio-api.onrender.com`)
4. Deploy. Then copy the Vercel URL and go back to **Render → set `CLIENT_URL`**
   to that URL and redeploy the API (so CORS accepts the browser origin).

---

## 4. Verify end to end

1. Open the Vercel URL → navigate to the **Test BioBERT Triage** page.
2. Submit a chief complaint (e.g. *"central crushing chest pain"*).
3. Request flow: Browser → Render API → HF Space → model → response with acuity +
   SATS colour. First call may be slow if a service was asleep.

## Environment variable reference

| Service | Variable | Example | Notes |
|---------|----------|---------|-------|
| HF Space | `MODEL_ID` | `user/curatio-biobert-triage` | Weights pulled from the Hub |
| HF Space | `HF_TOKEN` | `hf_...` | Only if the model repo is private |
| HF Space | `CONFIDENCE_THRESHOLD` | `0.85` | |
| Render | `ML_SERVICE_URL` | `https://user-curatio-ml.hf.space` | No trailing slash |
| Render | `CLIENT_URL` | `https://curatio.vercel.app` | Comma-separate multiple origins |
| Render | `CONFIDENCE_THRESHOLD` | `0.85` | |
| Vercel | `VITE_API_URL` | `https://curatio-api.onrender.com` | Baked in at build time |

## Local development (unchanged)

```bash
# Terminal 1 — API + ML together
cd curatio/server && npm install && npm run dev

# Terminal 2 — client
cd curatio/client && npm install && npm run dev   # http://localhost:5173
```

Locally, `VITE_API_URL` is empty so requests stay relative and use the Vite
proxy to `localhost:5000`; the ML service uses local `MODEL_PATH`.
