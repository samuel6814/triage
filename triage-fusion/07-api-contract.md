# 07 — API contract

Proposed `POST /fuse` endpoint for multi-signal triage. **`POST /predict` remains unchanged** (NLP-only).

---

## Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/fuse` | Full fusion pipeline (ML service) |
| `POST` | `/api/triage/fuse` | Express proxy (Curatio server) |
| `POST` | `/predict` | Existing NLP-only (unchanged) |

---

## Request

### `POST /fuse`

**Query parameters** (same semantics as `/predict`):

| Param | Default | Description |
|-------|---------|-------------|
| `gate` | `true` | Run medical gate |
| `openmed` | `true` | Run OpenMed NER |
| `force_bayes` | `false` | Force tabular Bayes even if not triggered |

**Body (JSON):**

```json
{
  "text": "crushing central chest pain, sweaty, cannot catch breath",
  "vitals": {
    "heart_rate_bpm": 125,
    "respiratory_rate": 26,
    "temperature_c": null,
    "mobility": null,
    "avpu": null,
    "trauma": false
  }
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `text` | string | yes | 1–2000 chars, chief complaint |
| `vitals` | object | no | All sub-fields optional; omit entire object for text-only fusion |

**Vitals sub-fields:**

| Field | Type | Example |
|-------|------|---------|
| `heart_rate_bpm` | int | 125 |
| `respiratory_rate` | int | 26 |
| `temperature_c` | float | 37.2 |
| `mobility` | string | `normal`, `assisted`, `immobile` |
| `avpu` | string | `alert`, `verbal`, `pain`, `unresponsive` |
| `trauma` | boolean | false |

---

## Response (success — fused)

HTTP 200:

```json
{
  "text": "crushing central chest pain, sweaty, cannot catch breath",
  "is_medical_complaint": true,

  "predicted_acuity_level": 2,
  "confidence": 0.94,
  "probabilities": [
    {"level": 2, "class_index": 1, "probability": 0.94}
  ],

  "layers": {
    "c_nlp": "Orange",
    "c_tews": "Yellow",
    "c_disc": "Orange",
    "c_bayes": "Orange"
  },

  "fused_colour": "Orange",
  "sats_colour": "Orange",

  "tews": {
    "tews_total": 4,
    "c_tews": "Yellow",
    "tews_incomplete": true,
    "breakdown": [
      {"vital": "heart_rate_bpm", "value": 125, "points": 2},
      {"vital": "respiratory_rate", "value": 26, "points": 2}
    ]
  },

  "discriminators": {
    "c_disc": "Orange",
    "active": [
      {
        "id": "central_chest_pain",
        "label": "Central chest pain",
        "colour_floor": "Orange",
        "confidence": 0.94,
        "sources": ["keyword:crushing chest", "entity:chest pain"]
      }
    ]
  },

  "bayes": {
    "bayes_invoked": true,
    "scenario_key": "chest_pain_partial_vitals",
    "c_bayes": "Orange",
    "posteriors": {
      "Red": 0.08,
      "Orange": 0.89,
      "Yellow": 0.02,
      "Green": 0.01
    }
  },

  "fusion": {
    "rule": "max_urgency",
    "winning_layers": ["c_nlp", "c_disc", "c_bayes"],
    "fused_colour": "Orange"
  },

  "pathway": {
    "colour": "Orange",
    "t_max_minutes": 10,
    "t_max_label": "Within 10 minutes",
    "destination": "Acute / high-dependency bed",
    "meaning": "Very urgent — high dependency",
    "actions": [
      "Allocate bed",
      "Start 10-minute countdown",
      "Continuous monitoring"
    ],
    "escalation": "Escalate to head nurse if unclaimed within T_max",
    "detail": "Orange protocol: majors/emergency area; seen within 10 minutes."
  },

  "flags": {
    "tews_incomplete": true,
    "low_nlp_confidence": false,
    "layer_conflict": true,
    "bayes_invoked": true
  },

  "entities": {},
  "clinical_relevance_score": 0.92,
  "gate_signals": [],
  "bayesian_candidate": false,
  "calibration_warning": false
}
```

**Field notes:**

- `sats_colour` equals `fused_colour` on `/fuse` (keeps client compatibility)
- `predicted_acuity_level` remains NLP acuity for audit; pathway uses fused colour
- `bayesian_candidate` legacy flag: true if Bayes would be suggested but not yet run on `/predict`; on `/fuse`, use `flags.bayes_invoked`

---

## Response (gate rejection)

HTTP 200 with rejection payload (same shape as `/predict` rejection):

```json
{
  "text": "I want to play football tomorrow",
  "is_medical_complaint": false,
  "rejection_category": "non_clinical_topic",
  "message": "...",
  "suggested_action": "enter_chief_complaint"
}
```

No `fused_colour` or `pathway` when gate rejects.

---

## Response (text-only fusion — Phase 1)

Before Phase 2 discriminators/Bayes, minimal `/fuse` with no vitals:

```json
{
  "text": "severe headache for two days",
  "is_medical_complaint": true,
  "layers": {
    "c_nlp": "Yellow",
    "c_tews": null,
    "c_disc": null,
    "c_bayes": null
  },
  "fused_colour": "Yellow",
  "sats_colour": "Yellow",
  "tews": null,
  "pathway": { "colour": "Yellow", "t_max_minutes": 60 },
  "flags": {
    "tews_incomplete": true,
    "low_nlp_confidence": false,
    "layer_conflict": false,
    "bayes_invoked": false
  }
}
```

When only \(C_{\mathrm{NLP}}\) is available, fusion returns NLP colour.

---

## Error responses

| Status | Condition |
|--------|-----------|
| 400 | Empty text, invalid vitals range |
| 503 | Model weights missing, OpenMed unavailable when required |
| 500 | Unexpected server error |

```json
{
  "detail": "heart_rate_bpm must be between 1 and 300"
}
```

---

## Express proxy — `triage.js`

Add route mirroring `/predict`:

```javascript
router.post('/fuse', async (req, res) => {
  const { text, vitals } = req.body;
  // validate text
  const url = new URL(`${ML_SERVICE_URL}/fuse`);
  // gate / openmed query params same as predict
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: text.trim(), vitals: vitals ?? null }),
  });
  // ...
});
```

Register in server app router (same mount as `/api/triage`).

---

## FastAPI — `app.py` sketch

```python
class VitalsInput(BaseModel):
    heart_rate_bpm: int | None = None
    respiratory_rate: int | None = None
    temperature_c: float | None = None
    mobility: str | None = None
    avpu: str | None = None
    trauma: bool | None = None

class FuseRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=2000)
    vitals: VitalsInput | None = None

@app.post("/fuse")
def fuse_endpoint(body: FuseRequest, gate: bool = True, openmed: bool = True, force_bayes: bool = False):
    from fuse import run_fusion
    return run_fusion(body.text, body.vitals, gate=gate, openmed=openmed, force_bayes=force_bayes)
```

---

## Backward compatibility

| Client | Migration |
|--------|-----------|
| Uses `/predict` only | No change |
| Wants pathways + vitals | Switch to `/fuse` |
| Reads `sats_colour` | Still present on `/fuse` (= fused) |

---

## OpenAPI

When implementing, add `/fuse` to FastAPI schema and document in [`curatio/server/ml/README.md`](../curatio/server/ml/README.md).
