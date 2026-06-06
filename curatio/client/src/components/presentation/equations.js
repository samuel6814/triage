// Central LaTeX strings for KaTeX — use String.raw to avoid escaping issues

export const SESSION_STATE = String.raw`\mathbf{S}_s = (X,\, \mathbf{D},\, T,\, \mathbf{P},\, C,\, \text{flags})`;

export const LAYER_FUNCTIONS = String.raw`\mathbf{D} = f_{\mathrm{NLP}}(X),\quad T = f_{\mathrm{TEWS}}(\mathbf{v}),\quad \mathbf{P} = f_{\mathrm{Bayes}}(E),\quad C = f_{\mathrm{fusion}}(\mathbf{D}, T, \mathbf{P})`;

export const VOICE_PIPELINE = String.raw`X = g_{\mathrm{trans}}\!\bigl(g_{\mathrm{ASR}}(\mathrm{audio})\bigr)`;

export const TEWS_SUM = String.raw`T = f_{\mathrm{TEWS}}(\mathbf{v}) = \sum_{k=1}^{6} w_k \, f_k(v_k), \quad w_k = 1`;

export const TEWS_HR = String.raw`f_1(v_1) = \begin{cases}
  3 & \text{if } \mathrm{HR} \geq 130 \\
  2 & \text{if } 111 \leq \mathrm{HR} \leq 129 \\
  0 & \text{if } 51 \leq \mathrm{HR} \leq 100 \\
  2 & \text{if } \mathrm{HR} \leq 40 \\
  1 & \text{otherwise (borderline)}
\end{cases}`;

export const TEWS_RR = String.raw`f_2(v_2) = \begin{cases}
  3 & \text{if } \mathrm{RR} \geq 30 \\
  2 & \text{if } 21 \leq \mathrm{RR} \leq 29 \\
  0 & \text{if } 9 \leq \mathrm{RR} \leq 14 \\
  1 & \text{otherwise}
\end{cases}`;

export const TEWS_COLOUR_MAP = String.raw`C_{\mathrm{TEWS}}(T) = \begin{cases}
  \text{Red} & T > 7 \\
  \text{Orange} & 5 \leq T \leq 6 \\
  \text{Yellow} & 3 \leq T \leq 4 \\
  \text{Green} & T \leq 2
\end{cases}`;

export const TEWS_PARTIAL = String.raw`T_{\mathrm{partial}} = \sum_{k \in \mathcal{K}_{\mathrm{obs}}} w_k \, f_k(v_k), \quad \mathcal{K}_{\mathrm{obs}} = \{k : v_k \text{ measured}\}`;

export const TEWS_EXAMPLE = String.raw`f_1(125) = 2,\quad f_2(26) = 2,\quad f_{3:6} = 0 \;\Rightarrow\; T = 4 \;\Rightarrow\; C_{\mathrm{TEWS}} = \text{Yellow}`;

export const BAYES_POSTERIOR = String.raw`P(C_k \mid E) = \frac{P(E \mid C_k)\, P(C_k)}{\sum_{j} P(E \mid C_j)\, P(C_j)}`;

export const BAYES_ARGMAX = String.raw`C_{\mathrm{Bayes}} = \arg\max_{k} P(C_k \mid E)`;

export const BAYES_EVIDENCE = String.raw`E = \bigl[\text{entity}_1, \ldots, \text{entity}_r,\, v_{k_1}, \ldots, v_{k_s}\bigr]`;

export const BAYES_DISEASE = String.raw`P(D \mid S) = \frac{P(S \mid D)\, P(D)}{P(S)}`;

export const BAYES_OVERRIDE = String.raw`\text{If } P(D \mid S) > \tau_B \text{ then } C_{\mathrm{Bayes}} = \text{Red (or Orange per protocol)}`;

export const FUSION_ORD = String.raw`\mathrm{ord}(\text{Red}) = 4 > \mathrm{ord}(\text{Orange}) = 3 > \mathrm{ord}(\text{Yellow}) = 2 > \mathrm{ord}(\text{Green}) = 1`;

export const FUSION_SAFETY = String.raw`\mathrm{ord}(C) \geq \max\bigl\{\mathrm{ord}(C_{\mathrm{disc}}),\, \mathrm{ord}(C_{\mathrm{TEWS}}),\, \mathrm{ord}(C_{\mathrm{Bayes}})\bigr\}`;

export const FUSION_FUNCTION = String.raw`C = f_{\mathrm{fusion}}(\mathbf{D},\, T,\, \mathbf{P},\; \text{flags})`;

export const TOKEN_EMBED = String.raw`E(t_i) = E_{\mathrm{word}}(t_i) + E_{\mathrm{pos}}(i) + E_{\mathrm{seg}}(t_i)`;

export const ATTENTION = String.raw`\mathrm{Attention}(Q, K, V) = \mathrm{softmax}\!\left(\frac{QK^\top}{\sqrt{d_k}}\right) V`;

export const TRANSFORMER_LAYER = String.raw`H^{(\ell)} = \mathrm{LayerNorm}\!\Bigl(Z^{(\ell)} + \mathrm{FFN}(Z^{(\ell)})\Bigr), \quad Z^{(\ell)} = \mathrm{LayerNorm}\!\Bigl(H^{(\ell-1)} + \mathrm{MultiHead}(H^{(\ell-1)})\Bigr)`;

export const CLS_HEAD = String.raw`h_{\mathrm{[CLS]}} = H^{(L)}_{1,:} \in \mathbb{R}^{768}`;

export const DISCRIMINATOR_HEAD = String.raw`d_j = \sigma\!\bigl(w_j^\top h_{\mathrm{[CLS]}} + b_j\bigr) \in [0,1]`;

export const ACUITY_SOFTMAX = String.raw`\hat{\mathbf{y}} = \mathrm{softmax}(W h_{\mathrm{[CLS]}} + \mathbf{b}), \quad \hat{y}_c = P(\text{acuity} = c \mid X)`;

export const CONFIDENCE = String.raw`\text{confidence} = \max_c \hat{y}_c, \quad \text{if confidence} < \tau \Rightarrow \text{flag for Bayesian fallback}`;

export const NLP_CHAIN = String.raw`X \xrightarrow{\tau} (t_i) \xrightarrow{E} H^{(0)} \xrightarrow{L \times} H^{(L)} \xrightarrow{\mathrm{head}} \hat{\mathbf{y}}`;

export const TRAINING_LOSS = String.raw`\mathcal{L} = -\sum_{i=1}^{N} \log P(y_i \mid X_i; \theta)`;

export const MLM_LOSS = String.raw`\mathcal{L}_{\mathrm{MLM}} = -\sum_{i \in \mathcal{M}} \log P(t_i \mid H^{(L)}; \theta)`;

export const WORKED_CHEST = String.raw`\underbrace{d_{\mathrm{chest}} > \tau}_{\text{language}} + \underbrace{T = 4}_{\text{TEWS alone = Yellow}} + \underbrace{P(\mathrm{Orange} \mid E) \approx 0.89}_{\text{Bayesian}} \;\Rightarrow\; C = \text{Orange}`;
