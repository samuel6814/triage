# 05 — Fusion engine (f_fusion)

Deterministic controller that combines layer colours into final \(C\). **Not an average** — a safety checklist with max-urgency rule.

Sources: [`equations.js`](../curatio/client/src/components/presentation/equations.js), [`presentation/presentation_friday.tex`](../presentation/presentation_friday.tex) (fusion priority list), [`FusionDeepDiveSlide.jsx`](../curatio/client/src/pages/dashboard-presentation/slides/FusionDeepDiveSlide.jsx).

---

## Master function

\[
C = f_{\mathrm{fusion}}(\mathbf{D},\, T,\, \mathbf{P},\; \text{flags})
\]

Inputs (derived before fusion):

| Input | Source |
|-------|--------|
| \(C_{\mathrm{disc}}\) | [03-discriminators.md](03-discriminators.md) |
| \(C_{\mathrm{TEWS}}\) | [02-tews-calculator.md](02-tews-calculator.md) |
| \(C_{\mathrm{Bayes}}\) | [04-bayesian-fallback.md](04-bayesian-fallback.md) |
| \(C_{\mathrm{NLP}}\) | `predict.py` / BioBERT |
| flags | `tews_incomplete`, `low_nlp_confidence`, `layer_conflict`, … |

---

## Urgency ordering

\[
\mathrm{ord}(\text{Red}) = 4 > \mathrm{ord}(\text{Orange}) = 3 > \mathrm{ord}(\text{Yellow}) = 2 > \mathrm{ord}(\text{Green}) = 1
\]

---

## Safety rule (primary)

\[
\mathrm{ord}(C) \geq \max\bigl\{\mathrm{ord}(C_{\mathrm{disc}}),\, \mathrm{ord}(C_{\mathrm{TEWS}}),\, \mathrm{ord}(C_{\mathrm{Bayes}}),\, \mathrm{ord}(C_{\mathrm{NLP}})\bigr\}
\]

Only consider terms that are **non-null** (layer ran and produced a colour).

Implementation:

```python
ORD = {"Green": 1, "Yellow": 2, "Orange": 3, "Red": 4}
INV = {v: k for k, v in ORD.items()}

def fuse_max_urgency(layers: dict[str, str | None]) -> str:
    present = [ORD[c] for c in layers.values() if c]
    if not present:
        return "Green"
    return INV[max(present)]
```

This alone satisfies most conflict cases (chest pain: NLP Orange, TEWS Yellow → Orange).

---

## Priority checklist (secondary / audit narrative)

For thesis and UI explanation, document ordered checks (first strong signal wins in narrative; mathematically equivalent to max-urgency when all layers produce a colour):

1. Red discriminator active (\(d_j > \tau\)) → \(C = \text{Red}\)
2. Orange discriminator active → \(C = \text{Orange}\)
3. \(T > 7\) → \(C = \text{Red}\)
4. \(5 \leq T \leq 6\) → \(C = \text{Orange}\)
5. \(3 \leq T \leq 4\) → \(C = \text{Yellow}\) *(unless superseded by max rule)*
6. Vitals incomplete **and** Bayes invoked → \(C = C_{\mathrm{Bayes}}\)
7. Else if only NLP available → \(C = C_{\mathrm{NLP}}\)
8. Else \(C = \text{Green}\)

Steps 1–5 align with SATS bedside practice; step 6 handles missing vitals; **max-urgency rule is the implementation source of truth**.

---

## Conflict examples

| Case | \(C_{\mathrm{NLP}}\) | \(C_{\mathrm{TEWS}}\) | \(C_{\mathrm{disc}}\) | \(C_{\mathrm{Bayes}}\) | **\(C\)** |
|------|---------------------|----------------------|----------------------|----------------------|----------|
| Chest pain + mild vitals | Orange | Yellow | Orange | Orange | **Orange** |
| Normal language, critical vitals | Green | Red | — | — | **Red** |
| Ambiguous text, incomplete vitals | Yellow | Yellow | — | Orange | **Orange** |
| All Green, high confidence | Green | Green | — | skipped | **Green** |

Worked chest pain (from slides):

\[
\underbrace{d_{\mathrm{chest}} > \tau}_{\text{language}} +
\underbrace{T = 4}_{\text{TEWS = Yellow}} +
\underbrace{P(\mathrm{Orange} \mid E) \approx 0.89}_{\text{Bayesian}}
\;\Rightarrow\; C = \text{Orange}
\]

---

## Flags and constraints

| Constraint | Rule |
|------------|------|
| Partial TEWS | Never assign **Green** on TEWS alone if `tews_incomplete` |
| Gate rejection | Fusion never runs; return gate payload |
| Blue | Not from fusion; dignity protocol is nurse-triggered only |
| Calibration warning | Pass through from NLP; does not change \(C\) |

```python
if flags.get("tews_incomplete") and c_tews == "Green":
    c_tews_effective = None  # exclude from max, or cap at Yellow
```

Document chosen behaviour in audit: `"tews_green_suppressed": true`.

---

## Audit JSON (required for thesis / demos)

Every `/fuse` response includes:

```json
{
  "layers": {
    "c_nlp": "Orange",
    "c_tews": "Yellow",
    "c_disc": "Orange",
    "c_bayes": "Orange"
  },
  "fusion": {
    "rule": "max_urgency",
    "ord_values": {"c_nlp": 3, "c_tews": 2, "c_disc": 3, "c_bayes": 3},
    "winning_layers": ["c_nlp", "c_disc", "c_bayes"],
    "fused_colour": "Orange"
  },
  "flags": {
    "tews_incomplete": true,
    "low_nlp_confidence": false,
    "layer_conflict": true,
    "bayes_invoked": true
  }
}
```

---

## `fusion.py` interface (proposed)

```python
def fuse(
    *,
    c_nlp: str,
    c_tews: str | None,
    c_disc: str | None,
    c_bayes: str | None,
    flags: dict,
) -> dict:
    """Returns fused_colour, fusion audit, updated flags."""
```

Pure function — no I/O, easy to unit test.

---

## Environment

| Variable | Default | Purpose |
|----------|---------|---------|
| `FUSION_RULE` | `max_urgency` | Only supported mode in v1 |
| `SUPPRESS_TEWS_GREEN_WHEN_INCOMPLETE` | `true` | Partial vitals guard |

---

## Testing

Unit tests:

- max({Orange, Yellow}) → Orange
- partial TEWS Green suppressed
- all null except NLP → NLP colour
- Red discriminator + Green NLP → Red

Integration: [08-test-scenarios.md](08-test-scenarios.md).
