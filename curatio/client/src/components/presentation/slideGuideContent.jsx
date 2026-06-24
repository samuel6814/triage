import React from 'react';

const Idea = ({ children }) => (
  <div className="why"><strong>Big idea:</strong> {children}</div>
);

const SayLive = ({ children }) => (
  <div className="sayLive"><strong>How to say it live:</strong> {children}</div>
);

const Sym = ({ code, children }) => (
  <li><code>{code}</code> — {children}</li>
);

const FormulaHint = () => (
  <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.75rem' }}>
    For symbol-by-symbol formula definitions, use the green <strong>?</strong> next to each equation on the slide.
  </p>
);

/**
 * Per-page presentation Q&A (header Q&A button).
 * Keys: page1 … page28 — match guideTopic in nlpPresentationSlides.js
 */
export const SLIDE_GUIDE = {
  page1: {
    title: 'Page 1 — Title slide',
    body: (
      <>
        <Idea>This deck walks from a patient&apos;s words to a SATS acuity colour using BioBERT — tokenization, 12 transformer layers, pre-training, and fine-tuning.</Idea>
        <p>Running example throughout: <em>&quot;I have a headache and feel feverish. My body aches and I feel weak.&quot;</em></p>
        <SayLive>Introduce the project, authors, and that you will follow one complaint end-to-end through the maths.</SayLive>
      </>
    ),
  },

  page2: {
    title: 'Page 2 — Outline',
    body: (
      <>
        <Idea>Five sections: Clinical Context → NLP Pipeline → BERT Pre-Training → Learning Math → Summary.</Idea>
        <p>The pipeline section is the deepest — it explains every step from raw text to acuity probabilities.</p>
        <SayLive>Give the audience the roadmap so they know when the heavy maths is coming.</SayLive>
      </>
    ),
  },

  page3: {
    title: 'Page 3 — Clinical Scenario',
    body: (
      <>
        <Idea>A patient describes symptoms in plain language; the system must map that to a SATS colour.</Idea>
        <ul>
          <li><strong>SATS bar:</strong> Red and Blue are grouped as immediate/special protocols. The urgency arrow runs Orange → Yellow → Green only. Blue means deceased — not low urgency.</li>
          <li><strong>Chief complaint:</strong> Headache + fever + body aches — moderate, not chest-pain emergency.</li>
        </ul>
        <SayLive>Walk through the conversation image, then point at the colour bar and explain why Blue is separate from Green.</SayLive>
      </>
    ),
  },

  page4: {
    title: 'Page 4 — Fusion safety rule',
    body: (
      <>
        <Idea>Two parallel pathways — TEWS (vitals) and NLP (words) — are fused. A safety rule prevents under-triage when language is strongly urgent.</Idea>
        <p><strong>&quot;Fusion assigns a less urgent colour than a strong signal requires&quot;</strong> means: if BioBERT is very confident about high urgency (e.g. crushing chest pain language), fusion must not downgrade to Green just because vitals look normal.</p>
        <ul>
          <li>Fusion is a <strong>priority checklist</strong>, not an average of scores.</li>
          <li>Strong NLP signal can pull the final colour upward; weak vitals alone cannot pull a strong language signal downward past the safety floor.</li>
        </ul>
        <SayLive>Say: &quot;We never under-triage when the words scream emergency — vitals supplement the text, they don&apos;t override a strong language signal.&quot;</SayLive>
      </>
    ),
  },

  page5: {
    title: 'Page 5 — Bag of words & supervised learning',
    body: (
      <>
        <Idea>Old NLP counted word frequencies (bag-of-words) — &quot;headache&quot; = 1, &quot;feverish&quot; = 1 — with no word order or context. BioBERT uses supervised deep learning on labeled nurse triage data.</Idea>
        <p><strong>Bag-of-words:</strong> Throw all words in a bag, count them, feed counts to a classifier. &quot;Not feverish, no headache&quot; and &quot;headache and feverish&quot; can look similar because they share the same words.</p>
        <p><strong>Supervised pipeline on slide:</strong> Text X → tokenize → embed → 12 layers → [CLS] → softmax → acuity label. Labels come from nurses (Triagegeist).</p>
        <SayLive>Contrast: &quot;BOW loses order and context; our model reads the full sentence bidirectionally and was trained on 80,000 nurse-labeled complaints.&quot;</SayLive>
      </>
    ),
  },

  page6: {
    title: 'Page 6 — Tokenization (τ, tᵢ, M ≤ 128)',
    body: (
      <>
        <Idea>Raw text becomes a sequence of integer IDs that index into the vocabulary table.</Idea>
        <ul>
          <Sym code="τ">The <strong>tokenizer</strong> function — splits text into sub-word tokens.</Sym>
          <Sym code="t_i">The i-th token after tokenisation.</Sym>
          <Sym code="M ≤ 128">Max sequence length; longer complaints are truncated.</Sym>
          <Sym code="~30,000 vocab">BioBERT vocabulary size (28,996 tokens); each ID is the <strong>row index</strong> in the embedding table.</Sym>
          <Sym code="Embedding">A learned lookup table: ID → 768-number vector (covered on page 9).</Sym>
        </ul>
        <p><strong>How IDs are assigned:</strong> Tokenizer matches text to vocabulary entries; known words get fixed IDs, rare words split into sub-word pieces.</p>
        <SayLive>Trace the pipeline diagram left-to-right: text in, integer sequence out, ready for embedding lookup.</SayLive>
      </>
    ),
  },

  page7: {
    title: 'Page 7 — Full ID assignment table',
    body: (
      <>
        <Idea>This slide shows the complete token-to-ID mapping for the running complaint — every token gets a row index.</Idea>
        <p>Notice sub-word pieces (e.g. &quot;##ish&quot;) and special tokens mixed with ordinary words. The sequence order is preserved — unlike bag-of-words.</p>
        <SayLive>Walk through 3–4 rows of the table: &quot;[CLS] is always first with ID 101; each word maps to one row in the 30k vocabulary.&quot;</SayLive>
      </>
    ),
  },

  page8: {
    title: 'Page 8 — [CLS], UNK, and h_[CLS]',
    body: (
      <>
        <Idea>[CLS] is a special summary token prepended to every sentence; its final hidden state becomes the complaint summary for classification.</Idea>
        <ul>
          <li><strong>Square brackets [ ]:</strong> Mark special tokens, not ordinary words. [CLS], [SEP], [MASK] are control tokens.</li>
          <li><strong>&lt;redacted_UNK&gt;:</strong> Unknown token — when the tokenizer cannot match a piece, it assigns the UNK ID (100). The model still runs but may lose fine detail.</li>
          <li><strong>Why [CLS] = 101:</strong> Fixed ID from BERT&apos;s original vocabulary design — arbitrary but consistent across all inputs.</li>
          <li><strong>h in h_[CLS]:</strong> h = hidden state vector (768 numbers) for the [CLS] token after layer 12.</li>
        </ul>
        <SayLive>&quot;Think of [CLS] as an empty summary slot that fills up as the sentence passes through 12 layers.&quot;</SayLive>
      </>
    ),
  },

  page9: {
    title: 'Page 9 — Embedding lookup',
    body: (
      <>
        <Idea>Each token ID looks up a 768-dimensional vector from a learned embedding table E.</Idea>
        <p><strong>Where do the 768 numbers come from?</strong> Not from PubMed text directly — they are <strong>learned weights</strong> updated during pre-training and fine-tuning. Row &quot;headache&quot; holds 768 numbers that the model learned represent that word.</p>
        <p><strong>D1, D2, … D768:</strong> Dimension labels — not named clinical features. Each dimension is one axis in learned space; the model discovers which combinations encode medical meaning.</p>
        <SayLive>&quot;Embedding is a dictionary: word ID → 768 numbers. Those numbers were learned from millions of medical sentences.&quot;</SayLive>
        <FormulaHint />
      </>
    ),
  },

  page10: {
    title: 'Page 10 — What the vector represents',
    body: (
      <>
        <Idea>Each 768-d vector is a point in learned semantic space — similar symptoms end up near each other after training.</Idea>
        <p>The numbers have no human-readable names (not &quot;temperature&quot; or &quot;pain score&quot;). They are coordinates the model uses internally. After 12 layers of attention, these coordinates encode rich clinical context.</p>
        <SayLive>Emphasise: &quot;We don&apos;t hand-engineer features — the model learns its own representation from data.&quot;</SayLive>
      </>
    ),
  },

  page11: {
    title: 'Page 11 — Contextual mapping (three sums)',
    body: (
      <>
        <Idea>Before entering the transformer, each token vector is the sum of three embeddings: token + position + segment.</Idea>
        <ul>
          <li><strong>Token embedding:</strong> what word it is (&quot;headache&quot;).</li>
          <li><strong>Position embedding:</strong> where it sits in the sentence (1st, 2nd, …).</li>
          <li><strong>Segment embedding:</strong> which sentence/segment (usually all 0 for one complaint).</li>
        </ul>
        <p>The diagram shows three vectors adding point-wise to produce one input vector per token.</p>
        <SayLive>&quot;Same word in different positions gets different vectors because position embedding changes the sum.&quot;</SayLive>
      </>
    ),
  },

  page12: {
    title: 'Page 12 — Contextual mapping formula',
    body: (
      <>
        <Idea>Formal sum: H⁽⁰⁾[i] = E_word(t_i) + E_pos(i) + E_seg(i) — this builds the input matrix for layer 1.</Idea>
        <p>Subscripts index token position; each row of H⁽⁰⁾ is one token&apos;s starting 768-d vector before any attention.</p>
        <SayLive>Point at each term in the formula and match it to the diagram on the previous page.</SayLive>
      </>
    ),
  },

  page13: {
    title: 'Page 13 — Input matrix H⁽⁰⁾ and why 768',
    body: (
      <>
        <Idea>H⁽⁰⁾ is a matrix: one row per token, 768 columns per row. It is the input to the first transformer layer.</Idea>
        <p><strong>Why 768?</strong> BERT-Base architecture standard: hidden_size = 768, 12 layers, 12 attention heads (64 dims per head × 12 = 768). BioBERT inherits this from BERT — not tuned specifically for triage.</p>
        <p>Shape: [sequence_length × 768], e.g. 22 tokens × 768 numbers.</p>
        <SayLive>&quot;Imagine a spreadsheet: each row is a word, each column is one learned dimension.&quot;</SayLive>
      </>
    ),
  },

  page14: {
    title: 'Page 14 — Matrix walkthrough with numbers',
    body: (
      <>
        <Idea>A numeric toy example showing actual values in a few rows and columns of H⁽⁰⁾ — makes the abstract matrix concrete.</Idea>
        <p>Values are small decimals (positive and negative) — typical after embedding lookup and summation. They change after each encoder layer.</p>
        <SayLive>Pick one cell: &quot;This single number is one coordinate of &apos;headache&apos; before any context mixing.&quot;</SayLive>
      </>
    ),
  },

  page15: {
    title: 'Page 15 — 12 encoder layers & FFN',
    body: (
      <>
        <Idea>Twelve identical encoder blocks stacked — each contains multi-head self-attention + feed-forward network (FFN) + residual connections + LayerNorm.</Idea>
        <ul>
          <li><strong>Arrows point upward:</strong> Bottom = input tokens, top = output after 12 layers. Data flows up through the stack.</li>
          <li><strong>FFN:</strong> Two linear layers (y = Wx + b) with ReLU in between: expands 768 → 3072 → back to 768. Adds non-linear processing per token after attention.</li>
        </ul>
        <SayLive>&quot;Each layer refines every token using context from all other tokens — twelve rounds of refinement.&quot;</SayLive>
      </>
    ),
  },

  page16: {
    title: 'Page 16 — Zˡ and Hˡ formulas',
    body: (
      <>
        <Idea>Inside each layer: attention output Zˡ, then FFN, then residual + LayerNorm produces Hˡ.</Idea>
        <p><strong>FFN as y = Wx + b:</strong> Two lines — first W₁x + b₁, ReLU bend, then W₂·ReLU(...) + b₂. Like two linear transforms with a non-linear gate.</p>
        <p><strong>Simple Zˡ / Hˡ walkthrough:</strong> If H⁽ˡ⁻¹⁾[headache] = 2.0 and attention adds 0.5 from &quot;feverish&quot;, then Zˡ ≈ 2.5 before LayerNorm. Residual: output = LayerNorm(input + sublayer_output) — keeps gradients stable.</p>
        <SayLive>Read Zˡ formula first (attention), then Hˡ (FFN + residual) — one layer, repeated twelve times.</SayLive>
      </>
    ),
  },

  page17: {
    title: 'Page 17 — Stacking 12 layers',
    body: (
      <>
        <Idea>H⁽⁰⁾ → H⁽¹⁾ → … → H⁽¹²⁾: each layer&apos;s output feeds the next. Early layers capture grammar; later layers capture clinical urgency patterns.</Idea>
        <p>After layer 12, row 0 ([CLS]) is the 768-d summary vector h_[CLS] used for acuity classification.</p>
        <SayLive>&quot;By layer 12, &apos;headache&apos; doesn&apos;t just mean headache — it carries fever and weakness context too.&quot;</SayLive>
      </>
    ),
  },

  page18: {
    title: 'Page 18 — Self-attention diagram',
    body: (
      <>
        <Idea>Every token queries every other token: split into Q (query), K (key), V (value) → score with QKᵀ → softmax → weighted blend of V.</Idea>
        <p>For &quot;headache&quot;: high attention to &quot;feverish&quot; (0.41), itself (0.32), &quot;weak&quot; (0.18); filler words ≈ 0.02.</p>
        <SayLive>Walk the four diagram steps: split → score → softmax → blend. &quot;Words interview each other.&quot;</SayLive>
        <FormulaHint />
      </>
    ),
  },

  page19: {
    title: 'Page 19 — Self-attention equation & W matrices',
    body: (
      <>
        <Idea>Attention(Q,K,V) = softmax(QKᵀ / √d_k) × V — the master formula from &quot;Attention Is All You Need&quot;.</Idea>
        <ul>
          <li><strong>W_Q, W_K, W_V:</strong> Learned weight matrices (like y = Wx + b). Same token H multiplied by different W gives three roles: searcher, advertiser, content carrier.</li>
          <li><strong>d_k = 64:</strong> Per-head dimension; √d_k scaling prevents softmax saturation.</li>
          <li><strong>QKᵀ:</strong> Pairwise relevance — &quot;headache&quot; ↔ &quot;feverish&quot; scores high.</li>
        </ul>
        <SayLive>&quot;W is not one matrix — three separate learned projections create Query, Key, and Value from the same embedding.&quot;</SayLive>
      </>
    ),
  },

  page20: {
    title: 'Page 20 — Masked Language Modeling',
    body: (
      <>
        <Idea>Before triage labels, BioBERT learns medical English by predicting masked words in PubMed/PMC sentences — fill-in-the-blank on ~18 billion words.</Idea>
        <p>15% of tokens masked; model reads bidirectionally (both sides of [MASK]). Teaches vocabulary like &quot;feverish&quot;, &quot;tachycardia&quot; without any acuity labels.</p>
        <p><strong>Data sources:</strong> PubMed abstracts — pubmed.ncbi.nlm.nih.gov; PMC full text — ncbi.nlm.nih.gov/pmc. BioBERT paper: academic.oup.com/bioinformatics/article/36/4/1234/5566506</p>
        <SayLive>&quot;Medical school phase — learn language first, triage labels second.&quot;</SayLive>
      </>
    ),
  },

  page21: {
    title: 'Page 21 — MLM loss formula',
    body: (
      <>
        <Idea>ℒ_LM = −Σ over masked positions log P(t_i | H⁽ᴸ⁾; θ) — penalise the model when it assigns low probability to the correct masked word.</Idea>
        <ul>
          <li><strong>M:</strong> masked positions; <strong>t_i:</strong> true word; <strong>H⁽ᴸ⁾:</strong> context from all 12 layers; <strong>θ:</strong> all weights.</li>
          <li>P = 0.92 → penalty ≈ 0.08 (good). P = 0.01 → penalty ≈ 4.6 (bad).</li>
        </ul>
        <SayLive>Same −log P pattern as triage cross-entropy — only the label changes from &quot;hidden word&quot; to &quot;acuity level&quot;.</SayLive>
      </>
    ),
  },

  page22: {
    title: 'Page 22 — MLM independent vs dependent variables',
    body: (
      <>
        <Idea>Independent variable: surrounding context H⁽ᴸ⁾ (what the model reads). Dependent variable: loss ℒ_LM (how wrong the prediction is).</Idea>
        <p>Example: correct word &quot;headache&quot;, P = 0.92 → contribution −log(0.92) ≈ 0.08. After MLM, BioBERT is fine-tuned on 80,000 Triagegeist chief complaints with cross-entropy.</p>
        <p><strong>Triagegeist data:</strong> kaggle.com/competitions/triagegeist/data</p>
        <SayLive>Bridge to next section: &quot;Pre-training teaches language; fine-tuning teaches triage.&quot;</SayLive>
      </>
    ),
  },

  page23: {
    title: 'Page 23 — Attention softmax',
    body: (
      <>
        <Idea>α_j = exp(e_j) / Σ exp(e_k) — converts raw attention scores into probabilities summing to 1.</Idea>
        <p>Inside self-attention (page 19), not classification. &quot;I&quot;, &quot;a&quot; → α ≈ 0.01; &quot;headache&quot;, &quot;feverish&quot; → α ≈ 0.35+.</p>
        <p><strong>exp:</strong> forces positive values and amplifies large scores so clinical words dominate.</p>
        <SayLive>&quot;Softmax is the volume knob — turns messy scores into clean percentages for blending Value vectors.&quot;</SayLive>
      </>
    ),
  },

  page24: {
    title: 'Page 24 — Classification softmax',
    body: (
      <>
        <Idea>ŷ = softmax(W · h_[CLS] + b) — maps the 768-d summary to 5 acuity probabilities. Highest wins.</Idea>
        <ul>
          <li><strong>W ∈ ℝ⁵ˣ⁷⁶⁸:</strong> learned during fine-tuning on nurse labels.</li>
          <li><strong>Running example:</strong> Level 3 (Moderate) = 72% → Yellow on SATS.</li>
          <li>Class indices 0–4 map to acuity levels 1–5 in the deployed Curatio model.</li>
        </ul>
        <SayLive>&quot;This is the verdict slide — the whole complaint compressed to one vector, then five probabilities.&quot;</SayLive>
        <FormulaHint />
      </>
    ),
  },

  page25: {
    title: 'Page 25 — Forward pass & cross-entropy',
    body: (
      <>
        <Idea>Training step 1–2: forward pass (x = h_[CLS] → logits → ŷ) then loss ℒ = −Σ y_i log(ŷ_i).</Idea>
        <p>With one-hot nurse label, loss simplifies to −log(ŷ_correct class).</p>
        <p><strong>Example:</strong> true = Yellow, model predicts Green 90% (Yellow only 5%) → ℒ = −log(0.05) ≈ 3.0 — large penalty for confident wrong answer.</p>
        <SayLive>&quot;Forward pass produces the guess; cross-entropy grades it against the nurse&apos;s label.&quot;</SayLive>
        <FormulaHint />
      </>
    ),
  },

  page26: {
    title: 'Page 26 — Backpropagation',
    body: (
      <>
        <Idea>∂ℒ/∂W = (∂ℒ/∂ŷ)(∂ŷ/∂z)(∂z/∂W) — chain rule traces error backward through softmax, classification head, and all 12 layers.</Idea>
        <p>z = Wh + b are pre-softmax logits. Gradients pinpoint which weights caused a bad guess — e.g. layers 8–12 over-weighting non-urgent patterns when nurse labeled Yellow but model said Green.</p>
        <SayLive>&quot;Backprop is blame assignment — every weight learns how much it contributed to the mistake.&quot;</SayLive>
      </>
    ),
  },

  page27: {
    title: 'Page 27 — Gradient descent & fine-tuning',
    body: (
      <>
        <Idea>W_new = W_old − α · ∂ℒ/∂W — take a small step opposite to the gradient to reduce loss.</Idea>
        <ul>
          <li><strong>α = 2×10⁻⁵:</strong> learning rate used in triage_new.ipynb.</li>
          <li><strong>ℒ_triage:</strong> summed over N ≈ 80,000 labeled complaints.</li>
          <li><strong>Result:</strong> best eval_loss = 0.001812 after 3 epochs, 13,500 steps.</li>
        </ul>
        <SayLive>&quot;Tiny steps, thousands of times — that&apos;s how BioBERT becomes a triage model.&quot;</SayLive>
      </>
    ),
  },

  page28: {
    title: 'Page 28 — End-to-end summary',
    body: (
      <>
        <Idea>Full path: complaint text → tokenize → embed → 12 layers → h_[CLS] → softmax → Level 3 Yellow at 72%.</Idea>
        <p>This closes the loop opened on page 3 — same headache/fever complaint, now with a mathematical story behind the colour.</p>
        <SayLive>Recap in 30 seconds: clinical scenario → NLP pipeline → pre-training → fine-tuning → Yellow at 72%. Open for questions.</SayLive>
      </>
    ),
  },
};
