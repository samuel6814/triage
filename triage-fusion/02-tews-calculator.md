# 02 — TEWS calculator

Deterministic vital-sign scoring: \(T = f_{\mathrm{TEWS}}(\mathbf{v})\) and colour band \(C_{\mathrm{TEWS}}(T)\).

Sources: [`equations.js`](../curatio/client/src/components/presentation/equations.js), [`slides_saturday/sections/04-fusion-parallel.tex`](../slides_saturday/sections/04-fusion-parallel.tex), [`slides_saturday/sections/05-math-deep-dives.tex`](../slides_saturday/sections/05-math-deep-dives.tex).

---

## Definition

\[
T = f_{\mathrm{TEWS}}(\mathbf{v}) = \sum_{k=1}^{6} w_k \, f_k(v_k), \quad w_k = 1
\]

Six SATS parameters (implementation index \(k\)):

| \(k\) | Vital \(v_k\) | JSON field | Unit / scale |
|-------|---------------|------------|--------------|
| 1 | Heart rate (HR) | `heart_rate_bpm` | beats/min |
| 2 | Respiratory rate (RR) | `respiratory_rate` | breaths/min |
| 3 | Mobility | `mobility` | enum (see below) |
| 4 | Temperature | `temperature_c` | °C |
| 5 | AVPU (consciousness) | `avpu` | enum |
| 6 | Trauma | `trauma` | boolean |

Each \(f_k(v_k) \in \{0, 1, 2, 3\}\).

---

## Scoring functions

### \(f_1\) — Heart rate

(from `TEWS_HR` in equations.js)

| Condition | Points |
|-----------|--------|
| HR ≥ 130 | 3 |
| 111 ≤ HR ≤ 129 | 2 |
| 51 ≤ HR ≤ 100 | 0 |
| HR ≤ 40 | 2 |
| otherwise (borderline, e.g. 101–110 or 41–50) | 1 |

### \(f_2\) — Respiratory rate

(from `TEWS_RR` in equations.js)

| Condition | Points |
|-----------|--------|
| RR ≥ 30 | 3 |
| 21 ≤ RR ≤ 29 | 2 |
| 9 ≤ RR ≤ 14 | 0 |
| otherwise | 1 |

### \(f_3\) — Mobility

| Value | Points |
|-------|--------|
| `normal` / walking | 0 |
| `assisted` / with help | 1 |
| `immobile` / stretcher | 2–3 (use 3 if fully immobile per SATS manual) |

*Implement from SATS manual tables; default unmeasured → omit from sum.*

### \(f_4\) — Temperature

| Condition | Points |
|-----------|--------|
| 35.0–38.4 °C | 0 |
| 38.5–38.9 °C or 34.0–34.9 °C | 1 |
| ≥ 39.0 °C or ≤ 33.9 °C | 2–3 |

*Use SATS manual breakpoints in `tews.py`; document exact thresholds in code comments.*

### \(f_5\) — AVPU

| Value | Points |
|-------|--------|
| `alert` | 0 |
| `verbal` | 1 |
| `pain` | 2 |
| `unresponsive` | 3 |

### \(f_6\) — Trauma

| Value | Points |
|-----------|--------|
| `false` / none | 0 |
| `true` / major trauma | 2–3 |

---

## Colour from vitals alone

\[
C_{\mathrm{TEWS}}(T) = \begin{cases}
\text{Red} & T > 7 \\
\text{Orange} & 5 \leq T \leq 6 \\
\text{Yellow} & 3 \leq T \leq 4 \\
\text{Green} & T \leq 2
\end{cases}
\]

Ghana routing (from slides):

| \(T\) | \(C_{\mathrm{TEWS}}\) | Typical destination |
|-------|----------------------|---------------------|
| > 7 | Red | Resuscitation room |
| 5–6 | Orange | Majors ED |
| 3–4 | Yellow | Majors ED |
| ≤ 2 | Green | Minors / OPD |

---

## Partial TEWS (missing vitals)

\[
T_{\mathrm{partial}} = \sum_{k \in \mathcal{K}_{\mathrm{obs}}} w_k \, f_k(v_k), \quad
\mathcal{K}_{\mathrm{obs}} = \{k : v_k \text{ measured}\}
\]

Rules:

1. Sum **only** observed vitals.
2. Set `tews_incomplete = true` if \(|\mathcal{K}_{\mathrm{obs}}| < 6\).
3. Still compute \(C_{\mathrm{TEWS}}(T_{\mathrm{partial}})\) for audit, but fusion **must not** downgrade below NLP/discriminator/Bayes on incomplete data.
4. When incomplete, prefer invoking tabular Bayes (see [04-bayesian-fallback.md](04-bayesian-fallback.md)).

Example (from slides):

- HR = 125 → \(f_1 = 2\)
- RR = 26 → \(f_2 = 2\)
- Mobility, temp, AVPU, trauma unknown → omitted
- \(T = 4 \Rightarrow C_{\mathrm{TEWS}} = \text{Yellow}\)

---

## Worked example

| Vital | Value | \(f_k\) | Points |
|-------|-------|---------|--------|
| HR | 125 bpm | \(f_1(125)\) | 2 |
| RR | 26/min | \(f_2(26)\) | 2 |
| Mobility, temp, AVPU, trauma | normal / absent | 0 each | 0 |
| **Total \(T\)** | | | **4** |

\(\Rightarrow C_{\mathrm{TEWS}} = \text{Yellow}\)

If language + discriminators suggest Orange, fusion upgrades to Orange (see [05-fusion-engine.md](05-fusion-engine.md)).

---

## `tews.py` interface (proposed)

```python
def compute_tews(vitals: dict | None) -> dict:
    """
    vitals keys: heart_rate_bpm, respiratory_rate, mobility, temperature_c, avpu, trauma
    All optional. Returns:
      tews_total: int | None
      tews_breakdown: list[{vital, value, points}]
      c_tews: str | None          # Red|Orange|Yellow|Green
      tews_incomplete: bool
      vitals_observed: list[str]
    """
```

Validation:

- Reject out-of-range values (e.g. HR < 0 or > 300) with 400 error at API layer
- Empty vitals dict → `tews_total=None`, `c_tews=None`, `tews_incomplete=True`

---

## Environment / config

| Variable | Default | Purpose |
|----------|---------|---------|
| `TEWS_ALLOW_PARTIAL` | `true` | Enable partial sum |
| `TEWS_MOBILITY_SCORING` | `sats` | Scoring table version tag |

No ML weights; pure lookup tables loaded from a Python dict or JSON file co-located with `tews.py`.

---

## Testing notes

Unit tests should cover:

- Full vitals → known \(T\) from SATS examples
- HR=125, RR=26 only → \(T=4\), Yellow, incomplete=true
- \(T=8\) → Red
- All missing → no \(C_{\mathrm{TEWS}}\), incomplete=true

See [08-test-scenarios.md](08-test-scenarios.md) for integration cases.
