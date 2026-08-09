# Mathematics scope — what we use vs what we defer

## In scope (thesis methodology + implemented system)

### 1. Softmax acuity classification

BioBERT produces logits \(\mathbf{z} \in \mathbb{R}^{5}\). Softmax:

\[
\hat{y}_c = \frac{e^{z_c}}{\sum_{j=1}^{5} e^{z_j}}, \qquad
\hat{c} = \arg\max_{c} \hat{y}_c, \qquad
\text{confidence} = \max_c \hat{y}_c.
\]

Training uses cross-entropy on acuity labels.

### 2. Deterministic SATS colour map

\[
C = f_{\mathrm{SATS}}(\hat{c}) =
\begin{cases}
\text{Red} & \hat{c}=1 \\
\text{Orange} & \hat{c}=2 \\
\text{Yellow} & \hat{c}=3 \\
\text{Green} & \hat{c}\in\{4,5\}
\end{cases}
\]

Under this fixed map, colour-routing accuracy equals acuity accuracy.

### 3. Pathway protocol function

\[
P(C) = \bigl(T_{\max}(C),\; \mathrm{dest}(C),\; \mathrm{actions}(C),\; \mathrm{escalation}(C)\bigr)
\]

See `03-pathways-design.md`. This is discrete protocol logic, not probabilistic fusion.

### 4. Evaluation metrics

Accuracy, precision, recall, F1, macro-F1; confusion matrix; calibration / mean confidence. Indicator form:

\[
\mathrm{Accuracy} = \frac{1}{n}\sum_{i=1}^{n} \mathbb{1}[\hat{c}_i = c_i].
\]

### 5. Medical gate (clinical relevance score)

Rule/heuristic score vs threshold \(\tau_{\mathrm{gate}}\) (default 0.35) to reject non-clinical text before BioBERT.

---

## Deferred / out of scope (do not implement as Part 2)

| Topic | Typical equation (slides only) | Thesis treatment |
|-------|--------------------------------|------------------|
| TEWS sum | \(T=\sum_k w_k f_k(v_k)\) | Future work / nurse desk |
| TEWS colour bands | piecewise \(C_{\mathrm{TEWS}}(T)\) | Context in lit review; not chatbot v1 |
| Bayesian posterior | \(P(C_k\mid E)\propto P(E\mid C_k)P(C_k)\) | Related work / skim papers only |
| Fusion safety max | \(\mathrm{ord}(C)\ge\max\{\ldots\}\) | Explicitly **not** this thesis’s architecture |

## Correct wording for the thesis

**Say:** BioBERT performs end-to-end text→acuity inference; colour and pathways follow by deterministic maps.

**Do not say:** BioBERT already performs Bayesian fusion with TEWS.
