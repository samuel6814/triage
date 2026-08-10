# Community Hospital — case study results

**Dataset:** N=1000 synthetic patients (skewed ED mix: 5% / 15% / 30% / 25% / 25%)  
**Setting:** Fictional Ghanaian Community Hospital (LMIC ED)  
**Eval mode:** simulated

## Key findings

| Metric | Value |
|--------|-------|
| Colour-routing accuracy | **97.50%** (975/1000) |
| Level 1 (Red) recall | **94.0%** |
| Green diversion (levels 4-5) | **500** patients (50%) |
| Acute cases (levels 1-3) | **500** patients (50%) |
| Holdout reference (8k eval) | 99.92% baseline BioBERT |

## Pathway binding

Every row includes `pathway_destination` and `t_max_minutes` derived from SATS colour. The chatbot emits a pathway card at intake.

## Charts

- `figures/acuity_distribution.png` — skewed arrival mix
- `figures/pathway_flow.png` — destination counts
- `figures/green_diversion.png` — acute vs non-acute split
- `figures/chatbot_accuracy_by_level.png` — per-level accuracy
- `figures/wait_time_scenario.png` — acute load before/after chatbot

## Transshipment optimization

| Scenario | Total cost (wait units) | Acute-zone patients |
|----------|-------------------------|---------------------|
| Without chatbot | 7150 | 900 |
| With chatbot | 2700 | 500 |
| **Reduction** | **62.2%** | **44.4%** |

## Per-level accuracy

| Level | Colour | n | Accuracy |
|-------|--------|---|----------|
| 1 | Red | 50 | 94.00% |
| 2 | Orange | 150 | 94.00% |
| 3 | Yellow | 300 | 97.00% |
| 4 | Green | 250 | 98.40% |
| 5 | Green | 250 | 100.00% |
