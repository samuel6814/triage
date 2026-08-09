# Ten research questions

Project title: **Hospital Chatbot for Color-Coded Clinical Pathways**

These questions organise Part 1 (done) and Part 2 (pathways design). Bayesian fusion is **not** among them.

| ID | Research question | How we answer it |
|----|-------------------|------------------|
| **RQ1** | Can unstructured chief complaints be mapped to SATS acuity levels 1–5 with clinically usable accuracy? | Fine-tuned BioBERT; holdout accuracy / macro-F1 (`results/`) |
| **RQ2** | Does correct acuity prediction imply correct colour-coded pathway assignment under a fixed \(f_{\mathrm{SATS}}\)? | Deterministic map \(1\to\)Red, \(2\to\)Orange, \(3\to\)Yellow, \(4,5\to\)Green; colour accuracy = acuity accuracy under this map |
| **RQ3** | How should colour codes be translated into concrete hospital pathways (destination, time target, actions)? | Protocol table \(P(C)\) — see `03-pathways-design.md` |
| **RQ4** | Can a chatbot interface deliver pre-triage acuity and pathway guidance before the nurse desk? | Curatio client `/test` + API; pathway card design |
| **RQ5** | How well does the system handle non-clinical / irrelevant input? | Medical gate (`medical_gate.py`); rejection categories + messages |
| **RQ6** | Does clinical NER enrichment (OpenMed) improve interpretability of triage input without replacing the acuity model? | OpenMed disease/drug entities + optional text prefix; BioBERT remains the acuity engine |
| **RQ7** | How does class imbalance affect Level-1 (Red) recall, and what mitigation is appropriate? | Baseline vs SMOTE comparison; L1 recall as safety metric |
| **RQ8** | How overconfident is the softmax output, and what does that imply for nurse oversight on pathway assignment? | Calibration plots; % predictions at confidence 1.0; nurse-in-the-loop framing |
| **RQ9** | Can Green-pathway diversion be specified so low-acuity patients avoid congesting acute zones? | Green protocol → OPD / Minors / Polyclinic in pathway design |
| **RQ10** | What is a defensible LMIC architecture for colour pathways that uses NLP acuity **without** a full TEWS+Bayesian stack at chatbot intake? | Architecture chapter: NLP → \(f_{\mathrm{SATS}}\) → \(P(C)\); TEWS/Bayes as future work |

## Formal Part-1 objective (results slides)

\[
\text{Input } X \;\to\; \hat{c} \in \{1,\ldots,5\} \;\to\; C = f_{\mathrm{SATS}}(\hat{c})
\]

## Formal Part-2 extension

\[
C \;\mapsto\; P(C) = \bigl(T_{\max},\; \text{destination},\; \text{actions},\; \text{escalation}\bigr)
\]
