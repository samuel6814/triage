# 03 — Discriminators (D)

Rule-based and OpenMed-assisted detection of SATS clinical discriminators → vector **D** and minimum colour \(C_{\mathrm{disc}}\).

**Scope:** low–medium effort. No multi-label BioBERT retrain. Deterministic thresholds on keyword rules + entity hits.

Sources: SATS manual (see [`research-findings/00-reading-list.md`](../research-findings/00-reading-list.md)), [`papers/archive/info.txt`](../papers/archive/info.txt), presentation slides.

---

## Role in the pipeline

Discriminators capture what vitals miss: e.g. early MI with normal HR/RR still triggers **central chest pain** → Orange minimum.

\[
\mathbf{D} = f_{\mathrm{disc}}(X, \text{entities}) = \{(d_j, \text{confidence}_j)\}_{j \in \mathcal{J}}
\]

\[
C_{\mathrm{disc}} = \min_{\text{urgency}} \bigl\{ \text{colour}(j) : d_j \text{ active} \bigr\}
\]

where “min urgency” means **most urgent** (Red beats Orange beats Yellow).

BioBERT acuity \(C_{\mathrm{NLP}}\) is separate; discriminators are explicit SATS symptom overrides.

---

## Output shape

```json
{
  "discriminators": [
    {
      "id": "central_chest_pain",
      "label": "Central chest pain",
      "colour_floor": "Orange",
      "confidence": 0.94,
      "sources": ["keyword:crushing chest", "entity:chest pain"]
    }
  ],
  "c_disc": "Orange",
  "d_vector": {
    "central_chest_pain": 0.94,
    "altered_consciousness": 0.0,
    "uncontrolled_haemorrhage": 0.0
  }
}
```

---

## Detection methods (priority order)

1. **Keyword / regex rules** on lowercased \(X\) — fast, auditable
2. **OpenMed entity mapping** — map disease/symptom spans to discriminator IDs
3. *(Future)* BioBERT attention / separate head — **out of scope for Phase 2**

Confidence for rule hits:

- Single strong phrase match → 0.90
- Multiple corroborating phrases → min(0.98, 0.85 + 0.05 × hits)
- Entity-only match → 0.80
- Keyword + entity → max of both, capped at 0.98

Activation threshold: \(\tau_D = 0.85\) (match NLP confidence gate).

---

## Starter discriminator catalogue

Implement as YAML/JSON in `discriminators.py` or `discriminators_rules.json`.

### Red floor (\(C_{\mathrm{disc}} \geq \text{Red}\))

| ID | Colour floor | Example phrases / entities |
|----|--------------|---------------------------|
| `unresponsive` | Red | unresponsive, not waking, collapsed unconscious |
| `airway_obstruction` | Red | choking, cannot breathe at all, stridor |
| `uncontrolled_haemorrhage` | Red | bleeding heavily, blood won't stop |
| `seizure_active` | Red | seiz(ure|ing) now, convulsing |
| `anaphylaxis` | Red | throat closing, anaphylaxis, swelling tongue + wheeze |

### Orange floor

| ID | Colour floor | Example phrases / entities |
|----|--------------|---------------------------|
| `central_chest_pain` | Orange | crushing chest, central chest pain, tight chest + sweat |
| `stroke_symptoms` | Orange | face droop, slurred speech, sudden weakness one side |
| `severe_shortness_breath` | Orange | cannot catch breath, gasping, severe dyspnoea |
| `severe_pain` | Orange | worst pain ever, 10/10 pain |
| `haemodynamic_compromise` | Orange | dizzy + pale + sweaty + chest (compound rule) |

### Yellow floor (optional Phase 2)

| ID | Colour floor | Example phrases |
|----|--------------|-------------------|
| `moderate_pain` | Yellow | moderate pain, hurting for days |
| `persistent_vomiting` | Yellow | cannot keep fluids down |

Green discriminators are usually absence of escalation — no override needed.

---

## OpenMed entity mapping

Map OpenMed disease/symptom labels to discriminator IDs:

```python
ENTITY_TO_DISCRIMINATOR = {
    "chest pain": "central_chest_pain",
    "myocardial infarction": "central_chest_pain",
    "dyspnea": "severe_shortness_breath",
    "dyspnoea": "severe_shortness_breath",
    "hemorrhage": "uncontrolled_haemorrhage",
    "loss of consciousness": "unresponsive",
    # extend from OpenMed span inventory
}
```

Reuse entities already fetched in `predict()` / `fuse.py` — do not call OpenMed twice.

---

## Compound rules

Some discriminators require conjunctions:

```python
# haemodynamic_compromise: (chest_pain OR pallor) AND (sweat OR dizzy)
if has_any(X, ["sweaty", "clamy", "dizzy", "lightheaded"]):
    if entity_hit("chest pain") or has_any(X, ["pale", "grey"]):
        activate("haemodynamic_compromise", confidence=0.88)
```

Document each compound rule in the rules file for thesis auditability.

---

## \(C_{\mathrm{disc}}\) aggregation

```python
ORD = {"Green": 1, "Yellow": 2, "Orange": 3, "Red": 4}

def c_disc(active: list[DiscriminatorHit]) -> str | None:
    if not active:
        return None
    return max(active, key=lambda d: ORD[d.colour_floor]).colour_floor
```

If no discriminator exceeds \(\tau_D\), return `c_disc: null` (fusion ignores).

---

## Interaction with BioBERT

| Signal | Meaning |
|--------|---------|
| \(C_{\mathrm{NLP}} = \text{Yellow}\), \(C_{\mathrm{disc}} = \text{Orange}\) | Fusion → Orange (discriminator wins) |
| \(C_{\mathrm{NLP}} = \text{Orange}\), no \(C_{\mathrm{disc}}\) | Fusion uses NLP + TEWS + Bayes |
| Both Red | Red |

Do **not** train BioBERT to emit discriminators in Phase 2; keep concerns separated.

---

## `discriminators.py` interface (proposed)

```python
def evaluate_discriminators(
    text: str,
    entities: dict | None,
    *,
    threshold: float = 0.85,
) -> dict:
    ...
```

---

## Testing

- "crushing central chest pain, sweaty" → `central_chest_pain` active, \(C_{\mathrm{disc}} = \text{Orange}\)
- "I want to play football" → gate rejects before discriminators (gate test, not here)
- OpenMed entity "Chest Pain" alone → `central_chest_pain` at ≥ 0.80

See chest-pain scenario in [08-test-scenarios.md](08-test-scenarios.md).
