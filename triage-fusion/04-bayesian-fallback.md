# 04 — Bayesian fallback (tabular)

Simplified posterior tables for \(P(C_k \mid E)\) when evidence is partial or layers conflict. **Not** a full Bayesian network (no pgmpy, no learned DAG).

Sources: [`equations.js`](../curatio/client/src/components/presentation/equations.js), [`slides_saturday/sections/04-fusion-parallel.tex`](../slides_saturday/sections/04-fusion-parallel.tex).

---

## When to invoke

Bayesian fallback runs when **any** of:

1. `tews_incomplete = true` (missing vitals)
2. `confidence < τ` (default τ = 0.85, matches `CONFIDENCE_THRESHOLD` in `predict.py`)
3. `layer_conflict` — \(\mathrm{ord}(C_{\mathrm{NLP}}) \neq \mathrm{ord}(C_{\mathrm{TEWS}})\) with both present
4. Explicit request flag `force_bayes=true` (debug / thesis demos)

If none apply, skip Bayes; set `c_bayes: null`, `bayes_invoked: false`.

---

## Evidence vector

\[
E = \bigl[\text{entity}_1, \ldots, \text{entity}_r,\, v_{k_1}, \ldots, v_{k_s}\bigr]
\]

Built from:

- OpenMed entity labels (normalized)
- Observed vitals (HR, RR, …)
- Optional scenario tags from discriminators (e.g. `central_chest_pain`)

Example:

```
E = [chest_pain, radiating_pain, HR=125, RR=26]
```

---

## Posterior (tabular)

\[
P(C_k \mid E) = \frac{P(E \mid C_k)\, P(C_k)}{\sum_{j} P(E \mid C_j)\, P(C_j)}
\]

\[
C_{\mathrm{Bayes}} = \arg\max_{k} P(C_k \mid E)
\]

**Implementation:** precomputed **prior** \(P(C_k)\) and **likelihood** \(P(E \mid C_k)\) per **scenario key**, not continuous density estimation.

---

## Scenario keys

Map \(E\) to a discrete scenario via rule matching:

| Scenario key | Trigger |
|--------------|---------|
| `chest_pain_partial_vitals` | chest pain entity/keyword + incomplete TEWS |
| `chest_pain_full_vitals` | chest pain + HR/RR present |
| `respiratory_distress` | dyspnoea entity + elevated RR |
| `low_confidence_general` | fallback when NLP confidence low, no specific scenario |
| `default_ed` | no strong match |

First matching scenario wins (ordered list in code).

---

## Chest pain table (canonical example)

From slides — **chest pain, partial vitals at KATH**:

| Colour \(C_k\) | Prior \(P(C_k)\) | Likelihood \(P(E \mid C_k)\) | Posterior \(P(C_k \mid E)\) |
|----------------|------------------|------------------------------|----------------------------|
| Red | 0.05 | Low (0.10) | ~0.08 |
| Orange | 0.15 | High (0.95) | **~0.89** |
| Yellow | 0.30 | Medium (0.15) | ~0.02 |
| Green | 0.50 | Very low (0.02) | ~0.01 |

Normalization:

\[
P(\text{Orange} \mid E) = \frac{0.15 \times 0.95}{0.05 \times 0.10 + 0.15 \times 0.95 + 0.30 \times 0.15 + 0.50 \times 0.02} \approx 0.89
\]

\(\Rightarrow C_{\mathrm{Bayes}} = \text{Orange}\)

Store tables in `bayes_tables.json`:

```json
{
  "chest_pain_partial_vitals": {
    "priors": {"Red": 0.05, "Orange": 0.15, "Yellow": 0.30, "Green": 0.50},
    "likelihoods": {"Red": 0.10, "Orange": 0.95, "Yellow": 0.15, "Green": 0.02}
  }
}
```

---

## Disease override (optional hard rule)

From slides:

\[
P(D \mid S) = \frac{P(S \mid D)\, P(D)}{P(S)}
\]

\[
\text{If } P(D \mid S) > \tau_B \text{ then } C_{\mathrm{Bayes}} = \text{Red (or Orange per protocol)}
\]

Example: crushing central chest pain + arm radiation → \(P(\mathrm{MI} \mid S) \approx 0.82 > \tau_B = 0.75\) → upgrade to Red/Orange even if \(T = 2\).

Implement as a **separate rule** before or after table lookup:

```python
if mi_score(S) > 0.75:
    return {"c_bayes": "Red", "override": "mi_protocol", ...}
```

Use sparingly; document \(\tau_B\) in config.

---

## Output shape

```json
{
  "bayes_invoked": true,
  "scenario_key": "chest_pain_partial_vitals",
  "evidence": ["chest_pain", "HR=125", "RR=26"],
  "priors": {"Red": 0.05, "Orange": 0.15, "Yellow": 0.30, "Green": 0.50},
  "likelihoods": {"Red": 0.10, "Orange": 0.95, "Yellow": 0.15, "Green": 0.02},
  "posteriors": {"Red": 0.08, "Orange": 0.89, "Yellow": 0.02, "Green": 0.01},
  "c_bayes": "Orange"
}
```

---

## `bayes_fallback.py` interface (proposed)

```python
def compute_bayes_fallback(
    *,
    text: str,
    entities: dict | None,
    vitals: dict | None,
    c_nlp: str,
    c_tews: str | None,
    confidence: float,
    tews_incomplete: bool,
    discriminators: dict | None,
    force: bool = False,
) -> dict:
    ...
```

Returns `bayes_invoked`, `c_bayes`, posteriors, scenario_key.

---

## What we are not building

- Full BN structure learning
- pgmpy / PyMC inference
- Hospital-wide epidemiological calibration (use literature/plausible priors; note in thesis as limitation)
- Online learning from live ED data

---

## Thesis wording

**Say:** tabular Bayesian fallback encodes clinician-elicited priors and likelihoods for named presentation scenarios.

**Do not say:** the chatbot runs a full Bayesian network trained on EMR data.

---

## Testing

- Chest pain + HR/RR only → Orange posterior ~0.89
- Complete vitals, no conflict, high confidence → Bayes skipped
- Low confidence vague text → `low_confidence_general` scenario

See [08-test-scenarios.md](08-test-scenarios.md).
