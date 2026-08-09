# Pathways design — protocol-mapped colour pathways (no Bayesian)

## Design choice

**Method:** Protocol-mapped colour pathways (SATS-aligned).

After Part 1 assigns colour \(C\) from NLP acuity, the chatbot emits a **pathway card** \(P(C)\). No TEWS sum and no Bayesian posterior are required at intake.

\[
P(C) = \bigl(T_{\max},\; \text{destination},\; \text{actions},\; \text{escalation}\bigr)
\]

## Colour from acuity (implemented)

| Acuity \(\hat{c}\) | Colour \(C\) |
|--------------------|--------------|
| 1 | Red |
| 2 | Orange |
| 3 | Yellow |
| 4 | Green |
| 5 | Green |

Blue is a separate dignity protocol (not produced by the 5-class acuity model).

## Five-path protocol table

| Colour | \(T_{\max}\) | Destination | System / staff actions | Escalation |
|--------|--------------|-------------|------------------------|------------|
| **Red** | 0 min (immediate) | Resuscitation bay | Code Red; bypass registration/payment; ACLS/ATLS as indicated | Immediate senior clinician alert |
| **Orange** | 10 min | Acute / high-dependency bed | Allocate bed; start countdown; continuous monitoring | Escalate to head nurse if unclaimed within \(T_{\max}\) |
| **Yellow** | 60 min | ED waiting / urgent stream | Standing orders in parallel (e.g. malaria RDT, basic labs) while waiting | Re-assess if timer expires or symptoms worsen |
| **Green** | &lt; 4 h (routine) | OPD / Minors / Polyclinic | **Divert** away from acute ED; digital ticket to non-acute stream | Return to ED only if deterioration / re-triage |
| **Blue** | Dignity protocol | Mortuary / private space | Silent notification to mortuary + social work/chaplaincy; no emergency alarm | N/A |

Sources: `latex/synopsis-article/syn-no-math.tex`, `slides_saturday/sections/01-clinical.tex`, `slides_saturday/sections/07-protocols-demo.tex`.

## Chatbot output (Part 2 product shape)

For each accepted medical complaint the system should return:

1. Predicted acuity level and SATS colour  
2. Confidence (softmax)  
3. Pathway card: destination, \(T_{\max}\), next actions, escalation rule  
4. Optional OpenMed entities (interpretability)  
5. Calibration / low-confidence warning when appropriate (nurse review)—**not** Bayesian inference  

## What we are not building in Part 2

- Live TEWS calculator from vitals  
- Bayesian \(P(C\mid E)\) fusion  
- Master fusion checklist that takes \(\max\) over NLP/TEWS/Bayes  

Those remain future work / related literature only.

## Worked scenario (chest pain)

1. Patient texts: “crushing central chest pain, sweaty, cannot catch breath.”  
2. Medical gate: pass. OpenMed: disease spans (chest pain, dyspnoea).  
3. BioBERT → e.g. Level 2 → **Orange**.  
4. Pathway card: acute bed, 10-minute countdown, escalate if unclaimed.  
5. Nurse may later add TEWS vitals at the desk; chatbot already routed urgency from language.
