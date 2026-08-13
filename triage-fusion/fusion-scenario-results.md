# Fusion scenario results (thesis Ch.4 export)

Layer votes from automated unit tests (`curatio/server/ml/tests/test_fuse.py`) with NLP colour mocked where noted. TEWS / discriminators / Bayes / fusion are deterministic.

| # | Presentation | \(C_{\mathrm{NLP}}\) | \(C_{\mathrm{TEWS}}\) | \(C_{\mathrm{disc}}\) | \(C_{\mathrm{Bayes}}\) | **Fused \(C\)** | Notes |
|---|--------------|----------------------|----------------------|----------------------|------------------------|-----------------|-------|
| 1 | Crushing chest pain + HR 125 / RR 26 | Orange | Yellow | Orange | Orange (~0.89) | **Orange** | Canonical conflict; pathway \(T_{\max}=10\) min |
| 2 | Mild language + critical vitals | Green (mock) | Red | — / weak | invoked | **Red** | `ord(fused) ≥ ord(c_tews)` |
| 3 | Severe abdominal pain, no vitals | Orange (mock) | null | Yellow+ (vomiting blood) | invoked | **≥ Orange** | Incomplete TEWS → Bayes |
| 5 | Mild rash + full normal vitals | Green | Green | null | skipped | **Green** | Green diversion / OPD pathway |
| 6 | Mild text + extreme vitals | Yellow (mock) | Red | — | invoked | **Red** | Max-urgency safety |
| 7 | Stable Green | Green | Green | null | skipped | **Green** | No escalation |
| 8 | `/predict` text-only | \(C_{\mathrm{NLP}}\) only | — | — | — | n/a | No `layers` / `pathway` / `tews` |

**Safety count (illustrative):** scenarios 1, 2, 6 show fusion ≥ NLP urgency when vitals or discriminators escalate.

**Limitation:** tabular Bayes priors are clinician-elicited / literature-plausible, not calibrated on KATH EMR. NLP colours in rows marked “mock” are fixed for unit tests; live BioBERT may vary slightly.

Source specs: [08-test-scenarios.md](08-test-scenarios.md). API: `POST /fuse`.
