import React from 'react';

/* ── Voice / ASR ── */
export const voicePipelineExample = {
  title: 'Patient TG-001 speaks in Twi',
  content: (
    <>
      <ol>
        <li><strong>audio:</strong> Voice note — &quot;Me koma mu yɛ me ya, me home yɛ me&quot;</li>
        <li><strong>g_ASR:</strong> Transcript → <code>Me koma mu yɛ me ya</code> (Twi text)</li>
        <li><strong>g_trans:</strong> English → <code>I have chest pain, I feel unwell</code></li>
        <li><strong>X =</strong> that English string → sent to BioBERT in Step 4</li>
      </ol>
      <div className="result">Formula applied: X = g_trans(g_ASR(audio)) ✓</div>
    </>
  ),
};

/* ── BioBERT pipeline ── */
export const nlpChainExample = {
  title: 'Chief complaint: thunderclap headache',
  content: (
    <>
      <ol>
        <li><strong>X:</strong> &quot;thunderclap headache, worsening with movement&quot;</li>
        <li><strong>τ:</strong> → tokens: [thunder, ##clap, head, ##ache, …]</li>
        <li><strong>12 layers:</strong> model links &quot;thunderclap&quot; + &quot;headache&quot; → neurological urgency</li>
        <li><strong>head → ŷ:</strong> predicts acuity Level 2 (highly urgent)</li>
      </ol>
      <div className="result">Output: ŷ = [0.01, 0.94, 0.03, 0.01, 0.01] → Level 2</div>
    </>
  ),
};

export const acuitySoftmaxExample = {
  title: 'How softmax picks the level',
  content: (
    <>
      <table>
        <thead><tr><th>Level</th><th>Meaning</th><th>Probability</th></tr></thead>
        <tbody>
          <tr><td>1</td><td>Most urgent</td><td>1%</td></tr>
          <tr><td>2</td><td>Highly urgent</td><td><strong>94%</strong></td></tr>
          <tr><td>3</td><td>Moderate</td><td>3%</td></tr>
          <tr><td>4–5</td><td>Routine</td><td>2%</td></tr>
        </tbody>
      </table>
      <div className="result">Prediction = Level 2 (highest %) → maps to Orange SATS band</div>
    </>
  ),
};

export const confidenceExample = {
  title: 'When confidence triggers Bayesian',
  content: (
    <>
      <p><strong>High confidence (passes):</strong> max(ŷ) = 0.94 &gt; τ = 0.85 → trust BioBERT.</p>
      <p><strong>Low confidence (flagged):</strong> Patient TG-7OKLDLKAQ — glaucoma complaint:</p>
      <table>
        <thead><tr><th>Level</th><th>Probability</th></tr></thead>
        <tbody>
          <tr><td>2</td><td>85.4%</td></tr>
          <tr><td>3</td><td>14.1%</td></tr>
        </tbody>
      </table>
      <div className="result">0.854 &lt; 0.85? Borderline → fusion may call Bayesian fallback</div>
    </>
  ),
};

/* ── Fusion pipeline ── */
export const fusionFunctionExample = {
  title: 'Chest pain patient at KATH',
  content: (
    <>
      <table>
        <thead><tr><th>Input</th><th>Value</th><th>Suggests</th></tr></thead>
        <tbody>
          <tr><td>BioBERT ŷ</td><td>Level 2, 94% conf</td><td>Orange</td></tr>
          <tr><td>TEWS T</td><td>4</td><td>Yellow</td></tr>
          <tr><td>Bayesian P</td><td>P(Orange|E)=0.89</td><td>Orange</td></tr>
        </tbody>
      </table>
      <div className="result">f_fusion → C = Orange (symptoms beat mild vitals)</div>
    </>
  ),
};

/* ── TEWS ── */
export const tewsSumExample = {
  title: 'Vitals for one patient',
  content: (
    <>
      <table>
        <thead><tr><th>Vital</th><th>Value</th><th>f_k</th><th>Pts</th></tr></thead>
        <tbody>
          <tr><td>HR (v₃)</td><td>125 bpm</td><td>f₁(125)</td><td>2</td></tr>
          <tr><td>RR (v₂)</td><td>26/min</td><td>f₂(26)</td><td>2</td></tr>
          <tr><td>Mobility</td><td>Walking</td><td>f₃</td><td>0</td></tr>
          <tr><td>Temp, AVPU, trauma</td><td>Normal</td><td>0 each</td><td>0</td></tr>
        </tbody>
      </table>
      <div className="result">T = 2 + 2 + 0 = 4 → Yellow from vitals alone</div>
    </>
  ),
};

export const tewsColourExample = {
  title: 'T = 4 lookup',
  content: (
    <>
      <p>Patient TEWS total <strong>T = 4</strong> falls in the band 3 ≤ T ≤ 4.</p>
      <div className="result">C_TEWS(T) = Yellow — urgent, physician within 60 min</div>
      <p style={{ marginTop: 8 }}>At fusion: BioBERT may still upgrade to Orange if symptoms are stronger.</p>
    </>
  ),
};

export const tewsWorkedExample = {
  title: 'Plugging numbers into the formula',
  content: (
    <>
      <p>f₁(125) = 2 because 111 ≤ 125 ≤ 129</p>
      <p>f₂(26) = 2 because 21 ≤ 26 ≤ 29</p>
      <p>f₃, f₄, f₅, f₆ = 0 (all normal)</p>
      <div className="result">T = 4 → C_TEWS = Yellow. Fusion may output Orange if chest pain present.</div>
    </>
  ),
};

export const tewsHrExample = {
  title: 'HR = 125 bpm',
  content: (
    <>
      <p>Check f₁ table top to bottom:</p>
      <ul>
        <li>125 ≥ 130? No</li>
        <li>111 ≤ 125 ≤ 129? <strong>Yes → 2 points</strong></li>
      </ul>
      <div className="result">f₁(125) = 2</div>
    </>
  ),
};

export const tewsRrExample = {
  title: 'RR = 26 breaths/min',
  content: (
    <>
      <ul>
        <li>26 ≥ 30? No</li>
        <li>21 ≤ 26 ≤ 29? <strong>Yes → 2 points</strong></li>
      </ul>
      <div className="result">f₂(26) = 2</div>
    </>
  ),
};

export const tewsPartialExample = {
  title: 'Only HR and RR measured',
  content: (
    <>
      <p>K_obs = {'{HR, RR}'} — temperature and BP missing.</p>
      <p>T_partial = f₁(125) + f₂(26) = 4</p>
      <p><code>tews_incomplete = true</code></p>
      <div className="result">Fusion cannot assign Green on partial data → Bayesian argmax P(C_k|E)</div>
    </>
  ),
};

/* ── Bayesian ── */
export const bayesPosteriorExample = {
  title: 'Chest pain, partial vitals at KATH',
  content: (
    <>
      <table>
        <thead><tr><th>Colour</th><th>Prior P(C_k)</th><th>P(E|C_k)</th><th>P(C_k|E)</th></tr></thead>
        <tbody>
          <tr><td>Red</td><td>5%</td><td>Low</td><td>8%</td></tr>
          <tr><td>Orange</td><td>15%</td><td>High</td><td><strong>89%</strong></td></tr>
          <tr><td>Yellow</td><td>30%</td><td>Medium</td><td>2%</td></tr>
          <tr><td>Green</td><td>50%</td><td>Very low</td><td>1%</td></tr>
        </tbody>
      </table>
      <div className="result">Denominator normalises to 100%. Orange wins at 89%.</div>
    </>
  ),
};

export const bayesArgmaxExample = {
  title: 'Pick highest posterior',
  content: (
    <>
      <p>P(Red|E)=0.08, P(Orange|E)=<strong>0.89</strong>, P(Yellow|E)=0.02, P(Green|E)=0.01</p>
      <div className="result">C_Bayes = argmax = Orange → feeds fusion step 6</div>
    </>
  ),
};

export const bayesDiseaseExample = {
  title: 'Central chest pain, calm vitals',
  content: (
    <>
      <p><strong>S:</strong> crushing central chest pain, radiating to arm</p>
      <p><strong>P(D|S)</strong> for MI ≈ 0.82 &gt; τ_B = 0.75</p>
      <div className="result">Disease override → upgrade to Red/Orange even if T = 2 (Green vitals)</div>
    </>
  ),
};

export const bayesEvidenceExample = {
  title: 'Building evidence vector E',
  content: (
    <>
      <p><strong>From NLP:</strong> entity_1 = chest_pain, entity_2 = radiating_pain</p>
      <p><strong>From vitals:</strong> HR = 125, RR = 26 (temp missing)</p>
      <div className="result">E = [chest_pain, radiating_pain, HR=125, RR=26] → used in P(C_k|E)</div>
    </>
  ),
};

export const bayesOverrideExample = {
  title: 'Override fires',
  content: (
    <>
      <p>P(MI | crushing chest pain) = 0.82 &gt; τ_B = 0.75</p>
      <div className="result">C_Bayes = Red (or Orange per protocol) — bypasses mild TEWS</div>
    </>
  ),
};

/* ── Fusion deep dive ── */
export const fusionOrdExample = {
  title: 'Comparing ranks',
  content: (
    <>
      <p>TEWS says Yellow → ord = 2</p>
      <p>Language says Orange → ord = 3</p>
      <div className="result">max(2, 3) = 3 → final C = Orange (higher rank wins)</div>
    </>
  ),
};

export const fusionSafetyExample = {
  title: 'Safety rule applied',
  content: (
    <>
      <p>C_disc = Orange (ord 3), C_TEWS = Yellow (ord 2), C_Bayes = Orange (ord 3)</p>
      <p>ord(C) ≥ max(3, 2, 3) → ord(C) ≥ 3</p>
      <div className="result">C = Orange — patient never downgraded to Yellow queue</div>
    </>
  ),
};

/* ── BioBERT training ── */
export const mlmLossExample = {
  title: 'Pre-training fill-in-the-blank',
  content: (
    <>
      <p>Sentence: &quot;The patient presented with severe ___ pain&quot;</p>
      <p>Masked token in ℳ: <code>chest</code></p>
      <p>Model predicts from context → loss drops when prediction = chest</p>
      <div className="result">After millions of sentences, BioBERT understands medical language</div>
    </>
  ),
};

export const trainingLossExample = {
  title: 'One training row',
  content: (
    <>
      <p><strong>X_i:</strong> &quot;contraception advice, intermittent&quot;</p>
      <p><strong>y_i (nurse):</strong> Level 5 (non-urgent)</p>
      <p><strong>Model guess:</strong> P(Level 5|X) = 0.97 → low loss</p>
      <div className="result">ℒ adds −log(0.97) ≈ 0.03 — small error, weights adjust slightly</div>
    </>
  ),
};

/* ── BioBERT inference ── */
export const tokenEmbedExample = {
  title: 'Token &quot;chest&quot; in context',
  content: (
    <>
      <p>E_word(&quot;chest&quot;) = medical body-part vector</p>
      <p>E_pos(3) = position 3 in sentence</p>
      <p>E_seg = sentence A</p>
      <div className="result">E(chest) = sum of three vectors → fed into layer 1</div>
    </>
  ),
};

export const attentionExample = {
  title: '&quot;crushing chest pain&quot;',
  content: (
    <>
      <p>When processing &quot;chest&quot;, attention weights:</p>
      <table>
        <thead><tr><th>Token</th><th>Weight</th></tr></thead>
        <tbody>
          <tr><td>crushing</td><td>0.38</td></tr>
          <tr><td>chest</td><td>0.35</td></tr>
          <tr><td>pain</td><td>0.22</td></tr>
          <tr><td>I, the, …</td><td>&lt; 0.05</td></tr>
        </tbody>
      </table>
      <div className="result">Clinical words dominate — filler words ignored</div>
    </>
  ),
};

export const transformerLayerExample = {
  title: 'One pass through layer 5',
  content: (
    <>
      <p>Input H⁽⁴⁾ → multi-head attention mixes &quot;crushing&quot; + &quot;chest&quot; + &quot;pain&quot;</p>
      <p>FFN adds non-linear pattern detection</p>
      <p>LayerNorm stabilises → output H⁽⁵⁾</p>
      <div className="result">Repeated 12 times → deep understanding of complaint</div>
    </>
  ),
};

export const clsHeadExample = {
  title: '[CLS] summary vector',
  content: (
    <>
      <p>Input: &quot;central crushing chest pain radiating to left arm&quot;</p>
      <p>h_[CLS] ∈ ℝ⁷⁶⁸ — one number per dimension summarising full sentence</p>
      <div className="result">This vector is what the classifier head reads — not individual words</div>
    </>
  ),
};

export const clsSoftmaxExample = {
  title: 'Classification output',
  content: (
    <>
      <p>W · h_[CLS] + b → raw scores → softmax → ŷ</p>
      <p>Level 2: 91%, Level 3: 6%, others: 3%</p>
      <div className="result">Prediction: Level 2, confidence = 0.91 → Orange pathway at fusion</div>
    </>
  ),
};

/* ── Worked example slide ── */
export const workedChestExample = {
  title: 'All layers → one colour',
  content: (
    <>
      <ol>
        <li>BioBERT: central chest pain → Orange signal (d &gt; τ)</li>
        <li>TEWS: T = 4 → Yellow alone</li>
        <li>Bayesian: P(Orange|E) = 0.89</li>
        <li>Fusion step 2: Orange discriminator wins</li>
      </ol>
      <div className="result">C = Orange → Majors ED + cardiology alert</div>
    </>
  ),
};

export const fusionFunctionDeepExample = {
  title: 'Algorithm 1 step 2 fires',
  content: (
    <>
      <p>D = high chest pain score, T = 4, P(Orange) = 0.89</p>
      <p>Step 1 (Red)? No. Step 2 (Orange discriminator)? <strong>Yes.</strong></p>
      <div className="result">C = Orange — checklist stops here; TEWS Yellow ignored</div>
    </>
  ),
};
