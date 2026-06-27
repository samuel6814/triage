import React from 'react';
import {
  BeamerSlideContainer,
  LeadText,
  BodyText,
  BulletList,
  DiagramBox,
  PlainEnglishBlock,
  VariableTable,
} from '../../../../components/presentation/SlideLayout';
import MathSection from '../../../../components/presentation/MathSection';
import { MlmMask } from '../../../../components/presentation/diagrams/NlpDiagrams';
import { MLM_LOSS } from '../../../../components/presentation/equations';

export const Page20 = () => (
  <BeamerSlideContainer>
    <LeadText>
      Before triage fine-tuning, BioBERT learns medical English from PubMed via <strong>Masked Language Modeling (MLM)</strong>:
    </LeadText>
    <DiagramBox $minHeight="100px">
      <MlmMask />
    </DiagramBox>
    <BulletList>
      <li>15% of tokens randomly masked; model predicts them from <strong>bidirectional</strong> context</li>
      <li>Teaches medical vocabulary (&quot;feverish&quot;, &quot;headache&quot;, &quot;tachycardia&quot;) before any triage labels</li>
      <li>BioBERT = BERT pre-trained on PubMed + PMC biomedical abstracts</li>
    </BulletList>
  </BeamerSlideContainer>
);

export const Page21 = () => (
  <BeamerSlideContainer>
    <MathSection
      title="Masked Language Modeling Loss"
      equations={[{
        latex: MLM_LOSS,
        label: 'ℒ_LM',
        info: 'mlmLoss',
      }]}
      compact
      flipMinHeight={120}
    />
    <VariableTable>
      <thead>
        <tr><th>Variable</th><th>Meaning</th></tr>
      </thead>
      <tbody>
        <tr><td>ℳ</td><td>Set of masked token positions in the sentence</td></tr>
        <tr><td>t_i</td><td>The true (correct) word at masked position i</td></tr>
        <tr><td>H⁽ᴸ⁾</td><td>Final hidden states from all 12 layers — the context</td></tr>
        <tr><td>θ</td><td>All model parameters (weights + biases)</td></tr>
        <tr><td>P(t_i | ·)</td><td>Softmax probability the model assigns to the correct word</td></tr>
        <tr><td>ℒ_LM</td><td>Total penalty — lower = better word predictions</td></tr>
      </tbody>
    </VariableTable>
  </BeamerSlideContainer>
);

export const Page22 = () => (
  <BeamerSlideContainer>
    <BulletList>
      <li><strong>Independent variable (H⁽ᴸ⁾):</strong> The surrounding, unmasked context the model is allowed to read bidirectionally</li>
      <li><strong>Dependent variable (ℒ_LM):</strong> The loss penalty — its size depends entirely on P(t_i) the model assigned to the correct hidden word</li>
    </BulletList>
    <BodyText style={{ fontWeight: 700, marginTop: '0.5rem' }}>Numerical example:</BodyText>
    <BulletList>
      <li>Correct word = &quot;headache&quot;; model assigns P = 0.92 ⇒ contribution = −log(0.92) ≈ 0.08 (small penalty)</li>
      <li>Model assigns P = 0.01 to correct word ⇒ −log(0.01) ≈ 4.6 (large penalty)</li>
    </BulletList>
    <PlainEnglishBlock>
      After MLM pre-training on PubMed, BioBERT is fine-tuned on 80,000 triage-labeled chief complaints using cross-entropy loss — covered next.
    </PlainEnglishBlock>
  </BeamerSlideContainer>
);
