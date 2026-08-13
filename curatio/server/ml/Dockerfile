# Curatio BioBERT triage ML service — deployable to Hugging Face Spaces (Docker SDK).
FROM python:3.11-slim

# Hugging Face Spaces routes traffic to this port by default.
ENV PORT=7860 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    HF_HOME=/app/.cache/huggingface \
    TRANSFORMERS_CACHE=/app/.cache/huggingface \
    OPENMED_TORCH_ATTENTION_BACKEND=eager

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends ffmpeg \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt ./
RUN pip install --upgrade pip && pip install -r requirements.txt

COPY predict.py app.py openmed_enrich.py medical_gate.py voice_pipeline.py ./

# Writable cache for model weights pulled from the Hub at startup.
RUN mkdir -p /app/.cache/huggingface && chmod -R 777 /app/.cache

EXPOSE 7860

CMD ["sh", "-c", "uvicorn app:app --host 0.0.0.0 --port ${PORT}"]
