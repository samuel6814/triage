import React from 'react';

/** Display the formula being explained */
const Formula = ({ children }) => <p className="formula">{children}</p>;

/** Symbol glossary heading + list wrapper */
const Symbols = ({ children }) => (
  <>
    <p className="symbols"><strong>Every symbol — what it does:</strong></p>
    <ul>{children}</ul>
  </>
);

/** One symbol definition */
const Sym = ({ code, children }) => (
  <li><code>{code}</code> — {children}</li>
);

const Why = ({ children }) => (
  <div className="why"><strong>Why it matters:</strong> {children}</div>
);

const SayLive = ({ children }) => (
  <div className="sayLive"><strong>How to say it live:</strong> {children}</div>
);

/**
 * Central registry of help-modal explanations, keyed by topic.
 * Formula topics include a symbol-by-symbol glossary for every parameter.
 */
export const INFO = {
  // ── Pipeline / input ──────────────────────────────────────────────
  tokens128: {
    title: '128-token limit (τ)',
    body: (
      <>
        <Formula><code>X → τ → (t₁, t₂, …, t₁₂₈)</code> — only the first 128 word-pieces are kept.</Formula>
        <Symbols>
          <Sym code="X">Raw chief-complaint text (English string from chat or voice pipeline).</Sym>
          <Sym code="τ">The <strong>tokeniser</strong> function — splits text into sub-word pieces (e.g. &quot;chest&quot;, &quot;##pain&quot;).</Sym>
          <Sym code="t_i">The i-th token (word-piece) after tokenisation; index <code>i</code> runs from 1 to at most 128.</Sym>
          <Sym code="128">Hard cap on sequence length — anything beyond token 128 is <strong>truncated</strong> (discarded).</Sym>
        </Symbols>
        <Why>
          Transformers cost grows with length²; 128 is enough for typical complaints while keeping
          inference fast on CPU.
        </Why>
      </>
    ),
  },
  gAsr: {
    title: 'g_ASR — speech-to-text',
    body: (
      <>
        <Formula><code>g_ASR(audio) → transcript</code></Formula>
        <Symbols>
          <Sym code="audio">Raw voice recording from the patient (waveform / voice note file).</Sym>
          <Sym code="g_ASR">The <strong>automatic speech recognition</strong> function — maps sound to written words in the patient&apos;s spoken language.</Sym>
          <Sym code="g">Generic notation for &quot;a replaceable function&quot; — any ASR engine can be plugged in.</Sym>
        </Symbols>
        <Why>Patients who cannot type can still describe symptoms by speaking.</Why>
      </>
    ),
  },
  gTrans: {
    title: 'g_trans — translation',
    body: (
      <>
        <Formula><code>g_trans(transcript) → English text</code></Formula>
        <Symbols>
          <Sym code="g_trans">The <strong>translation</strong> function — converts local language (e.g. Twi) into standard medical English.</Sym>
          <Sym code="transcript">Written output from <code>g_ASR</code> (still in the patient&apos;s language if not English).</Sym>
          <Sym code="g">Same modular function notation as <code>g_ASR</code>.</Sym>
        </Symbols>
        <Why>BioBERT was trained on English; translation normalises all inputs to one language.</Why>
      </>
    ),
  },
  voicePipeline: {
    title: 'Voice pipeline — X = g_trans(g_ASR(audio))',
    body: (
      <>
        <Formula><code>X = g_trans(g_ASR(audio))</code></Formula>
        <Symbols>
          <Sym code="audio">Patient voice note (input).</Sym>
          <Sym code="g_ASR(audio)">Inner step — speech → written transcript.</Sym>
          <Sym code="g_trans(·)">Outer step — transcript → medical English (if needed).</Sym>
          <Sym code="X">Final <strong>English text</strong> sent to BioBERT — identical format to typed chat input.</Sym>
          <Sym code="=">Composition: read inside-out — ASR first, then translate.</Sym>
        </Symbols>
        <Why>One formula captures the full audio normalisation path before NLP.</Why>
      </>
    ),
  },

  // ── BioBERT architecture ──────────────────────────────────────────
  chiefComplaint: {
    title: 'Chief complaint — text X',
    body: (
      <>
        <Formula><code>X</code> — the language input to the entire NLP chain.</Formula>
        <Symbols>
          <Sym code="X">Patient symptom description as plain text (e.g. &quot;crushing central chest pain&quot;).</Sym>
        </Symbols>
        <Why>Every prediction starts from X — wrong or untranslated text breaks triage downstream.</Why>
      </>
    ),
  },
  encoderLayers: {
    title: 'L = 12 encoder layers',
    body: (
      <>
        <Formula><code>H⁽⁰⁾ → [Layer 1] → … → [Layer L] → H⁽ᴸ⁾</code>, with <code>L = 12</code>.</Formula>
        <Symbols>
          <Sym code="L">Count of stacked transformer encoder layers (depth of the model).</Sym>
          <Sym code="H⁽⁰⁾">Hidden state after embedding — one vector per token, before any attention.</Sym>
          <Sym code="H⁽ℓ⁾">Hidden state after layer ℓ — progressively richer context.</Sym>
          <Sym code="H⁽ᴸ⁾">Final hidden state after all 12 layers — deepest representation.</Sym>
          <Sym code="12">BERT-base standard depth — pre-trained on PubMed; balances capacity vs speed.</Sym>
        </Symbols>
        <Why>Depth lets the model learn clinical context beyond keyword matching.</Why>
      </>
    ),
  },
  tokenEmbed: {
    title: 'Input embedding — E(t_i)',
    body: (
      <>
        <Formula><code>E(t_i) = E_word(t_i) + E_pos(i) + E_seg(t_i)</code></Formula>
        <Symbols>
          <Sym code="E(t_i)">The combined embedding vector for token i — a list of numbers fed into layer 1.</Sym>
          <Sym code="t_i">The i-th token (word-piece) from the tokeniser.</Sym>
          <Sym code="E_word(t_i)">Learned vector for <strong>what the word means</strong> (e.g. &quot;chest&quot; ≈ body part).</Sym>
          <Sym code="E_pos(i)">Learned vector for <strong>position</strong> i in the sentence (word order).</Sym>
          <Sym code="E_seg(t_i)">Learned vector for <strong>segment</strong> (which sentence the token belongs to; usually 0 for single complaints).</Sym>
          <Sym code="+">Element-wise addition of the three vectors into one.</Sym>
        </Symbols>
        <Why>The model needs meaning, order, and segment identity before attention runs.</Why>
      </>
    ),
  },
  attention: {
    title: 'Self-attention — Attention(Q, K, V)',
    body: (
      <>
        <Formula><code>Attention(Q, K, V) = softmax(QKᵀ / √d_k) · V</code></Formula>
        <Symbols>
          <Sym code="Q">Query matrix — &quot;what is this token looking for?&quot;</Sym>
          <Sym code="K">Key matrix — &quot;what does each token offer?&quot;</Sym>
          <Sym code="V">Value matrix — actual content mixed after weights are computed.</Sym>
          <Sym code="QKᵀ">Pairwise similarity scores between every token pair.</Sym>
          <Sym code="d_k">Dimension of each attention head — scaling factor (√d_k) prevents scores exploding.</Sym>
          <Sym code="softmax(·)">Turns raw scores into weights that sum to 1 (a probability distribution over tokens).</Sym>
          <Sym code="· V">Weighted sum of values — tokens with high weight contribute more to the output.</Sym>
        </Symbols>
        <Why>Clinical words (&quot;crushing&quot;, &quot;haemorrhage&quot;) get high weight; filler words (&quot;the&quot;) get near zero.</Why>
      </>
    ),
  },
  transformerLayer: {
    title: 'One transformer layer',
    body: (
      <>
        <Formula>
          <code>Z⁽ℓ⁾ = LayerNorm(H⁽ℓ⁻¹⁾ + MultiHead(H⁽ℓ⁻¹⁾))</code><br />
          <code>H⁽ℓ⁾ = LayerNorm(Z⁽ℓ⁾ + FFN(Z⁽ℓ⁾))</code>
        </Formula>
        <Symbols>
          <Sym code="H⁽ℓ⁻¹⁾">Input to this layer (output of previous layer, or H⁽⁰⁾ for layer 1).</Sym>
          <Sym code="MultiHead(·)">Several attention heads in parallel — each learns different word relationships.</Sym>
          <Sym code="+">Residual connection — adds input back so the layer never fully overwrites prior information.</Sym>
          <Sym code="LayerNorm">Normalises activations to stable scale — stops numbers drifting during 12 layers.</Sym>
          <Sym code="Z⁽ℓ⁾">Intermediate state after the attention sub-block.</Sym>
          <Sym code="FFN">Feed-forward network — non-linear processing of each token&apos;s contextual vector.</Sym>
          <Sym code="H⁽ℓ⁾">Output of this layer — passed to layer ℓ+1 (or to the classifier if ℓ = L).</Sym>
          <Sym code="ℓ">Layer index (1 … 12).</Sym>
        </Symbols>
        <Why>Attention + FFN + residuals + norm, repeated 12 times, builds deep clinical understanding.</Why>
      </>
    ),
  },
  cls768: {
    title: '[CLS] summary — h_[CLS] ∈ ℝ⁷⁶⁸',
    body: (
      <>
        <Formula><code>h_[CLS] = H⁽ᴸ⁾₁,: ∈ ℝ⁷⁶⁸</code></Formula>
        <Symbols>
          <Sym code="[CLS]">Special artificial token prepended to every input — trained to summarise the whole sentence.</Sym>
          <Sym code="h_[CLS]">The 768-number summary vector extracted from the [CLS] position after all layers.</Sym>
          <Sym code="H⁽ᴸ⁾">Final hidden-state matrix after layer L (all tokens × 768 dimensions).</Sym>
          <Sym code="₁,:">Row 1 (the [CLS] row) — all 768 columns.</Sym>
          <Sym code="ℝ⁷⁶⁸">768-dimensional real vector — BERT-base hidden size.</Sym>
          <Sym code="L">Last layer index (12).</Sym>
        </Symbols>
        <Why>The classifier reads this one vector, not individual words — a fixed-size &quot;executive summary&quot;.</Why>
      </>
    ),
  },
  softmaxHead: {
    title: 'Softmax classifier — ŷ = softmax(Wh_[CLS] + b)',
    body: (
      <>
        <Formula>
          <code>ŷ = softmax(W · h_[CLS] + b)</code><br />
          <code>ŷ_c = P(acuity = c | X)</code>
        </Formula>
        <Symbols>
          <Sym code="h_[CLS]">768-dim sentence summary (input to the head).</Sym>
          <Sym code="W">Weight matrix (768 × 5) — learned during fine-tuning; projects summary to 5 scores.</Sym>
          <Sym code="b">Bias vector (length 5) — per-class offset added to each logit.</Sym>
          <Sym code="W·h_[CLS]+b">Raw logits (5 numbers) — one per acuity class, before normalisation.</Sym>
          <Sym code="softmax(·)">Squashes logits to probabilities in [0,1] that sum to 100%.</Sym>
          <Sym code="ŷ">Output probability vector (5 values) — the model&apos;s full prediction.</Sym>
          <Sym code="ŷ_c">Probability that acuity equals class c (c = 1 … 5).</Sym>
          <Sym code="c">Acuity class index (1 = most urgent, 5 = routine).</Sym>
          <Sym code="X">Original text input (conditioning the whole chain).</Sym>
        </Symbols>
        <Why>Converts abstract numbers into interpretable triage percentages; argmax(ŷ) is the predicted level.</Why>
      </>
    ),
  },
  acuityFiveLevels: {
    title: '5 acuity levels (softmax output)',
    body: (
      <>
        <Formula><code>ŷ = (ŷ₁, ŷ₂, ŷ₃, ŷ₄, ŷ₅)</code> with <code>Σ ŷ_c = 1</code></Formula>
        <Symbols>
          <Sym code="ŷ_c">Probability for acuity level c (c = 1 … 5).</Sym>
          <Sym code="1">Level 1 — most urgent (maps to Red).</Sym>
          <Sym code="2">Level 2 — highly urgent (Orange).</Sym>
          <Sym code="3">Level 3 — moderate (Yellow).</Sym>
          <Sym code="4–5">Levels 4–5 — non-urgent / routine (Green).</Sym>
          <Sym code="softmax">Ensures all five probabilities are valid and sum to 100%.</Sym>
        </Symbols>
        <Why>The highest ŷ_c becomes the NLP triage answer before fusion with vitals.</Why>
      </>
    ),
  },
  nlpChain: {
    title: 'Forward pass — X → ŷ',
    body: (
      <>
        <Formula><code>X → τ → (t_i) → E → H⁽⁰⁾ → L× → H⁽ᴸ⁾ → head → ŷ</code></Formula>
        <Symbols>
          <Sym code="X">Raw chief-complaint text.</Sym>
          <Sym code="τ">Tokeniser — text to token sequence.</Sym>
          <Sym code="(t_i)">Ordered list of word-pieces (max 128).</Sym>
          <Sym code="E">Embedding layer — each t_i → vector; produces H⁽⁰⁾.</Sym>
          <Sym code="H⁽⁰⁾">Initial hidden state (post-embedding).</Sym>
          <Sym code="L×">Repeat L = 12 transformer encoder layers.</Sym>
          <Sym code="H⁽ᴸ⁾">Final contextual hidden state.</Sym>
          <Sym code="head">Classification head on [CLS] — outputs ŷ.</Sym>
          <Sym code="ŷ">Five acuity probabilities.</Sym>
        </Symbols>
        <Why>End-to-end map from patient words to triage probabilities in one forward pass.</Why>
      </>
    ),
  },

  // ── Safety gates ──────────────────────────────────────────────────
  confidenceGate: {
    title: 'Confidence gate — max(ŷ) vs τ',
    body: (
      <>
        <Formula><code>confidence = max_c ŷ_c</code> &nbsp; if <code>confidence &lt; τ</code> → Bayesian fallback</Formula>
        <Symbols>
          <Sym code="confidence">Peak softmax probability — how sure the model is of its top class.</Sym>
          <Sym code="max_c ŷ_c">Maximum over all 5 classes c — the highest entry in ŷ.</Sym>
          <Sym code="ŷ_c">Predicted probability for acuity class c.</Sym>
          <Sym code="τ">Threshold (≈ 0.85) — below this, the model is treated as uncertain.</Sym>
          <Sym code="⇒">Logical implication — triggers a flag, not a different class by itself.</Sym>
        </Symbols>
        <Why>Prevents overconfident wrong guesses — the system defers when it is not sure.</Why>
      </>
    ),
  },
  fusionController: {
    title: 'Fusion — C = f_fusion(D, T, P, flags)',
    body: (
      <>
        <Formula><code>C = f_fusion(D, T, P, flags)</code></Formula>
        <Symbols>
          <Sym code="C">Final SATS triage colour (Red / Orange / Yellow / Green) — system output.</Sym>
          <Sym code="f_fusion">Deterministic rules engine (not a neural net) — priority checklist.</Sym>
          <Sym code="D">Language signal from BioBERT (discriminator / acuity from text).</Sym>
          <Sym code="T">TEWS total score from vitals (integer sum of f_k).</Sym>
          <Sym code="P">Bayesian posterior / override signal (probabilities or forced colour).</Sym>
          <Sym code="flags">Boolean markers — e.g. low confidence, missing vitals, incomplete TEWS.</Sym>
        </Symbols>
        <Why>AI is never the unchecked final decision — rules pick the safer colour when layers disagree.</Why>
      </>
    ),
  },
  urgencyOrder: {
    title: 'Urgency ordering — ord(·)',
    body: (
      <>
        <Formula><code>ord(Red)=4 &gt; ord(Orange)=3 &gt; ord(Yellow)=2 &gt; ord(Green)=1</code></Formula>
        <Symbols>
          <Sym code="ord(·)">Function mapping a colour name to an integer rank (higher = more urgent).</Sym>
          <Sym code="Red = 4">Most urgent band — resuscitation / immediate.</Sym>
          <Sym code="Orange = 3">Very urgent — majors ED.</Sym>
          <Sym code="Yellow = 2">Moderate urgency.</Sym>
          <Sym code="Green = 1">Least urgent — minors / OPD.</Sym>
          <Sym code="&gt;">Strict ordering used when comparing two colours.</Sym>
        </Symbols>
        <Why>Turns colours into numbers so &quot;take the more urgent&quot; becomes max(ord(·)).</Why>
      </>
    ),
  },
  safetyRule: {
    title: 'Safety rule — ord(C) ≥ max(…)',
    body: (
      <>
        <Formula><code>ord(C) ≥ max(ord(C_disc), ord(C_TEWS), ord(C_Bayes))</code></Formula>
        <Symbols>
          <Sym code="C">Final fused colour (output).</Sym>
          <Sym code="ord(C)">Numeric urgency rank of the final decision.</Sym>
          <Sym code="C_disc">Colour suggested by language / BioBERT layer.</Sym>
          <Sym code="C_TEWS">Colour from vitals alone (TEWS lookup table).</Sym>
          <Sym code="C_Bayes">Colour from Bayesian layer (posterior or disease override).</Sym>
          <Sym code="max(·)">Most urgent rank among the three layer opinions.</Sym>
          <Sym code="≥">Final C must be <strong>at least as urgent</strong> as that maximum — never downgrade.</Sym>
        </Symbols>
        <Why>Ethical core — fail-safe: never send a patient to a less urgent pathway than any layer suggested.</Why>
      </>
    ),
  },

  // ── TEWS ──────────────────────────────────────────────────────────
  tewsSum: {
    title: 'TEWS sum — T = Σ w_k f_k(v_k)',
    body: (
      <>
        <Formula><code>T = f_TEWS(v) = Σₖ₌₁⁶ w_k · f_k(v_k), &nbsp; w_k = 1</code></Formula>
        <Symbols>
          <Sym code="T">Total TEWS score (integer) — higher = more physiologically abnormal.</Sym>
          <Sym code="f_TEWS">TEWS scoring function — deterministic, no AI.</Sym>
          <Sym code="v">Vital-sign vector (HR, RR, mobility, temp, AVPU, trauma).</Sym>
          <Sym code="k">Index over the 6 vital components (1 … 6).</Sym>
          <Sym code="v_k">Measured value of vital k (e.g. v₁ = heart rate in bpm).</Sym>
          <Sym code="f_k(v_k)">Points assigned to vital k by its SATS piecewise table (0–3).</Sym>
          <Sym code="w_k">Weight for vital k — here always 1 (equal weighting).</Sym>
          <Sym code="Σ">Sum — add all six (or fewer, if partial) component scores.</Sym>
        </Symbols>
        <Why>Objective physiological counter-check to language — fully auditable arithmetic.</Why>
      </>
    ),
  },
  tewsHr: {
    title: 'Heart rate — f₁(HR)',
    body: (
      <>
        <Formula>Piecewise: <code>f₁(v₁)</code> from HR thresholds (130+, 111–129, 51–100, ≤40, else 1).</Formula>
        <Symbols>
          <Sym code="f₁">Scoring function for vital component 1 (heart rate).</Sym>
          <Sym code="v₁">Heart rate value in beats per minute (bpm).</Sym>
          <Sym code="HR">Same as v₁ — clinical abbreviation on slides.</Sym>
          <Sym code="3">Points if HR ≥ 130 (critical tachycardia).</Sym>
          <Sym code="2">Points if 111 ≤ HR ≤ 129, or HR ≤ 40 (bradycardia).</Sym>
          <Sym code="0">Points if 51 ≤ HR ≤ 100 (normal range).</Sym>
          <Sym code="1">Points otherwise (borderline bands).</Sym>
        </Symbols>
        <Why>Tachycardia signals stress even when the patient&apos;s words sound calm.</Why>
      </>
    ),
  },
  tewsRr: {
    title: 'Respiratory rate — f₂(RR)',
    body: (
      <>
        <Formula>Piecewise: <code>f₂(v₂)</code> from RR thresholds (≥30, 21–29, 9–14, else 1).</Formula>
        <Symbols>
          <Sym code="f₂">Scoring function for vital component 2 (respiratory rate).</Sym>
          <Sym code="v₂">Respiratory rate in breaths per minute.</Sym>
          <Sym code="RR">Same as v₂ — clinical abbreviation.</Sym>
          <Sym code="3">Points if RR ≥ 30 (critically fast breathing).</Sym>
          <Sym code="2">Points if 21 ≤ RR ≤ 29.</Sym>
          <Sym code="0">Points if 9 ≤ RR ≤ 14 (normal).</Sym>
          <Sym code="1">Points in other bands.</Sym>
        </Symbols>
        <Why>Fast breathing often precedes obvious language cues in respiratory/cardiac distress.</Why>
      </>
    ),
  },
  tewsColourMap: {
    title: 'TEWS → colour — C_TEWS(T)',
    body: (
      <>
        <Formula><code>C_TEWS(T)</code>: Red if T&gt;7; Orange if 5≤T≤6; Yellow if 3≤T≤4; Green if T≤2.</Formula>
        <Symbols>
          <Sym code="C_TEWS">Colour assigned from vitals alone (before fusion).</Sym>
          <Sym code="T">Total TEWS score from the sum formula.</Sym>
          <Sym code="T &gt; 7">Red band — critical physiology.</Sym>
          <Sym code="5 ≤ T ≤ 6">Orange band.</Sym>
          <Sym code="3 ≤ T ≤ 4">Yellow band.</Sym>
          <Sym code="T ≤ 2">Green band — reassuring vitals.</Sym>
        </Symbols>
        <Why>Gives vitals an independent voice at fusion — calm speech + bad vitals still escalates.</Why>
      </>
    ),
  },
  tewsPartial: {
    title: 'Partial TEWS — missing vitals',
    body: (
      <>
        <Formula><code>{'T_partial = Σ_{k ∈ K_obs} w_k f_k(v_k)'}</code>, &nbsp; <code>{'K_obs = {k : v_k measured}'}</code></Formula>
        <Symbols>
          <Sym code="T_partial">TEWS sum using only vitals that were actually recorded.</Sym>
          <Sym code="K_obs">Set of indices k where vital v_k was measured (subset of {'{1,…,6}'}).</Sym>
          <Sym code="v_k measured">Vital k exists in the record — not NaN / not skipped.</Sym>
          <Sym code="w_k, f_k, v_k">Same as full TEWS — only the summation range shrinks.</Sym>
          <Sym code="tews_incomplete">Flag set when any vital is missing — triggers Bayesian caution.</Sym>
        </Symbols>
        <Why>Busy ERs often lack full vitals; partial sum + flag avoids false reassurance.</Why>
      </>
    ),
  },
  tewsExample: {
    title: 'Worked example — T = 4',
    body: (
      <>
        <Formula><code>f₁(125)=2, f₂(26)=2, f₃₋₆=0 ⇒ T=4 ⇒ C_TEWS=Yellow</code></Formula>
        <Symbols>
          <Sym code="f₁(125)=2">HR 125 bpm → 2 points (111–129 band).</Sym>
          <Sym code="f₂(26)=2">RR 26/min → 2 points (21–29 band).</Sym>
          <Sym code="f₃₋₆=0">Mobility, temperature, consciousness, trauma all normal → 0 each.</Sym>
          <Sym code="T=4">2+2+0+0+0+0 = 4 total TEWS score.</Sym>
          <Sym code="C_TEWS=Yellow">T=4 falls in 3–4 band → Yellow from vitals alone.</Sym>
          <Sym code="⇒">Therefore / implies next step in the chain.</Sym>
        </Symbols>
        <Why>Shows vitals alone would under-triage chest pain — fusion with language is essential.</Why>
      </>
    ),
  },

  // ── Training ──────────────────────────────────────────────────────
  mlmLoss: {
    title: 'Phase 1: Medical school — L_LM (pre-training)',
    body: (
      <>
        <span className="phase">Phase 1 — Medical school</span>
        <Formula><code>{'L_LM = −Σ_{i∈M} log P(t_i | H⁽ᴸ⁾; θ)'}</code></Formula>
        <p>
          Before the model could learn to triage, it first had to learn how to speak
          &quot;doctor.&quot; It read millions of PubMed medical abstracts and played a massive
          game of fill-in-the-blank (~15% of words masked per sentence).
        </p>
        <Symbols>
          <Sym code="L_LM">Masked Language Modelling (LM) loss — the mathematical penalty for each wrong guess.</Sym>
          <Sym code="i ∈ M">The set of masked (hidden) word positions in the sentence.</Sym>
          <Sym code="t_i">The true hidden word the model must predict (e.g. <strong>chest</strong> in &quot;severe ___ pain&quot;).</Sym>
          <Sym code="H⁽ᴸ⁾">The surrounding context the model is allowed to read after all L = 12 layers (e.g. &quot;The patient presented with severe ___ pain&quot;).</Sym>
          <Sym code="P(t_i | H⁽ᴸ⁾; θ)">Probability the model assigns to the correct word t_i given context and weights θ.</Sym>
          <Sym code="θ">All learnable weights — embeddings plus 12 transformer layers.</Sym>
          <Sym code="−log P">Penalty term — high when the guess is wrong or low-confidence (see −log explorer on slide).</Sym>
          <Sym code="Σ_{i∈M}">Add up the penalty for every masked word in the batch.</Sym>
        </Symbols>
        <SayLive>
          &quot;Before our AI could triage patients, it had to understand medical terminology. This first
          formula is the Masked Language Modelling loss. The model was given millions of medical
          sentences with 15% of the words blanked out. It had to look at the context — like
          &apos;severe ___ pain&apos; — and predict the missing word. If it predicted
          &apos;chest&apos;, the probability P was high, and the mathematical penalty dropped.
          Through millions of repetitions, the model mapped the complex grammar of clinical
          medicine.&quot;
        </SayLive>
        <Why>BioBERT &quot;graduates medical school&quot; here — general clinical English, not triage yet.</Why>
      </>
    ),
  },
  fineTuneLoss: {
    title: 'Phase 2: Residency — L (fine-tuning)',
    body: (
      <>
        <span className="phase">Phase 2 — Residency</span>
        <Formula><code>{'L = −Σ_{i=1}^N log P(y_i | X_i; θ)'}</code></Formula>
        <p>
          Once BioBERT understood medical language, we taught it our specific task: assigning a
          triage acuity level (mapped to SATS colour) from each chief complaint.
        </p>
        <Symbols>
          <Sym code="L">Cross-entropy loss — measures how far the AI&apos;s triage guess is from the real nurse&apos;s decision.</Sym>
          <Sym code="N">Total patients in the training set (~80,000 historical records after the CSV merge).</Sym>
          <Sym code="i">Index over training examples (one patient complaint per row).</Sym>
          <Sym code="X_i">Full text of patient i&apos;s chief complaint.</Sym>
          <Sym code="y_i">Ground-truth acuity label assigned by a real clinician (maps to SATS colour).</Sym>
          <Sym code="P(y_i | X_i; θ)">Probability the model assigns to the <strong>correct</strong> label y_i after reading X_i.</Sym>
          <Sym code="θ">Fine-tuned weights including the classifier head — updated to shrink L.</Sym>
          <Sym code="−log P(y_i | X_i)">Huge when the model is only 10% confident in the nurse&apos;s Orange but y_i is Orange.</Sym>
        </Symbols>
        <SayLive>
          &quot;Once the model understood clinical language, we fine-tuned it on our specific task using
          cross-entropy loss. For every patient N in our historical dataset, the model reads the
          text X_i and guesses a triage level. If the real nurse marked the patient as Orange (y_i),
          but the model was only 10% confident it was Orange, this negative-log formula generates a
          massive mathematical penalty. The model is forced to update its weights to reduce that
          penalty, learning to align its predictions with real-world clinical triage decisions.&quot;
        </SayLive>
        <Why>This is &quot;residency&quot; — the model learns <em>our</em> hospital triage task on 80k labelled rows.</Why>
      </>
    ),
  },
  negativeLog: {
    title: 'Why −log(P)?',
    body: (
      <>
        <Formula><code>{'penalty = −log(P)'}</code> &nbsp; used in both L_LM and L</Formula>
        <p>
          Both training formulas use <strong>negative log-probability</strong> instead of plain
          percentages. Examiners often ask why.
        </p>
        <Symbols>
          <Sym code="P">Model&apos;s assigned probability for the correct answer (0 to 1).</Sym>
          <Sym code="−log(P)">Penalty — approaches 0 when P ≈ 1 (confident and correct); explodes as P → 0.</Sym>
          <Sym code="P = 0.97">−log(0.97) ≈ 0.03 — tiny penalty, weights barely move.</Sym>
          <Sym code="P = 0.10">−log(0.10) ≈ 2.30 — massive penalty, strong weight update.</Sym>
          <Sym code="P = 0.01">−log(0.01) ≈ 4.61 — catastrophic penalty for confident wrong guesses.</Sym>
        </Symbols>
        <SayLive>
          &quot;We use minus log P because it turns confidence into a training signal with the right
          shape: when the model is already 97% sure and correct, the penalty is almost zero. When
          it is only 10% sure of the nurse&apos;s label, the penalty shoots up — that steep curve is
          what forces the optimiser to take big corrective steps. Play with the confidence slider on
          this slide to see the penalty bar jump.&quot;
        </SayLive>
        <Why>
          −log is the standard cross-entropy penalty in deep learning — steep when wrong, flat when
          already right, which makes training stable and effective.
        </Why>
      </>
    ),
  },
  forwardPass: {
    title: 'Forward pass (training step)',
    body: (
      <>
        <Formula>One batch: run <code>X → … → ŷ</code> for 16 complaints; no weight update yet.</Formula>
        <Symbols>
          <Sym code="batch of 16">Mini-batch size during training — 16 rows per step.</Sym>
          <Sym code="ŷ">Predicted probability vectors for each row.</Sym>
          <Sym code="forward">Inference direction only — compute outputs from current θ.</Sym>
        </Symbols>
        <Why>Produces predictions that the loss function compares to nurse labels.</Why>
      </>
    ),
  },
  lossFn: {
    title: 'Loss ℒ — cross-entropy (one batch)',
    body: (
      <>
        <Formula><code>{'ℒ_batch = −(1/16) Σ log P(y_i | X_i; θ)'}</code> over 16 patients</Formula>
        <Symbols>
          <Sym code="ℒ">Scalar loss for this mini-batch — averaged cross-entropy.</Sym>
          <Sym code="16">Batch size — 16 complaints per optimisation step.</Sym>
          <Sym code="log P(y_i | X_i)">Same −log penalty as Phase 2 residency formula (see slider on slide).</Sym>
          <Sym code="y_i, X_i, θ">Nurse label, complaint text, model weights.</Sym>
        </Symbols>
        <Why>Tells backprop how wrong the current weights are before the update step.</Why>
      </>
    ),
  },
  backprop: {
    title: 'Backpropagation',
    body: (
      <>
        <Formula>Compute <code>∂ℒ/∂θ</code> and update <code>θ ← θ − η · ∇ℒ</code>.</Formula>
        <Symbols>
          <Sym code="∂ℒ/∂θ">Gradient — how each weight contributed to the loss.</Sym>
          <Sym code="θ">Model weights adjusted slightly to reduce ℒ.</Sym>
          <Sym code="η">Learning rate — step size (small, e.g. 2e-5).</Sym>
          <Sym code="∇ℒ">Gradient vector pointing uphill on loss; we step opposite (downhill).</Sym>
        </Symbols>
        <Why>Repeated over 13,500 steps × 3 epochs — this is how the model learns from data.</Why>
      </>
    ),
  },
  trainingLoop: {
    title: 'Training loop (3 epochs)',
    body: (
      <>
        <Formula>Repeat: Forward → ℒ → Backprop → next batch; full dataset = 1 epoch.</Formula>
        <Symbols>
          <Sym code="epoch">One complete pass over all ~80k training rows.</Sym>
          <Sym code="3 epochs">Model sees every example three times (13,500 steps total).</Sym>
          <Sym code="eval_loss">Loss on held-out validation set — 0.001812 at best checkpoint.</Sym>
        </Symbols>
        <Why>Controls how much the model learns vs overfits; best eval_loss picks the deployed weights.</Why>
      </>
    ),
  },
  baseModel: {
    title: 'Base model checkpoint',
    body: (
      <>
        <p>Starting weights: <code>Yuvrajxms09/biobert-triage-classifier</code> — not random init.</p>
        <Symbols>
          <Sym code="checkpoint">Saved weight snapshot from prior training on PubMed + triage-like data.</Sym>
          <Sym code="fine-tune">We continue training on our 80k KATH-style rows from this starting θ.</Sym>
        </Symbols>
        <Why>Transfer learning — reuse medical language knowledge; only teach our specific labels.</Why>
      </>
    ),
  },
  dataMerge: {
    title: 'Training data join',
    body: (
      <>
        <Formula><code>train.csv ⋈ chief_complaints.csv → (X_i, y_i)</code> ~80k rows</Formula>
        <Symbols>
          <Sym code="train.csv">Labels (nurse acuity y_i) + vitals metadata.</Sym>
          <Sym code="chief_complaints.csv">Raw symptom text X_i per patient key.</Sym>
          <Sym code="⋈">SQL-style join on patient ID — pairs text with label.</Sym>
        </Symbols>
        <Why>Supervised learning needs (text, label) pairs — the join builds the training set.</Why>
      </>
    ),
  },
  epochs: {
    title: 'Epochs = 3',
    body: (
      <>
        <Formula>3 full passes × ~80k rows ≈ 13,500 optimisation steps.</Formula>
        <Symbols>
          <Sym code="epoch">One sweep of the entire training set.</Sym>
          <Sym code="step">One batch forward + backprop (16 rows).</Sym>
        </Symbols>
        <Why>Too few → underfit; too many → memorise training rows and fail on new patients.</Why>
      </>
    ),
  },
  evalLoss: {
    title: 'Best eval_loss = 0.001812',
    body: (
      <>
        <Formula><code>eval_loss = L</code> computed on validation set (never trained on).</Formula>
        <Symbols>
          <Sym code="eval_loss">Validation cross-entropy — lower is better.</Sym>
          <Sym code="0.001812">Best value achieved — very low error on held-out data.</Sym>
          <Sym code="best checkpoint">Saved model weights at lowest eval_loss, not the last epoch.</Sym>
        </Symbols>
        <Why>Honest generalisation metric — how we chose the model deployed in the API.</Why>
      </>
    ),
  },

  // ── Bayesian ──────────────────────────────────────────────────────
  bayesPosterior: {
    title: "Bayes' rule — P(C_k | E)",
    body: (
      <>
        <Formula><code>P(C_k | E) = P(E | C_k) · P(C_k) / Σ_j P(E | C_j) · P(C_j)</code></Formula>
        <Symbols>
          <Sym code="P(C_k | E)">Posterior — updated probability that colour k is correct given evidence E.</Sym>
          <Sym code="C_k">Triage colour k (Red, Orange, Yellow, or Green).</Sym>
          <Sym code="E">Evidence vector — symptoms + entities + any vitals (see bayesEvidence).</Sym>
          <Sym code="P(C_k)">Prior — baseline P(colour k) from hospital historical rates.</Sym>
          <Sym code="P(E | C_k)">Likelihood — how probable this evidence is if colour k were true.</Sym>
          <Sym code="Σ_j">Sum over all colours j — normalising constant.</Sym>
          <Sym code="j">Index over colour classes in the denominator.</Sym>
          <Sym code="k">Index of the colour whose posterior we compute.</Sym>
        </Symbols>
        <Why>Combines history (prior) with this patient (likelihood) when NLP/vitals are insufficient.</Why>
      </>
    ),
  },
  bayesEvidence: {
    title: 'Evidence vector E',
    body: (
      <>
        <Formula><code>{'E = [entity₁, …, entity_r, v_{k₁}, …, v_{k_s}]'}</code></Formula>
        <Symbols>
          <Sym code="E">Flat list of all observed clinical features fed into Bayes.</Sym>
          <Sym code="entity_i">NLP-extracted symptom entity (e.g. chest_pain, radiating_pain).</Sym>
          <Sym code="r">Count of text entities extracted.</Sym>
          <Sym code="v_{k_j}">Measured vital value (e.g. HR=125) included in evidence.</Sym>
          <Sym code="s">Count of vitals present — missing ones omitted from E.</Sym>
        </Symbols>
        <Why>Structured input — Bayes needs features, not raw prose.</Why>
      </>
    ),
  },
  bayesArgmax: {
    title: 'Bayesian decision — argmax',
    body: (
      <>
        <Formula><code>C_Bayes = argmax_k P(C_k | E)</code></Formula>
        <Symbols>
          <Sym code="C_Bayes">Bayesian layer&apos;s chosen colour — input to fusion.</Sym>
          <Sym code="argmax_k">Pick k that maximises P(C_k | E) — highest posterior wins.</Sym>
          <Sym code="P(C_k | E)">Posterior from Bayes&apos; rule for each colour k.</Sym>
          <Sym code="k">Colour index (Red / Orange / Yellow / Green).</Sym>
        </Symbols>
        <Why>Turns a full probability table into one actionable colour for f_fusion.</Why>
      </>
    ),
  },
  bayesDisease: {
    title: 'Disease probability — P(D | S)',
    body: (
      <>
        <Formula><code>P(D | S) = P(S | D) · P(D) / P(S)</code></Formula>
        <Symbols>
          <Sym code="P(D | S)">Posterior probability of disease D given symptom pattern S.</Sym>
          <Sym code="D">Specific serious diagnosis (e.g. myocardial infarction, stroke).</Sym>
          <Sym code="S">Symptom pattern extracted from the complaint (not full raw text).</Sym>
          <Sym code="P(S | D)">Likelihood — how often this symptom pattern appears with disease D.</Sym>
          <Sym code="P(D)">Prior prevalence of disease D in the population / hospital.</Sym>
          <Sym code="P(S)">Marginal probability of symptom pattern S (normalisation).</Sym>
        </Symbols>
        <Why>Detects classic red-flag presentations even when vitals look reassuring.</Why>
      </>
    ),
  },
  bayesOverride: {
    title: 'Disease override rule',
    body: (
      <>
        <Formula>If <code>P(D | S) &gt; τ_B</code> then <code>C_Bayes = Red</code> (or Orange per protocol).</Formula>
        <Symbols>
          <Sym code="P(D | S)">Disease posterior from the formula above.</Sym>
          <Sym code="τ_B">Bayesian disease threshold (e.g. 0.75) — override trigger.</Sym>
          <Sym code="C_Bayes">Forced output colour — bypasses mild TEWS.</Sym>
          <Sym code="Red / Orange">Protocol-dependent escalation level for that disease.</Sym>
        </Symbols>
        <Why>Hard safety net — crushing chest pain + high P(MI|S) cannot stay Green.</Why>
      </>
    ),
  },
  bayesWhenRuns: {
    title: 'When Bayesian runs',
    body: (
      <>
        <Symbols>
          <Sym code="missing vitals">Partial TEWS — incomplete physiological picture.</Sym>
          <Sym code="max(ŷ) &lt; τ">BioBERT confidence below ~0.85 — NLP uncertain.</Sym>
          <Sym code="fusion conflict">Language colour ≠ TEWS colour — need a tie-breaker.</Sym>
        </Symbols>
        <Why>Fallback layer only — activates when primary signals are weak or contradictory.</Why>
      </>
    ),
  },

  // ── Fusion worked example ─────────────────────────────────────────
  workedChestFusion: {
    title: 'Fusion resolution — chest pain case',
    body: (
      <>
        <Formula>
          <code>d_chest &gt; τ</code> (language Orange) + <code>T=4</code> (TEWS Yellow) +{' '}
          <code>P(Orange|E)≈0.89</code> (Bayesian) ⇒ <code>C=Orange</code>
        </Formula>
        <Symbols>
          <Sym code="d_chest">Discriminator score for chest-pain urgency from BioBERT / keyword rules.</Sym>
          <Sym code="τ">Language urgency threshold — above it → Orange signal.</Sym>
          <Sym code="T=4">TEWS total from HR=125, RR=26 — maps to Yellow alone.</Sym>
          <Sym code="P(Orange|E)">Bayesian posterior for Orange given evidence E.</Sym>
          <Sym code="C=Orange">Final fused colour after safety rule — Majors (ED) pathway.</Sym>
          <Sym code="⇒">Fusion output — max urgency among layers wins.</Sym>
        </Symbols>
        <Why>Symptoms trump moderate vitals — patient fails safe to Orange, not Yellow Minors.</Why>
      </>
    ),
  },

  // ── Data exploration (non-formula) ────────────────────────────────
  datasetRoles: {
    title: 'Dataset roles',
    body: (
      <>
        <Symbols>
          <Sym code="train.csv">80k labelled rows + vitals — used for training.</Sym>
          <Sym code="test.csv">20k held-out rows — evaluate generalisation.</Sym>
          <Sym code="chief_complaints.csv">100k raw symptom texts — inputs.</Sym>
          <Sym code="triage_predictions_results.csv">100k model outputs — inference log.</Sym>
        </Symbols>
        <Why>Train/test split proves the model works on patients it never saw during training.</Why>
      </>
    ),
  },
  acuityDistribution: {
    title: 'Acuity distribution (train set)',
    body: (
      <>
        <Symbols>
          <Sym code="Level 1 ~4%">Rare critical cases — hardest to learn.</Sym>
          <Sym code="Level 3 ~36%">Most common — moderate urgency.</Sym>
          <Sym code="imbalance">Few Red/Orange vs many Green — why fusion safety layers exist.</Sym>
        </Symbols>
        <Why>Realistic hospital mix — model must not ignore rare urgent cases.</Why>
      </>
    ),
  },
  confidence100: {
    title: '99.6% at confidence = 1.0',
    body: (
      <>
        <Symbols>
          <Sym code="confidence = 1.0">max(ŷ) = 1.0 — model assigns 100% to one class.</Sym>
          <Sym code="99.6%">Share of 100k predictions with peak probability exactly 1.0.</Sym>
        </Symbols>
        <Why>Very decisive on clear cases — but can still be confidently wrong on rare phrasings.</Why>
      </>
    ),
  },
  bayesianCandidates: {
    title: '361 Bayesian-candidate rows',
    body: (
      <>
        <Symbols>
          <Sym code="361">Count of predictions with confidence between ~0.6 and 0.99 (borderline).</Sym>
          <Sym code="0.85">Threshold τ — cases near this trigger fallback consideration.</Sym>
        </Symbols>
        <Why>These are exactly the uncertain rows the confidence gate flags for Bayesian.</Why>
      </>
    ),
  },
  acuityToSats: {
    title: 'Acuity level → SATS colour',
    body: (
      <>
        <Formula>Level 1–2 → Red/Orange; 3 → Yellow; 4–5 → Green.</Formula>
        <Symbols>
          <Sym code="predicted_acuity_level">Integer 1–5 from BioBERT argmax(ŷ).</Sym>
          <Sym code="sats_colour">Clinical routing colour returned by the API.</Sym>
        </Symbols>
        <Why>Translates model output into the colour language clinicians use for pathways.</Why>
      </>
    ),
  },
};

export default INFO;
