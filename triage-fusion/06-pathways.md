# 06 — Pathways P(C)

Protocol-mapped clinical pathways attached to **fused** colour \(C\), not NLP-only \(C_{\mathrm{NLP}}\).

Sources: [`project-framing/03-pathways-design.md`](../project-framing/03-pathways-design.md), [`acuityLevels.js`](../curatio/client/src/data/acuityLevels.js), [`slides_saturday/sections/07-protocols-demo.tex`](../slides_saturday/sections/07-protocols-demo.tex) (if present).

---

## Definition

\[
P(C) = \bigl(T_{\max}(C),\; \mathrm{dest}(C),\; \mathrm{actions}(C),\; \mathrm{escalation}(C)\bigr)
\]

Pathway lookup is **deterministic** — no ML after fusion.

---

## Five-path protocol table

| Colour \(C\) | \(T_{\max}\) | Destination | System / staff actions | Escalation |
|--------------|--------------|-------------|------------------------|------------|
| **Red** | 0 min (immediate) | Resuscitation bay | Code Red; bypass registration/payment; ACLS/ATLS as indicated | Immediate senior clinician alert |
| **Orange** | 10 min | Acute / high-dependency bed | Allocate bed; start countdown; continuous monitoring | Escalate to head nurse if unclaimed within \(T_{\max}\) |
| **Yellow** | 60 min | ED waiting / urgent stream | Standing orders in parallel (e.g. malaria RDT, basic labs) while waiting | Re-assess if timer expires or symptoms worsen |
| **Green** | < 4 h (routine) | OPD / Minors / Polyclinic | **Divert** away from acute ED; digital ticket to non-acute stream | Return to ED only if deterioration / re-triage |
| **Blue** | Dignity protocol | Mortuary / private space | Silent notification to mortuary + social work/chaplaincy; no emergency alarm | N/A |

Blue is **not** produced by the 5-class acuity model or fusion engine. Document for completeness; nurse-initiated only.

---

## Mapping from acuity (reference)

BioBERT acuity → \(C_{\mathrm{NLP}}\) (for `/predict` and audit):

| Acuity level | Colour |
|--------------|--------|
| 1 | Red |
| 2 | Orange |
| 3 | Yellow |
| 4, 5 | Green |

After fusion, **pathway uses fused \(C\)**, which may differ from \(C_{\mathrm{NLP}}\).

---

## JSON pathway object

```json
{
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
  }
}
```

Align human-readable strings with [`acuityLevels.js`](../curatio/client/src/data/acuityLevels.js):

| Level | colour | time | meaning |
|-------|--------|------|---------|
| 1 | Red | Immediate (0 min) | Life-threatening |
| 2 | Orange | Within 10 minutes | Very urgent |
| 3 | Yellow | Within 60 minutes | Urgent |
| 4–5 | Green | Within 4 hours | Non-urgent / routine |

For fused pathways, key by **colour** not acuity level (fusion output is colour-first).

---

## `pathways.py` interface (proposed)

```python
PATHWAYS: dict[str, dict] = {
    "Red": {...},
    "Orange": {...},
    "Yellow": {...},
    "Green": {...},
}

def lookup_pathway(colour: str) -> dict:
    if colour not in PATHWAYS:
        raise ValueError(f"Unknown colour: {colour}")
    return {"colour": colour, **PATHWAYS[colour]}
```

Single source of truth: consider generating JS from Python JSON at build time, or maintain parallel copies with a sync note in checklist.

---

## Chatbot product shape

For each accepted medical complaint via `/fuse`, return:

1. Fused colour \(C\) and acuity (if mapped)
2. Pathway card \(P(C)\)
3. Layer audit (all \(C_{\mathrm{*}}\) votes)
4. Confidence from NLP (interpretability)
5. OpenMed entities (optional)
6. Flags (incomplete vitals, conflict, Bayes invoked)

---

## Green diversion (RQ9)

Green pathway explicitly routes low-acuity patients to OPD/Minors/Polyclinic — away from acute ED congestion. Fusion must not assign Green when:

- Any layer suggests Yellow or above
- `tews_incomplete` with serious discriminators active

Document diversion in UI copy on pathway card.

---

## Worked scenario

1. Patient: "crushing central chest pain, sweaty, cannot catch breath."
2. Gate: pass. OpenMed: chest pain, dyspnoea.
3. \(C_{\mathrm{NLP}} = \text{Orange}\), \(T = 4 \Rightarrow C_{\mathrm{TEWS}} = \text{Yellow}\), \(C_{\mathrm{disc}} = \text{Orange}\), \(C_{\mathrm{Bayes}} = \text{Orange}\).
4. Fusion: \(C = \text{Orange}\).
5. \(P(\text{Orange})\): acute bed, 10-minute countdown, escalate if unclaimed.

---

## Testing

- `lookup_pathway("Orange")` → t_max 10, correct destination string
- Fused Red → immediate pathway, not NLP Yellow pathway
- Unknown colour → 500/validation error

See [08-test-scenarios.md](08-test-scenarios.md).
