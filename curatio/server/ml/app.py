from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from predict import health_info, load_model, predict


@asynccontextmanager
async def lifespan(app: FastAPI):
    load_model()
    yield


app = FastAPI(title="Curatio BioBERT Triage", lifespan=lifespan)


class PredictRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=2000)


@app.get("/health")
def health():
    info = health_info()
    if not info["weights_found"]:
        raise HTTPException(status_code=503, detail="Model weights not found")
    return {"status": "ok", **info}


@app.post("/predict")
def predict_endpoint(body: PredictRequest):
    try:
        return predict(body.text)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
    except FileNotFoundError as e:
        raise HTTPException(status_code=503, detail=str(e)) from e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e
