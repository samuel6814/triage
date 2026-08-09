from contextlib import asynccontextmanager
from typing import Literal

from fastapi import FastAPI, File, Form, HTTPException, Query, UploadFile
from pydantic import BaseModel, Field

from openmed_enrich import analyze_entities, deidentify_text, health_info as openmed_health
from predict import health_info, load_model, predict
from voice_pipeline import process_voice_intake, voice_health


@asynccontextmanager
async def lifespan(app: FastAPI):
    load_model()
    yield


app = FastAPI(title="Curatio BioBERT Triage", lifespan=lifespan)


class PredictRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=2000)


class DeidentifyRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=8000)
    method: Literal["mask", "replace", "hash", "shift_dates"] = "mask"


@app.get("/health")
def health():
    info = health_info()
    if not info["weights_found"]:
        raise HTTPException(status_code=503, detail="Model weights not found")
    return {"status": "ok", **info, **openmed_health(), **voice_health()}


@app.post("/predict")
def predict_endpoint(
    body: PredictRequest,
    openmed: bool = Query(True, description="Run OpenMed NER and optional entity prefix"),
    gate: bool = Query(True, description="Reject non-medical input before BioBERT"),
    enrich: bool = Query(False, description="Deprecated; use openmed=true"),
):
    try:
        use_openmed = openmed or enrich
        result = predict(body.text, openmed=use_openmed, gate=gate)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
    except FileNotFoundError as e:
        raise HTTPException(status_code=503, detail=str(e)) from e
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e)) from e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@app.post("/deidentify")
def deidentify_endpoint(body: DeidentifyRequest):
    try:
        return deidentify_text(body.text, method=body.method)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e)) from e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@app.post("/analyze")
def analyze_endpoint(body: PredictRequest):
    """Clinical entity extraction via OpenMed (requires OPENMED_ENABLED=true)."""
    try:
        return analyze_entities(body.text)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e)) from e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@app.get("/voice/health")
def voice_health_endpoint():
    return {"status": "ok", **voice_health()}


@app.post("/voice/intake")
async def voice_intake_endpoint(
    audio: UploadFile = File(...),
    language: str = Form("tw"),
):
    try:
        data = await audio.read()
        return process_voice_intake(data, audio.filename or "audio.webm", language_hint=language)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e
