# Community Hospital — dataset schema

Synthetic case-study data for a fictional Ghanaian **Community Hospital** (LMIC ED setting).

## File

`community_hospital_patients.csv` — 1000 rows with **skewed ED-like** acuity mix (not balanced).

## Arrival mix

| Level | Colour | Share | Count |
|-------|--------|-------|-------|
| 1 | Red | 5% | 50 |
| 2 | Orange | 15% | 150 |
| 3 | Yellow | 30% | 300 |
| 4 | Green (non-urgent) | 25% | 250 |
| 5 | Green (routine) | 25% | 250 |

## Columns

| Column | Type | Description |
|--------|------|-------------|
| `patient_id` | string | `CH-0001` … |
| `sex` | string | `Male` or `Female` |
| `age` | int | 4–78 years |
| `chief_complaint` | string | Ghanaian patient-voice free text |
| `acuity_level` | int | Ground truth 1–5 |
| `sats_colour` | string | Red / Orange / Yellow / Green |
| `pathway_destination` | string | Clinical destination |
| `t_max_minutes` | int | 0 / 10 / 60 / 240 |
| `visit_type` | string | `emergency` / `routine` / `follow_up` |
| `location_mention` | string | Ghana place name |
| `ambiguity_flag` | bool | Borderline wording (~7% of rows) |
| `predicted_acuity` | int or empty | BioBERT or simulated output |
| `predicted_colour` | string or empty | Mapped SATS colour |
| `pathway_correct` | bool or empty | `predicted_colour == sats_colour` |

## Regeneration

```bash
python3 community-hospital/scripts/generate_synthetic_data.py
python3 community-hospital/scripts/run_chatbot_eval.py
```

Seed: `42`.
