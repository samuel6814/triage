# Pathways design — protocol-mapped colour pathways on fused \(C\)

## Design choice

**Method:** Protocol-mapped colour pathways (SATS-aligned).

After fusion assigns colour \(C = f_{\mathrm{fusion}}(\ldots)\), the chatbot emits a **pathway card** \(P(C)\). Text-only `/predict` still maps \(C_{\mathrm{NLP}} = f_{\mathrm{SATS}}(\hat{c})\) for backward compatibility; pathway cards for multi-signal intake use **fused** colour from `POST /fuse`.

\[
P(C) = \bigl(T_{\max},\; \text{destination},\; \text{actions},\; \text{escalation}\bigr)
\]

Full protocol + JSON shape: [`../triage-fusion/06-pathways.md`](../triage-fusion/06-pathways.md).

## Colour from acuity (NLP layer)

| Acuity \(\hat{c}\) | \(C_{\mathrm{NLP}}\) |
|--------------------|----------------------|
| 1 | Red |
| 2 | Orange |
| 3 | Yellow |
| 4 | Green |
| 5 | Green |

Blue is a separate dignity protocol (not produced by the 5-class acuity model or fusion).

## Five-path protocol table

| Colour | \(T_{\max}\) | Destination | System / staff actions | Escalation |
|--------|--------------|-------------|------------------------|------------|
| **Red** | 0 min (immediate) | Resuscitation bay | Code Red; bypass registration/payment; ACLS/ATLS as indicated | Immediate senior clinician alert |
| **Orange** | 10 min | Acute / high-dependency bed | Allocate bed; start countdown; continuous monitoring | Escalate to head nurse if unclaimed within \(T_{\max}\) |
| **Yellow** | 60 min | ED waiting / urgent stream | Standing orders in parallel (e.g. malaria RDT, basic labs) while waiting | Re-assess if timer expires or symptoms worsen |
| **Green** | &lt; 4 h (routine) | OPD / Minors / Polyclinic | **Divert** away from acute ED; digital ticket to non-acute stream | Return to ED only if deterioration / re-triage |
| **Blue** | Dignity protocol | Mortuary / private space | Silent notification to mortuary + social work/chaplaincy; no emergency alarm | N/A |

## Chatbot output (Part 2 product shape)

For each accepted medical complaint via `/fuse` the system returns:

1. NLP acuity + confidence (audit)  
2. Layer colours \(C_{\mathrm{NLP}}\), \(C_{\mathrm{TEWS}}\), \(C_{\mathrm{disc}}\), \(C_{\mathrm{Bayes}}\)  
3. Fused colour \(C\) and pathway card \(P(C)\)  
4. Optional OpenMed entities  
5. Flags (incomplete TEWS, layer conflict, Bayes invoked, calibration warning)

## What remains out of scope

- Full Bayesian network (pgmpy)  
- Learned multi-label discriminator head  
- Prospective clinical trial / HIS integration  

## Worked scenario (chest pain)

1. Patient texts: “crushing central chest pain, sweaty, cannot catch breath.”  
2. Optional vitals: HR 125, RR 26 → \(T=4\), \(C_{\mathrm{TEWS}}=\) Yellow.  
3. Discriminator `central_chest_pain` → Orange floor; tabular Bayes → Orange (~0.89).  
4. Fusion max-urgency → **Orange**; pathway: acute bed, 10-minute countdown.
