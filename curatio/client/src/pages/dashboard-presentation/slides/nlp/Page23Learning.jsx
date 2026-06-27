import React from 'react';
import {
  BeamerSlideContainer,
  BodyText,
  CaptionText,
  InfoBox,
  PlainEnglishBlock,
  VariableTable,
  WorkedExampleBlock,
  ComplaintQuote,
} from '../../../../components/presentation/SlideLayout';
import MathSection from '../../../../components/presentation/MathSection';
import {
  ATTENTION_SOFTMAX,
  ACUITY_SOFTMAX,
  CHAIN_RULE,
  GRADIENT_DESCENT,
  TRIAGE_FINETUNE_LOSS,
} from '../../../../components/presentation/equations';
import { RUNNING_COMPLAINT } from './nlpShared';
import { SATS_COLORS } from '../../../../components/presentation/satsColors';

export const Page23 = () => (
  <BeamerSlideContainer>
    <BodyText>To assign mathematical weight to each word, raw scores are normalised:</BodyText>
    <MathSection
      title="Attention softmax"
      equations={[{
        latex: ATTENTION_SOFTMAX,
        label: 'α_j weights',
        info: 'attentionSoftmax',
      }]}
      compact
      flipMinHeight={100}
    />
    <VariableTable>
      <thead>
        <tr><th>Variable</th><th>Meaning</th></tr>
      </thead>
      <tbody>
        <tr><td>e_j</td><td>Raw attention score for token j (before normalisation)</td></tr>
        <tr><td>exp(e_j)</td><td>Forces positive values; amplifies large scores</td></tr>
        <tr><td>Σ_k exp(e_k)</td><td>Normalising constant — ensures all weights sum to 1</td></tr>
        <tr><td>α_j</td><td>Final attention weight for token j (a probability)</td></tr>
        <tr><td>m</td><td>Sequence length (number of tokens)</td></tr>
      </tbody>
    </VariableTable>
    <BodyText>
      <strong>Effect:</strong> &quot;I&quot;, &quot;a&quot;, &quot;and&quot; → α ≈ 0.01; &quot;headache&quot;, &quot;feverish&quot; → α ≈ 0.35+.
    </BodyText>
  </BeamerSlideContainer>
);

export const Page24 = () => (
  <BeamerSlideContainer>
    <BodyText>The summary vector is mapped to triage class probabilities:</BodyText>
    <MathSection
      title="Classification softmax"
      equations={[{
        latex: ACUITY_SOFTMAX,
        label: 'ŷ over 5 levels',
        info: 'softmaxHead',
      }]}
      compact
      flipMinHeight={100}
    />
    <VariableTable>
      <thead>
        <tr><th>Variable</th><th>Meaning</th></tr>
      </thead>
      <tbody>
        <tr><td>h_[CLS]</td><td>768-dim summary vector from final layer</td></tr>
        <tr><td>W ∈ ℝ⁵ˣ⁷⁶⁸</td><td>Learned classification weight matrix</td></tr>
        <tr><td>b ∈ ℝ⁵</td><td>Per-class bias terms</td></tr>
        <tr><td>ŷ_c</td><td>Probability of acuity level c ∈ {'{1, …, 5}'}</td></tr>
        <tr><td>Σ_c ŷ_c = 1</td><td>Valid probability distribution over 5 classes</td></tr>
      </tbody>
    </VariableTable>
    <WorkedExampleBlock>
      Worked example — our running complaint
      <ComplaintQuote style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>{RUNNING_COMPLAINT}</ComplaintQuote>
      Level 3 (Moderate): <strong>72%</strong> ⇒ maps to <span style={{ color: SATS_COLORS.yellow, fontWeight: 700 }}>Yellow</span>
    </WorkedExampleBlock>
  </BeamerSlideContainer>
);

