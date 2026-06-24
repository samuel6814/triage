import React from 'react';
import {
  CompactSlideContainer,
  LeadText,
} from '../../../../components/presentation/SlideLayout';
import MathSection from '../../../../components/presentation/MathSection';
import {
  ATTENTION_SOFTMAX,
  ACUITY_SOFTMAX,
  CROSS_ENTROPY,
  CHAIN_RULE,
  GRADIENT_DESCENT,
  TRAINING_LOSS,
} from '../../../../components/presentation/equations';

export const Page23 = () => (
  <CompactSlideContainer>
    <MathSection
      title="Attention softmax — the probability filter"
      equations={[{
        latex: ATTENTION_SOFTMAX,
        label: 'α_j weights',
        info: 'attentionSoftmax',
      }]}
      compact
      flipMinHeight={120}
      explanation={
        <p>
          Softmax converts raw compatibility scores e_j into weights that sum to 1 — a probability
          distribution over which tokens to listen to.
        </p>
      }
    />
  </CompactSlideContainer>
);

export const Page24 = () => (
  <CompactSlideContainer>
    <MathSection
      title="Classification softmax — acuity probabilities"
      equations={[{
        latex: ACUITY_SOFTMAX,
        label: 'ŷ over 5 levels',
        info: 'softmaxHead',
      }]}
      compact
      flipMinHeight={140}
      explanation={
        <p>
          For our headache/fever complaint: ŷ might show Yellow ≈ 72%, Green ≈ 18%, Orange ≈ 7% —
          argmax picks Yellow for routing.
        </p>
      }
    />
    <LeadText style={{ fontSize: '0.85rem' }}>
      Five outputs map to SATS colours: L1–2 → Red/Orange; L3 → Yellow; L4–5 → Green.
    </LeadText>
  </CompactSlideContainer>
);

export const Page25 = () => (
  <CompactSlideContainer>
    <MathSection
      title="Forward pass & cross-entropy (Phase 2 — residency)"
      equations={[
        { latex: TRAINING_LOSS, label: 'Fine-tune loss L', info: 'fineTuneLoss' },
        { latex: CROSS_ENTROPY, label: 'Per-class form', info: 'crossEntropy' },
      ]}
      compact
      flipMinHeight={160}
      explanation={
        <p>
          For each of ~80k training rows, compare nurse label y_i to model prediction ŷ_i.
          Wrong or low-confidence guesses produce large −log penalties.
        </p>
      }
    />
  </CompactSlideContainer>
);

export const Page26 = () => (
  <CompactSlideContainer>
    <MathSection
      title="Backpropagation — the chain rule"
      equations={[
        { latex: CHAIN_RULE, label: 'Chain rule', info: 'backprop' },
      ]}
      compact
      flipMinHeight={120}
      explanation={
        <p>
          Loss flows backward through softmax → classifier head → [CLS] → all 12 layers → embeddings.
          Each weight gets a gradient showing how to reduce ℒ.
        </p>
      }
    />
    <LeadText style={{ fontSize: '0.85rem' }}>
      Repeated over 13,500 steps × 3 epochs on mini-batches of 16 complaints.
    </LeadText>
  </CompactSlideContainer>
);

export const Page27 = () => (
  <CompactSlideContainer>
    <MathSection
      title="Gradient descent — weight update"
      equations={[{
        latex: GRADIENT_DESCENT,
        label: 'W_new',
        info: 'gradientDescent',
      }]}
      compact
      flipMinHeight={120}
      explanation={
        <p>
          Learning rate α ≈ 2×10⁻⁵ — small steps so weights do not overshoot. After many updates,
          BioBERT aligns with KATH nurse triage decisions.
        </p>
      }
    />
    <LeadText style={{ fontSize: '0.85rem' }}>
      Base checkpoint: Yuvrajxms09/biobert-triage-classifier — transfer learning from PubMed + triage pre-training.
    </LeadText>
  </CompactSlideContainer>
);
