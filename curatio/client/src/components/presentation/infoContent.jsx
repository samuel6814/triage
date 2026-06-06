import React from 'react';

/**
 * Central registry of help-modal explanations, keyed by topic.
 * Each entry is { title, body }. Bodies are JSX so they can include
 * lists, code, and a highlighted "why it matters" note (className="why").
 *
 * Sourced from the project defense Q&A plus authored explanations for the
 * training/data statistics.
 */
export const INFO = {
  // ── Pipeline / input ──────────────────────────────────────────────
  tokens128: {
    title: 'Why 128 tokens?',
    body: (
      <>
        <p>
          The model only reads the first <strong>128 tokens</strong> (word-pieces) of the
          patient&apos;s text. This is a deliberate computational constraint: a transformer&apos;s
          memory and compute scale <strong>quadratically</strong> with sequence length.
        </p>
        <p>
          Clinically, 128 tokens is far more than enough — a standard chief complaint is only
          5&ndash;30 words, and the critical red-flag keywords are almost always stated at the
          start. Any excess text is simply truncated.
        </p>
        <div className="why">
          <strong>Why it matters:</strong> capping length keeps the model light enough to run on
          CPU in resource-constrained hospitals, while still capturing the urgent keywords.
        </div>
      </>
    ),
  },
  gAsr: {
    title: 'g_ASR — Automatic Speech Recognition',
    body: (
      <>
        <p>
          <code>g_ASR</code> is a generic functional mapping that converts the <strong>physical
          audio</strong> of a voice note into <strong>written text</strong> (speech-to-text).
        </p>
        <p>
          The <code>g</code> just denotes &quot;some function that maps inputs to outputs&quot; — it
          keeps the pipeline modular so any speech engine can be swapped in.
        </p>
        <div className="why">
          <strong>Why it matters:</strong> it lets patients who cannot type still use the system by
          simply speaking.
        </div>
      </>
    ),
  },
  gTrans: {
    title: 'g_trans — Translation',
    body: (
      <>
        <p>
          <code>g_trans</code> maps a <strong>local dialect</strong> (e.g. Twi) onto
          <strong> standardised medical English</strong>. Together with <code>g_ASR</code> it forms
          a normalisation bridge: <code>X = g_trans(g_ASR(audio))</code>.
        </p>
        <div className="why">
          <strong>Why it matters:</strong> it makes the system <strong>input-agnostic</strong> — no
          matter the patient&apos;s language or whether they typed or spoke, BioBERT always receives
          homogeneous English text.
        </div>
      </>
    ),
  },

  // ── BioBERT architecture ──────────────────────────────────────────
  encoderLayers: {
    title: 'Why exactly 12 encoder layers?',
    body: (
      <>
        <p>
          Twelve stacked self-attention layers let the model build <strong>hierarchical
          representations</strong>. A shallow model only matches keywords; 12 layers learn deep
          clinical context.
        </p>
        <p>
          This is the standard <strong>&quot;BERT-base&quot;</strong> architecture, pre-trained on
          PubMed abstracts, so those 12 layers already have an intuition for medical language —
          distinguishing a benign &quot;pain in chest&quot; from critical &quot;crushing chest
          pain&quot;.
        </p>
        <div className="why">
          <strong>Why it matters:</strong> depth is what turns plain text into clinically meaningful
          understanding.
        </div>
      </>
    ),
  },
  tokenEmbed: {
    title: 'Input embedding',
    body: (
      <>
        <p>
          Each token becomes a vector that is the sum of three parts:
        </p>
        <ul>
          <li><strong>Word embedding</strong> — what the word means (e.g. &quot;chest&quot; is a body part).</li>
          <li><strong>Position embedding</strong> — where it sits in the sentence.</li>
          <li><strong>Segment embedding</strong> — which sentence it belongs to.</li>
        </ul>
        <div className="why">
          <strong>Why it matters:</strong> the model needs both meaning <em>and</em> word order;
          embeddings encode both before any reasoning happens.
        </div>
      </>
    ),
  },
  attention: {
    title: 'The attention mechanism',
    body: (
      <>
        <p>
          Attention is the model&apos;s <strong>focus filter</strong>. For each word it computes a
          weight: the score is exponentially amplified (numerator) and then divided by the sum of
          all words&apos; scores (denominator), so the weights add up to 1.
        </p>
        <p>
          This lets the model put heavy weight on critical clinical terms like
          <strong> &quot;haemorrhage&quot;</strong> or <strong>&quot;crushing&quot;</strong> while
          driving filler words like &quot;the&quot; or &quot;is&quot; toward zero.
        </p>
        <div className="why">
          <strong>Why it matters:</strong> it is how the model decides which words actually signal
          urgency.
        </div>
      </>
    ),
  },
  transformerLayer: {
    title: 'Inside one transformer layer',
    body: (
      <>
        <p>Every layer runs two phases, each with a residual connection and LayerNorm:</p>
        <ul>
          <li>
            <strong>Attention phase</strong> — multiple &quot;heads&quot; relate words to one
            another. The residual (<code>+</code>) means it never forgets the original word.
          </li>
          <li>
            <strong>Processing phase</strong> — a feed-forward network interprets the new context.
          </li>
        </ul>
        <p>
          <code>LayerNorm</code> stabilises the maths at both steps, and this block repeats 12 times.
        </p>
        <div className="why">
          <strong>Why it matters:</strong> stacking these stabilised blocks is what produces deep,
          reliable clinical understanding.
        </div>
      </>
    ),
  },
  cls768: {
    title: '[CLS] token & the 768-dim vector',
    body: (
      <>
        <p>
          <strong>[CLS]</strong> is an artificial token that aggregates the whole sentence&apos;s
          context through all 12 layers — an &quot;executive summary&quot; of the complaint.
        </p>
        <p>
          That summary is a <strong>768-number vector</strong> (<code>h_[CLS] &isin; &#8477;&#7536;&#8310;&#8312;</code>)
          — a coordinate in the model&apos;s learned medical space. The classifier reads this vector,
          <em> not</em> the individual words.
        </p>
        <div className="why">
          <strong>Why it matters:</strong> it compresses an entire complaint into one fixed-size
          summary the classifier can act on.
        </div>
      </>
    ),
  },
  softmaxHead: {
    title: 'Classification head & softmax',
    body: (
      <>
        <p>
          This is where the model stops reading and makes a decision. It takes the 768-dim summary
          <code> h_[CLS]</code>, multiplies it by the fine-tuned weight matrix <code>W</code> and
          adds a bias <code>b</code>, projecting 768 numbers down to <strong>5 raw scores</strong>
          (logits) — one per acuity level.
        </p>
        <p>
          <strong>Softmax</strong> then squashes those logits into a valid probability distribution:
          5 values between 0 and 1 that sum to 100%.
        </p>
        <div className="why">
          <strong>Why it matters:</strong> it converts abstract numbers into interpretable triage
          percentages, and the highest one becomes the prediction.
        </div>
      </>
    ),
  },
  nlpChain: {
    title: 'The forward pass (end to end)',
    body: (
      <>
        <p>This tracks the life-cycle of the data through the model:</p>
        <ul>
          <li><code>X</code> (raw text) is tokenised into pieces <code>(t_i)</code>.</li>
          <li>The embedding layer <code>E</code> turns them into the initial state <code>H&#8317;&#8304;&#8318;</code>.</li>
          <li>It loops through <code>L</code> = 12 encoder layers to deepen context, giving <code>H&#8317;&#7473;&#8318;</code>.</li>
          <li>The classification head extracts the [CLS] summary and outputs the 5-colour probability vector <code>&#375;</code>.</li>
        </ul>
        <div className="why">
          <strong>Why it matters:</strong> it shows the complete path from a patient&apos;s words to
          a triage probability.
        </div>
      </>
    ),
  },

  // ── Safety gates ──────────────────────────────────────────────────
  confidenceGate: {
    title: 'The confidence gate',
    body: (
      <>
        <p>
          We define <strong>confidence</strong> as the highest of the 5 probabilities
          (<code>max&#7580;</code>). If this peak falls below a threshold <code>&tau;</code> (about
          0.85), the model is mathematically uncertain.
        </p>
        <p>
          Instead of guessing, a strict logic gate <strong>halts the solo NLP decision</strong> and
          flags the patient for the Bayesian fallback.
        </p>
        <div className="why">
          <strong>Why it matters:</strong> it prevents AI &quot;hallucination&quot; — the system
          knows when it does not know, and defers rather than risk unsafe triage.
        </div>
      </>
    ),
  },
  fusionController: {
    title: 'Master logic controller (fusion)',
    body: (
      <>
        <p>
          Fusion is the deterministic &quot;cage&quot; around the AI. To output the final colour
          <code> C</code> it weighs four inputs:
        </p>
        <ul>
          <li><strong>D</strong> — BioBERT&apos;s subjective text classification.</li>
          <li><strong>T</strong> — the objective TEWS vital-signs score.</li>
          <li><strong>P</strong> — hard-coded clinical priority overrides (Bayesian).</li>
          <li><strong>flags</strong> — uncertainty markers (missing vitals, low confidence).</li>
        </ul>
        <p>
          If the subjective AI and the objective maths disagree, the rules engine overrides the AI
          and defaults to the <strong>highest-acuity colour</strong>.
        </p>
        <div className="why">
          <strong>Why it matters:</strong> it guarantees patient safety by minimising under-triage —
          the AI is never the final, unchecked decision-maker.
        </div>
      </>
    ),
  },
  urgencyOrder: {
    title: 'Urgency ordering',
    body: (
      <>
        <p>
          Each colour is given a numeric rank: <strong>Red = 4 &gt; Orange = 3 &gt; Yellow = 2 &gt;
          Green = 1</strong>. Conflicts are resolved by taking the <strong>maximum</strong> rank.
        </p>
        <p>Example: vitals say Yellow (2) but language says Orange (3) &rarr; max(2, 3) = 3 &rarr; Orange.</p>
        <div className="why">
          <strong>Why it matters:</strong> turning colours into numbers makes &quot;pick the more
          urgent one&quot; a precise, repeatable rule.
        </div>
      </>
    ),
  },
  safetyRule: {
    title: 'The safety rule',
    body: (
      <>
        <p>
          The final colour&apos;s rank must be <strong>at least as urgent</strong> as the most urgent
          opinion from any layer:
          <code> ord(C) &ge; max(ord(C_disc), ord(C_TEWS), ord(C_Bayes))</code>.
        </p>
        <div className="why">
          <strong>Why it matters:</strong> this is the ethical core of the system — a patient can
          never be downgraded below the most urgent signal detected, so the system fails safe.
        </div>
      </>
    ),
  },

  // ── TEWS ──────────────────────────────────────────────────────────
  tewsSum: {
    title: 'TEWS — Triage Early Warning Score',
    body: (
      <>
        <p>
          TEWS adds up points from <strong>six vital signs</strong> (heart rate, respiratory rate,
          mobility, temperature, consciousness, trauma), each weighted equally, into a total
          <code> T</code>. There is <strong>no AI here</strong> — it is deterministic arithmetic.
        </p>
        <div className="why">
          <strong>Why it matters:</strong> a transparent, auditable score gives an objective
          physiological counter-check to the language model.
        </div>
      </>
    ),
  },
  tewsPartial: {
    title: 'Missing vitals (partial TEWS)',
    body: (
      <>
        <p>
          In a busy ER not every vital is measured. We sum only the <strong>observed</strong> vitals
          and set a <code>tews_incomplete</code> flag.
        </p>
        <div className="why">
          <strong>Why it matters:</strong> on incomplete data the system refuses to assign a
          reassuring Green and instead defers to the Bayesian estimate — caution by default.
        </div>
      </>
    ),
  },

  // ── Training ──────────────────────────────────────────────────────
  baseModel: {
    title: 'Base model',
    body: (
      <>
        <p>
          We did not train from scratch. We started from a BioBERT checkpoint already adapted for
          triage (<code>Yuvrajxms09/biobert-triage-classifier</code>) and fine-tuned it on our data.
        </p>
        <div className="why">
          <strong>Why it matters:</strong> transfer learning means we reuse millions of dollars of
          prior medical-language training and only teach the model our specific task.
        </div>
      </>
    ),
  },
  dataMerge: {
    title: 'Data merge (the join)',
    body: (
      <>
        <p>
          Training data was built by joining <code>train.csv</code> (labels + vitals) with
          <code> chief_complaints.csv</code> (the raw symptom text) on the patient key, giving about
          <strong> 80,000</strong> labelled rows.
        </p>
        <div className="why">
          <strong>Why it matters:</strong> the model needs each complaint paired with its
          nurse-assigned acuity to learn the mapping from words to urgency.
        </div>
      </>
    ),
  },
  epochs: {
    title: 'Epochs',
    body: (
      <>
        <p>
          An <strong>epoch</strong> is one full pass of the model over all ~80,000 training rows. We
          trained for <strong>3 epochs</strong> (13,500 optimisation steps), so the model saw the
          whole dataset three times.
        </p>
        <p>
          Too few epochs and the model under-learns; too many and it <strong>overfits</strong>
          (memorises instead of generalising). Three was the sweet spot here.
        </p>
        <div className="why">
          <strong>Why it matters:</strong> the epoch count is the main dial controlling how much the
          model learns versus how much it memorises.
        </div>
      </>
    ),
  },
  evalLoss: {
    title: 'Best eval_loss = 0.001812',
    body: (
      <>
        <p>
          <strong>Evaluation loss</strong> measures the model&apos;s error on a held-out set it never
          trained on (lower is better). A value of <code>0.001812</code> is very low — the model&apos;s
          predicted acuity almost always matches the nurse label on unseen data.
        </p>
        <p>
          We keep the checkpoint with the <strong>best</strong> (lowest) eval_loss, not necessarily
          the last one, to avoid shipping an overfit model.
        </p>
        <div className="why">
          <strong>Why it matters:</strong> eval_loss on held-out data is the honest measure of
          whether the model generalises, and it is how we picked the model we deploy.
        </div>
      </>
    ),
  },
  mlmLoss: {
    title: 'Pre-training loss (MLM)',
    body: (
      <>
        <p>
          Before our work, BioBERT learned medical English with <strong>masked language
          modelling</strong>: hide a word (e.g. &quot;The patient had severe ___ pain&quot;) and
          train the model to predict it (<code>chest</code>). The loss drops as guesses improve.
        </p>
        <div className="why">
          <strong>Why it matters:</strong> after millions of such sentences the model understands
          medical language in general — the foundation we build on.
        </div>
      </>
    ),
  },
  fineTuneLoss: {
    title: 'Fine-tuning loss (cross-entropy)',
    body: (
      <>
        <p>
          Our stage minimises <strong>cross-entropy</strong> between the model&apos;s predicted
          acuity and the nurse&apos;s label across 80k complaints. For a correct, confident guess the
          added loss is tiny (e.g. <code>&minus;log(0.97) &asymp; 0.03</code>); for a wrong, confident
          guess it is large.
        </p>
        <div className="why">
          <strong>Why it matters:</strong> this loss is the signal that teaches the model
          <em> our</em> triage task specifically.
        </div>
      </>
    ),
  },
  trainingLoop: {
    title: 'The training loop',
    body: (
      <>
        <p>Learning repeats a simple cycle on batches of 16 rows:</p>
        <ul>
          <li><strong>Forward</strong> — guess the acuity for the batch.</li>
          <li><strong>Loss</strong> — compare the guesses to the nurse labels.</li>
          <li><strong>Backprop</strong> — adjust the weights to reduce that error.</li>
        </ul>
        <p>Repeated over 3 epochs, driving eval_loss down to 0.001812.</p>
        <div className="why">
          <strong>Why it matters:</strong> this loop is literally how the model &quot;learns&quot;
          from data.
        </div>
      </>
    ),
  },

  // ── Data exploration ──────────────────────────────────────────────
  datasetRoles: {
    title: 'The datasets and their roles',
    body: (
      <>
        <ul>
          <li><code>train.csv</code> (80k) — labelled examples + vitals the model learns from.</li>
          <li><code>test.csv</code> (20k) — held-out rows with no labels, used to check generalisation.</li>
          <li><code>chief_complaints.csv</code> (100k) — the raw symptom text inputs.</li>
          <li><code>triage_predictions_results.csv</code> (100k) — the model&apos;s inference outputs.</li>
        </ul>
        <div className="why">
          <strong>Why it matters:</strong> keeping training and test data separate is what proves the
          model works on patients it has never seen.
        </div>
      </>
    ),
  },
  acuityDistribution: {
    title: 'Acuity distribution',
    body: (
      <>
        <p>
          The breakdown of the 80k training labels across the 5 acuity levels. It is clinically
          realistic: most patients are mid-urgency (<strong>Level 3 &asymp; 36%</strong>) and only a
          few are critical (<strong>Level 1 &asymp; 4%</strong>).
        </p>
        <div className="why">
          <strong>Why it matters:</strong> this is an <strong>imbalanced</strong> dataset — rare
          critical cases are the hardest and most important to get right, which is partly why the
          TEWS and Bayesian safety layers exist.
        </div>
      </>
    ),
  },
  confidence100: {
    title: '99.6% at full confidence',
    body: (
      <>
        <p>
          On 99.6% of predictions the model&apos;s top probability is essentially 1.0 — it is very
          decisive on clear-cut complaints.
        </p>
        <div className="why">
          <strong>Why it matters:</strong> high confidence is good, but a model can also be
          <strong> confidently wrong</strong> on rare phrasings — which is exactly why fusion with
          TEWS and Bayesian exists as a check.
        </div>
      </>
    ),
  },
  bayesianCandidates: {
    title: '361 Bayesian-candidate rows',
    body: (
      <>
        <p>
          361 predictions land in a borderline confidence band (roughly 0.6&ndash;0.99) — for example
          two glaucoma complaints near 0.85.
        </p>
        <div className="why">
          <strong>Why it matters:</strong> these are precisely the uncertain cases the confidence
          gate flags for the Bayesian fallback instead of trusting BioBERT alone.
        </div>
      </>
    ),
  },
  acuityToSats: {
    title: 'Acuity level → SATS colour',
    body: (
      <>
        <p>
          BioBERT predicts an acuity level (1&ndash;5), which maps onto the SATS colour bands:
          Level 1&ndash;2 &rarr; Red/Orange, Level 3 &rarr; Yellow, Level 4&ndash;5 &rarr; Green.
        </p>
        <div className="why">
          <strong>Why it matters:</strong> it translates the model&apos;s numeric output into the
          colour language clinicians actually use to route patients.
        </div>
      </>
    ),
  },

  // ── BioBERT flow diagram steps ────────────────────────────────────
  chiefComplaint: {
    title: 'Chief complaint (text X)',
    body: (
      <>
        <p>
          <strong>X</strong> is the patient&apos;s symptom description — typed in chat or produced
          after speech recognition and translation. This is the raw language input BioBERT reads.
        </p>
        <p>
          Examples: &quot;crushing central chest pain radiating to my arm&quot; or &quot;thunderclap
          headache worsening with movement&quot;.
        </p>
        <div className="why">
          <strong>Why it matters:</strong> every downstream prediction starts here — if the text is
          wrong or untranslated, the model cannot triage correctly.
        </div>
      </>
    ),
  },
  acuityFiveLevels: {
    title: 'Softmax → 5 acuity levels',
    body: (
      <>
        <p>
          The classifier head outputs <strong>5 probabilities</strong> — one per acuity level
          (1 = most urgent through 5 = routine). Softmax forces them to sum to 100%.
        </p>
        <p>
          The level with the highest probability becomes the prediction; that level is then mapped
          to a SATS colour (Red/Orange/Yellow/Green).
        </p>
        <div className="why">
          <strong>Why it matters:</strong> this is the model&apos;s final answer to &quot;how urgent
          does this complaint sound?&quot; before fusion with vitals.
        </div>
      </>
    ),
  },
  voicePipeline: {
    title: 'Voice pipeline formula',
    body: (
      <>
        <p>
          <code>X = g_trans(g_ASR(audio))</code> chains two transformations: speech-to-text, then
          translation to medical English. The result <strong>X</strong> is identical in format to
          typed chat text.
        </p>
        <div className="why">
          <strong>Why it matters:</strong> one formula captures the entire audio normalisation path
          so BioBERT always receives the same kind of input.
        </div>
      </>
    ),
  },

  // ── Training loop steps ───────────────────────────────────────────
  forwardPass: {
    title: 'Forward pass',
    body: (
      <>
        <p>
          The model reads a batch of 16 chief complaints and <strong>guesses</strong> the acuity
          level for each — a full pass through tokenisation, 12 encoder layers, and the softmax head.
        </p>
        <div className="why">
          <strong>Why it matters:</strong> this produces the predictions that loss compares against
          nurse labels.
        </div>
      </>
    ),
  },
  lossFn: {
    title: 'Loss function ℒ',
    body: (
      <>
        <p>
          Cross-entropy loss measures how wrong the guesses are versus the nurse-assigned labels.
          Large loss when the model is confidently wrong; tiny loss when it matches.
        </p>
        <div className="why">
          <strong>Why it matters:</strong> loss is the numerical signal that tells the optimiser
          which direction to adjust weights.
        </div>
      </>
    ),
  },
  backprop: {
    title: 'Backpropagation',
    body: (
      <>
        <p>
          Backprop computes how each weight contributed to the loss and <strong>updates</strong>{' '}
          them slightly to reduce error on the next batch.
        </p>
        <div className="why">
          <strong>Why it matters:</strong> repeated over 13,500 steps this is how the model
          actually learns triage from hospital data.
        </div>
      </>
    ),
  },

  // ── TEWS sub-formulas ─────────────────────────────────────────────
  tewsHr: {
    title: 'Heart rate score f₁(HR)',
    body: (
      <>
        <p>
          A <strong>piecewise lookup table</strong> converts heart rate into TEWS points. HR
          &ge; 130 scores 3 (critical); 111&ndash;129 scores 2; normal range 51&ndash;100 scores 0.
        </p>
        <p>Example: HR = 125 &rarr; f₁(125) = 2.</p>
        <div className="why">
          <strong>Why it matters:</strong> tachycardia is an objective sign of physiological stress
          independent of what the patient says.
        </div>
      </>
    ),
  },
  tewsRr: {
    title: 'Respiratory rate score f₂(RR)',
    body: (
      <>
        <p>
          Respiratory rate is scored similarly: RR &ge; 30 &rarr; 3 points; 21&ndash;29 &rarr; 2;
          normal 9&ndash;14 &rarr; 0.
        </p>
        <p>Example: RR = 26 &rarr; f₂(26) = 2.</p>
        <div className="why">
          <strong>Why it matters:</strong> rapid breathing often signals respiratory or cardiac
          distress before language cues appear.
        </div>
      </>
    ),
  },
  tewsColourMap: {
    title: 'TEWS → colour lookup',
    body: (
      <>
        <p>
          Once total <code>T</code> is computed, a simple table maps it to a colour{' '}
          <strong>before fusion</strong>: T &gt; 7 &rarr; Red; 5&ndash;6 &rarr; Orange; 3&ndash;4
          &rarr; Yellow; T &le; 2 &rarr; Green.
        </p>
        <div className="why">
          <strong>Why it matters:</strong> this gives vitals an independent voice at fusion — a
          patient can sound calm but have dangerous physiology.
        </div>
      </>
    ),
  },
  tewsExample: {
    title: 'Worked TEWS example',
    body: (
      <>
        <p>
          For HR = 125 and RR = 26 with other vitals normal: f₁ = 2, f₂ = 2, f₃₋₆ = 0, so{' '}
          <strong>T = 4</strong> &rarr; Yellow band.
        </p>
        <div className="why">
          <strong>Why it matters:</strong> this concrete case shows how moderate vitals alone
          would under-triage chest pain — which is why fusion with language matters.
        </div>
      </>
    ),
  },

  // ── Bayesian ──────────────────────────────────────────────────────
  bayesPosterior: {
    title: "Bayes' rule — colour posterior",
    body: (
      <>
        <p>
          <code>P(C_k | E) = P(E | C_k) · P(C_k) / Σⱼ P(E | C_j) · P(C_j)</code> updates our guess
          about colour <strong>C_k</strong> after seeing evidence <strong>E</strong>.
        </p>
        <ul>
          <li><strong>Prior P(C_k)</strong> — baseline colour frequency at the hospital (e.g. 50% Green).</li>
          <li><strong>Likelihood P(E | C_k)</strong> — how well this patient&apos;s symptoms fit each colour.</li>
          <li><strong>Denominator</strong> — normalises so all posteriors sum to 100%.</li>
        </ul>
        <div className="why">
          <strong>Why it matters:</strong> it combines historical rates with the current patient&apos;s
          specific evidence when BioBERT or vitals alone are insufficient.
        </div>
      </>
    ),
  },
  bayesEvidence: {
    title: 'Evidence vector E',
    body: (
      <>
        <p>
          <strong>E</strong> bundles everything we know about the patient: NLP entities extracted
          from the complaint (e.g. chest_pain, radiating_pain) plus any measured vitals (HR, RR,
          etc.).
        </p>
        <p>Missing vitals are simply omitted — E only contains what was observed.</p>
        <div className="why">
          <strong>Why it matters:</strong> Bayes needs structured inputs; E is how raw clinical data
          becomes numbers the formula can use.
        </div>
      </>
    ),
  },
  bayesArgmax: {
    title: 'argmax — pick the winner',
    body: (
      <>
        <p>
          <code>C_Bayes = argmax_k P(C_k | E)</code> selects the colour with the{' '}
          <strong>highest posterior probability</strong> after Bayes&apos; rule runs.
        </p>
        <p>Example: P(Orange | E) = 0.89 beats all others &rarr; C_Bayes = Orange.</p>
        <div className="why">
          <strong>Why it matters:</strong> this turns a full probability distribution into one
          actionable colour for fusion.
        </div>
      </>
    ),
  },
  bayesDisease: {
    title: 'Disease-level probability',
    body: (
      <>
        <p>
          <code>P(D | S) = P(S | D) · P(D) / P(S)</code> estimates whether a{' '}
          <strong>specific serious disease</strong> (e.g. myocardial infarction) is present given
          symptom pattern S.
        </p>
        <div className="why">
          <strong>Why it matters:</strong> some symptom patterns are so dangerous that they
          warrant an upgrade even when vitals look mild — this catches those cases.
        </div>
      </>
    ),
  },
  bayesOverride: {
    title: 'Disease override rule',
    body: (
      <>
        <p>
          If <code>P(D | S) &gt; τ_B</code> (a disease-confidence threshold, e.g. 0.75), the system
          <strong> forces</strong> C_Bayes to Red or Orange per protocol — bypassing a reassuring
          TEWS score.
        </p>
        <p>Example: crushing chest pain with P(MI | S) = 0.82 &rarr; upgrade despite T = 2 (Green).</p>
        <div className="why">
          <strong>Why it matters:</strong> this is a hard safety net for classic red-flag presentations
          that vitals alone might miss.
        </div>
      </>
    ),
  },
  bayesWhenRuns: {
    title: 'When does Bayesian run?',
    body: (
      <>
        <ul>
          <li><strong>Missing vitals</strong> — partial TEWS only; incomplete physiological picture.</li>
          <li><strong>Low BioBERT confidence</strong> — max(ŷ) &lt; τ ≈ 0.85; model is uncertain.</li>
          <li><strong>Fusion conflict</strong> — language and vitals disagree; Bayesian breaks the tie.</li>
        </ul>
        <div className="why">
          <strong>Why it matters:</strong> Bayesian is the fallback layer — it only activates when
          the primary signals are weak or contradictory.
        </div>
      </>
    ),
  },
  workedChestFusion: {
    title: 'End-to-end fusion resolution',
    body: (
      <>
        <p>
          This formula shows all three layers for a KATH chest-pain case: language says Orange,
          TEWS alone says Yellow (T = 4), Bayesian posterior favours Orange at ~89%.
        </p>
        <p>
          Fusion applies the safety rule — final <strong>C = Orange</strong> because symptoms and
          Bayesian both demand higher urgency than vitals alone.
        </p>
        <div className="why">
          <strong>Why it matters:</strong> it demonstrates the system failing safe — a patient with
          crushing chest pain is never sent to Minors just because HR/RR are only moderately elevated.
        </div>
      </>
    ),
  },
};

export default INFO;
