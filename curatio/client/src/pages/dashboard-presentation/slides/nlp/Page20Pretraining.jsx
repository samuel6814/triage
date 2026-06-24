import React from 'react';
import {
  CompactSlideContainer,
  LeadText,
  TwoColumn,
} from '../../../../components/presentation/SlideLayout';
import MathSection from '../../../../components/presentation/MathSection';
import { MlmMask } from '../../../../components/presentation/diagrams/NlpDiagrams';
import { MLM_LOSS } from '../../../../components/presentation/equations';

export const Page20 = () => (
  <CompactSlideContainer>
    <LeadText>
      Before triage fine-tuning, BioBERT learned medical language on PubMed via Masked Language Modelling —
      ~15% of words hidden per sentence; model predicts the missing token from context.
    </LeadText>
    <MlmMask />
    <LeadText style={{ fontSize: '0.85rem' }}>
      Example: &quot;The patient presented with severe [MASK] pain&quot; → model learns chest, abdominal, etc.
      from surrounding clinical context.
    </LeadText>
  </CompactSlideContainer>
);

export const Page21 = () => (
  <CompactSlideContainer>
    <MathSection
      title="MLM loss (Phase 1 — medical school)"
      equations={[{
        latex: MLM_LOSS,
        label: 'ℒ_LM',
        info: 'mlmLoss',
      }]}
      compact
      flipMinHeight={180}
      explanation={
        <p>
          Sum of −log P over all masked positions M. High penalty when the model guesses the wrong medical word.
        </p>
      }
    />
    <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem', color: '#475569' }}>
      <li><strong>i ∈ M</strong> — masked word positions only</li>
      <li><strong>t_i</strong> — true hidden word (ground truth)</li>
      <li><strong>H^(L)</strong> — full context after 12 layers</li>
      <li><strong>θ</strong> — all weights updated during pre-training</li>
    </ul>
  </CompactSlideContainer>
);

export const Page22 = () => (
  <CompactSlideContainer>
    <TwoColumn>
      <div>
        <LeadText style={{ fontWeight: 700, color: '#166534' }}>Independent vs dependent</LeadText>
        <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem', color: '#475569' }}>
          <li><strong>Independent (input):</strong> visible tokens + position of [MASK]</li>
          <li><strong>Dependent (target):</strong> true word at masked position t_i</li>
          <li><strong>Prediction:</strong> P(t_i | context) from softmax over vocabulary</li>
        </ul>
      </div>
      <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '0.75rem', fontSize: '0.82rem' }}>
        <div><strong>Context:</strong> &quot;patient severe ___ pain&quot;</div>
        <div><strong>Target t_i:</strong> chest</div>
        <div><strong>P(chest)</strong> = 0.82 → penalty = −log(0.82) ≈ 0.20</div>
        <div><strong>P(abdominal)</strong> = 0.05 → if wrong, penalty ≈ 3.0</div>
      </div>
    </TwoColumn>
    <LeadText style={{ fontSize: '0.85rem' }}>
      After millions of PubMed sentences, BioBERT understands clinical grammar — then we fine-tune on triage labels.
    </LeadText>
  </CompactSlideContainer>
);
