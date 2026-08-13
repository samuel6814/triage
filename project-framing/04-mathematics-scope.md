# Mathematics scope — what we use vs what we defer

Implementation detail: [`../triage-fusion/`](../triage-fusion/).

## In scope (thesis methodology + implemented system)

### 1. Softmax acuity classification

BioBERT produces logits \(\mathbf{z} \in \mathbb{R}^{5}\). Softmax:

\[
\hat{y}_c = \frac{e^{z_c}}{\sum_{j=1}^{5} e^{z_j}}, \qquad
\hat{c} = \arg\max_{c} \hat{y}_c, \qquad
\text{confidence} = \max_c \hat{y}_c.
\]

Training uses cross-entropy on acuity labels. NLP-only colour: \(C_{\mathrm{NLP}} = f_{\mathrm{SATS}}(\hat{c})\).

### 2. Deterministic SATS colour map

\[
C_{\mathrm{NLP}} = f_{\mathrm{SATS}}(\hat{c}) =
\begin{cases}
\text{Red} & \hat{c}=1 \\
\text{Orange} & \hat{c}=2 \\
\text{Yellow} & \hat{c}=3 \\
\text{Green} & \hat{c}\in\{4,5\}
\end{cases}
\]

Under this fixed map, **text-only** colour-routing accuracy equals acuity accuracy.

### 3. TEWS calculator (optional vitals)

\[
T = \sum_{k=1}^{6} w_k f_k(v_k), \quad w_k = 1
\]

Partial sums when vitals missing; \(C_{\mathrm{TEWS}}(T)\) bands (Red/Orange/Yellow/Green). See `triage-fusion/02-tews-calculator.md`.

### 4. Discriminators \(\mathbf{D}\)

Rule + OpenMed entity hits → confidence vector; \(C_{\mathrm{disc}}\) = most urgent active colour floor (\(\tau_D = 0.85\)).

### 5. Tabular Bayesian fallback

\[
P(C_k \mid E) = \frac{P(E \mid C_k)\, P(C_k)}{\sum_j P(E \mid C_j)\, P(C_j)}, \qquad
C_{\mathrm{Bayes}} = \arg\max_k P(C_k \mid E)
\]

Scenario-keyed priors/likelihoods (not a full BN / pgmpy). Invoked on incomplete TEWS, low NLP confidence, layer conflict, or `force_bayes`.

### 6. Fusion safety rule

\[
\mathrm{ord}(C) \geq \max\bigl\{\mathrm{ord}(C_{\mathrm{disc}}),\, \mathrm{ord}(C_{\mathrm{TEWS}}),\, \mathrm{ord}(C_{\mathrm{Bayes}}),\, \mathrm{ord}(C_{\mathrm{NLP}})\bigr\}
\]

with \(\mathrm{ord}(\text{Red})=4 > \cdots > \mathrm{ord}(\text{Green})=1\). Implemented as max-urgency in `fusion.py`.

### 7. Pathway protocol function

\[
P(C) = \bigl(T_{\max}(C),\; \mathrm{dest}(C),\; \mathrm{actions}(C),\; \mathrm{escalation}(C)\bigr)
\]

Attached to **fused** \(C\) from `/fuse` (not NLP-only). See `03-pathways-design.md` and `triage-fusion/06-pathways.md`.

### 8. Evaluation metrics

Accuracy, precision, recall, F1, macro-F1; confusion matrix; calibration / mean confidence; fusion scenario table (`triage-fusion/fusion-scenario-results.md`).

### 9. Medical gate (clinical relevance score)

Rule/heuristic score vs threshold \(\tau_{\mathrm{gate}}\) (default 0.35) to reject non-clinical text before BioBERT.

---

## Deferred / out of scope

| Topic | Thesis treatment |
|-------|------------------|
| Full Bayesian network (pgmpy / structure learning) | Related work / future |
| Learned discriminator neural head | Future work |
| Prospective KATH clinical trial | Future work |
| Hospital-calibrated Bayes priors from EMR | Limitation + future |

## Correct wording for the thesis

**Say:** BioBERT provides \(C_{\mathrm{NLP}}\); optional TEWS, rule discriminators, and tabular Bayes fuse by max-urgency into \(C\); pathways attach to fused colour via `/fuse`.

**Do not say:** BioBERT itself is a Bayesian TEWS fusion model; or that we trained a full BN on EMR data.