export const Page25 = () => (
  <BeamerSlideContainer>
    <InfoBox style={{ marginBottom: '0.5rem' }}>
      <BodyText style={{ fontWeight: 700, color: '#166534' }}>1. Forward Pass</BodyText>
      <BodyText>y = Wx + b — where x = h_[CLS], y = predicted logits, W and b are learned.</BodyText>
    </InfoBox>
    <InfoBox style={{ marginBottom: '0.5rem' }}>
      <BodyText style={{ fontWeight: 700, color: '#166534' }}>2. Cross-Entropy Loss (The Penalty)</BodyText>
      <BodyText>ℒ = −Σᵢ yᵢ log(ŷᵢ) — where C = 5 acuity classes.</BodyText>
    </InfoBox>
    <VariableTable>
      <thead>
        <tr><th>Symbol</th><th>Meaning</th></tr>
      </thead>
      <tbody>
        <tr><td>x</td><td>Input vector (h_[CLS] — the complaint summary)</td></tr>
        <tr><td>W, b</td><td>Weights and bias the model must learn</td></tr>
        <tr><td>y</td><td>True one-hot nurse label (e.g. Level 3 = Yellow)</td></tr>
        <tr><td>ŷ</td><td>Model&apos;s predicted probability distribution</td></tr>
        <tr><td>ℒ</td><td>Loss — 0 if perfect; large if wrong with high confidence</td></tr>
      </tbody>
    </VariableTable>
    <CaptionText>
      Example: true label = Yellow, model predicts Green at 90% ⇒ ℒ = −log(0.05) ≈ 3.0.
    </CaptionText>
  </BeamerSlideContainer>
);

export const Page26 = () => (
  <BeamerSlideContainer>
    <InfoBox style={{ marginBottom: '0.5rem' }}>
      <BodyText style={{ fontWeight: 700, color: '#166534' }}>3. Backpropagation (The Investigation)</BodyText>
    </InfoBox>
    <MathSection
      title="Chain rule"
      equations={[{
        latex: CHAIN_RULE,
        label: '∂ℒ/∂W',
        info: 'backprop',
      }]}
      compact
      flipMinHeight={100}
    />
    <BulletListCompat />
    <PlainEnglishBlock>
      If the model confidently assigns 90% to Green when the nurse labeled Yellow, backprop finds exactly which weights in layers 8–12 over-weighted non-urgent patterns.
    </PlainEnglishBlock>
  </BeamerSlideContainer>
);

const BulletListCompat = () => (
  <ul style={{ margin: '0.5rem 0', paddingLeft: '1.35rem', fontSize: '1.05rem', color: '#475569', lineHeight: 1.65 }}>
    <li>Uses the <strong>chain rule</strong> of calculus to travel backward through all 12 layers + classification head</li>
    <li>z = Wh + b — pre-softmax logits (raw scores before probability conversion)</li>
    <li>Each partial derivative pinpoints which specific weight caused the bad guess</li>
    <li>Gradients flow from the loss at the top back to every embedding and attention weight</li>
  </ul>
);

export const Page27 = () => (
  <BeamerSlideContainer>
    <InfoBox style={{ marginBottom: '0.5rem' }}>
      <BodyText style={{ fontWeight: 700, color: '#166534' }}>4. Optimization (The Correction)</BodyText>
    </InfoBox>
    <MathSection
      title="Gradient descent"
      equations={[{
        latex: GRADIENT_DESCENT,
        label: 'W_new',
        info: 'gradientDescent',
      }]}
      compact
      flipMinHeight={100}
    />
    <VariableTable>
      <thead>
        <tr><th>Variable</th><th>Meaning</th></tr>
      </thead>
      <tbody>
        <tr><td>α</td><td>Learning rate (step size; e.g. 2 × 10⁻⁵)</td></tr>
        <tr><td>∂ℒ/∂W</td><td>Gradient — direction of steepest loss increase</td></tr>
        <tr><td>Minus sign (−)</td><td>Move opposite to gradient — go downhill on the loss surface</td></tr>
      </tbody>
    </VariableTable>
    <BodyText style={{ marginTop: '0.5rem' }}>
      <strong>Fine-tuning loss</strong> on triage data:
    </BodyText>
    <MathSection
      equations={[{
        latex: TRIAGE_FINETUNE_LOSS,
        label: 'ℒ_triage',
        info: 'fineTuneLoss',
      }]}
      compact
      flipMinHeight={80}
    />
    <CaptionText>
      Best eval_loss = 0.001812 after 3 epochs (13,500 steps) on nurse-labeled chief complaints.
    </CaptionText>
  </BeamerSlideContainer>
);
