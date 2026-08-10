# 08 — Test scenarios

Worked cases for manual and automated testing of `/fuse`. Expected values assume Phase 2 complete unless marked **Phase 1**.

Run against ML service: `POST http://127.0.0.1:8001/fuse`

---

## Scenario 1 — Chest pain + partial vitals (canonical)

**Input:**

```json
{
  "text": "crushing central chest pain, sweaty, cannot catch breath",
  "vitals": {
    "heart_rate_bpm": 125,
    "respiratory_rate": 26
  }
}
```

**Expected layers:**

| Layer | Expected | Reason |
|-------|----------|--------|
| \(C_{\mathrm{NLP}}\) | Orange | Level 2 acuity (~94% conf in slides) |
| \(T\) | 4 | \(f_1(125)=2 + f_2(26)=2\) |
| \(C_{\mathrm{TEWS}}\) | Yellow | \(3 \leq T \leq 4\) |
| \(C_{\mathrm{disc}}\) | Orange | `central_chest_pain` |
| \(C_{\mathrm{Bayes}}\) | Orange | \(P(\text{Orange}\mid E) \approx 0.89\) |

**Expected fusion:**

- `fused_colour`: **Orange**
- `flags.layer_conflict`: **true**
- `flags.tews_incomplete`: **true**
- `flags.bayes_invoked`: **true**

**Expected pathway:**

- `t_max_minutes`: 10
- `destination`: Acute / high-dependency bed

---

## Scenario 2 — Critical vitals, mild language

**Input:**

```json
{
  "text": "I feel a bit unwell, bit dizzy",
  "vitals": {
    "heart_rate_bpm": 135,
    "respiratory_rate": 32,
    "avpu": "verbal",
    "mobility": "immobile"
  }
}
```

**Expected:**

| Layer | Expected |
|-------|----------|
| \(C_{\mathrm{NLP}}\) | Green or Yellow (low-severity wording) |
| \(C_{\mathrm{TEWS}}\) | Red or Orange (high \(T\)) |
| **\(C\)** | **Red or Orange** (vitals win via max-urgency) |

**Flags:** `layer_conflict` likely true.

*Exact NLP level may vary with model; assert `ord(fused) >= ord(c_tews)`.*

---

## Scenario 3 — Missing vitals, high NLP confidence

**Input:**

```json
{
  "text": "severe abdominal pain, vomiting blood",
  "vitals": null
}
```

**Expected (Phase 2):**

| Layer | Expected |
|-------|----------|
| \(C_{\mathrm{NLP}}\) | Orange or Red |
| \(C_{\mathrm{TEWS}}\) | null |
| \(C_{\mathrm{Bayes}}\) | invoked (incomplete vitals) |
| **\(C\)** | matches max(NLP, Bayes, disc) |

**Flags:** `tews_incomplete: true`, `bayes_invoked: true`

**Phase 1:** `fused_colour` = \(C_{\mathrm{NLP}}\) only.

---

## Scenario 4 — Non-clinical gate rejection

**Input:**

```json
{
  "text": "I want to play football tomorrow",
  "vitals": null
}
```

**Expected:**

- `is_medical_complaint`: **false**
- `rejection_category`: `non_clinical_topic`
- No `fused_colour`, no `pathway`

---

## Scenario 5 — Green diversion (low acuity)

**Input:**

```json
{
  "text": "mild rash on arm for a week, no fever",
  "vitals": {
    "heart_rate_bpm": 78,
    "respiratory_rate": 16,
    "temperature_c": 36.8,
    "avpu": "alert",
    "mobility": "normal",
    "trauma": false
  }
}
```

**Expected:**

| Layer | Expected |
|-------|----------|
| \(C_{\mathrm{NLP}}\) | Green (level 4 or 5) |
| \(T\) | ≤ 2 |
| \(C_{\mathrm{TEWS}}\) | Green |
| **\(C\)** | **Green** |

**Pathway:** OPD / Minors / Polyclinic diversion copy.

---

## Scenario 6 — Low NLP confidence → Bayes fallback

**Input:**

```json
{
  "text": "something wrong, not sure how to explain",
  "vitals": {
    "heart_rate_bpm": 118,
    "respiratory_rate": 22
  }
}
```

**Expected:**

- `confidence` < 0.85 → `low_nlp_confidence: true`
- `bayes_invoked: true` with scenario `low_confidence_general`
- Fused colour not below TEWS if TEWS is Yellow+

*Mock or seed model if deterministic CI needed.*

---

## Scenario 7 — Red discriminator override

**Input:**

```json
{
  "text": "found him collapsed, not responding, not breathing normally",
  "vitals": {
    "heart_rate_bpm": 88,
    "respiratory_rate": 12
  }
}
```

**Expected:**

- `c_disc`: **Red** (`unresponsive` / airway patterns)
- \(T\) low → \(C_{\mathrm{TEWS}}\) Green or Yellow
- **\(C\)**: **Red**

---

## Scenario 8 — Text-only `/predict` unchanged

**Input:** `POST /predict` with same text as Scenario 1, no vitals.

**Expected:**

- `sats_colour` = \(C_{\mathrm{NLP}}\) only (Orange if model agrees)
- `bayesian_candidate`: false if confidence ≥ 0.85
- No `layers`, no `pathway`, no `tews`

Confirms backward compatibility.

---

## Automated test template (pytest)

```python
def test_chest_pain_fusion_orange(client):
    r = client.post("/fuse", json={
        "text": "crushing central chest pain, sweaty, cannot catch breath",
        "vitals": {"heart_rate_bpm": 125, "respiratory_rate": 26},
    })
    assert r.status_code == 200
    data = r.json()
    assert data["fused_colour"] == "Orange"
    assert data["layers"]["c_tews"] == "Yellow"
    assert data["flags"]["layer_conflict"] is True
    assert data["pathway"]["t_max_minutes"] == 10
```

Place tests in `curatio/server/ml/tests/test_fuse.py` when implementing.

---

## Thesis results table (Phase 3)

Document a subset for Chapter 4:

| Scenario | \(C_{\mathrm{NLP}}\) | \(C_{\mathrm{TEWS}}\) | \(C_{\mathrm{Bayes}}\) | **\(C\)** | Safer than NLP alone? |
|----------|---------------------|----------------------|----------------------|----------|------------------------|
| Chest pain + T=4 | Orange | Yellow | Orange | Orange | Yes (conflict resolved) |
| Critical vitals | Green | Red | — | Red | Yes |
| Green rash | Green | Green | skipped | Green | Same |

This supports revised RQ10 on fusion safety.
