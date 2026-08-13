from contextlib import asynccontextmanager
from typing import Literal

from fastapi import FastAPI, File, Form, HTTPException, Query, UploadFile
from pydantic import BaseModel, Field

from fuse import fuse
from explain import explain_tokenization
from openmed_enrich import (
    analyze_entities,
    deidentify_text,
    health_info as openmed_health,
    start_background_warmup,
)
from predict import health_info, load_model, predict
from tews import TewsValidationError
from voice_pipeline import process_voice_intake, translate_twi_to_english, voice_health


@asynccontextmanager
async def lifespan(app: FastAPI):
    load_model()
    start_background_warmup()
    yield


app = FastAPI(title="Curatio BioBERT Triage", lifespan=lifespan)


class PredictRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=2000)


class VitalsBody(BaseModel):
    heart_rate_bpm: int | float | None = None
    respiratory_rate: int | float | None = None
    temperature_c: float | None = None
    mobility: str | None = None
    avpu: str | None = None
    trauma: bool | None = None


class FuseRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=2000)
    vitals: VitalsBody | None = None


class DeidentifyRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=8000)
    method: Literal["mask", "replace", "hash", "shift_dates"] = "mask"


class TranslateRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=2000)
    source_lang: Literal["tw", "en"] = "tw"


class ExplainRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=2000)



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


@app.post("/fuse")
def fuse_endpoint(
    body: FuseRequest,
    openmed: bool = Query(True, description="Run OpenMed NER and optional entity prefix"),
    gate: bool = Query(True, description="Reject non-medical input before BioBERT"),
    force_bayes: bool = Query(False, description="Force tabular Bayes even if not triggered"),
):
    """Phase 2 fusion: NLP + TEWS + discriminators + Bayes → pathway."""
    try:
        vitals = None
        if body.vitals is not None:
            vitals = {
                k: v
                for k, v in body.vitals.model_dump().items()
                if v is not None
            }
        return fuse(
            body.text,
            vitals,
            openmed=openmed,
            gate=gate,
            force_bayes=force_bayes,
        )
    except TewsValidationError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
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


@app.post("/translate")
def translate_endpoint(body: TranslateRequest):
    """Translate typed Twi (or pass-through English) for triage intake."""
    try:
        original = body.text.strip()
        if body.source_lang == "en":
            return {
                "original": original,
                "english": original,
                "translation_applied": False,
                "source_lang": "en",
            }
        english = translate_twi_to_english(original, source_lang="tw")
        return {
            "original": original,
            "english": english,
            "translation_applied": english.strip() != original,
            "source_lang": "tw",
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@app.post("/explain")
def explain_endpoint(body: ExplainRequest):
    """Return WordPiece tokens + pipeline stage blurbs for the test lab."""
    try:
        return explain_tokenization(body.text)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
    except FileNotFoundError as e:
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
