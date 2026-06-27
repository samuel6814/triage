import React from 'react';
import {
  BeamerSlideContainer,
  BodyText,
  CaptionText,
  DiagramBox,
  VariableTable,
} from '../../../../components/presentation/SlideLayout';
import MathSection from '../../../../components/presentation/MathSection';
import { AttentionFlow } from '../../../../components/presentation/diagrams/NlpDiagrams';
import {
  ATTENTION,
  ATTENTION_QKV,
} from '../../../../components/presentation/equations';

export const Page18 = () => (
  <BeamerSlideContainer>
    <DiagramBox $minHeight="380px" $maxHeight="480px">
      <AttentionFlow />
    </DiagramBox>
  </BeamerSlideContainer>
);

export const Page19 = () => (
  <BeamerSlideContainer>
    <BodyText>From Vaswani et al. (2017):</BodyText>
    <MathSection
      title="Self-attention equation"
      equations={[
        { latex: ATTENTION_QKV, label: 'Q, K, V projections', info: 'attentionQKV' },
        { latex: ATTENTION, label: 'Attention output', info: 'attention' },
      ]}
      compact
      flipMinHeight={120}
    />
    <VariableTable>
      <thead>
        <tr><th>Symbol</th><th>Definition</th><th>Role in triage</th></tr>
      </thead>
      <tbody>
        <tr><td>Q</td><td>Query matrix = H W_Q</td><td>&quot;What is this token looking for?&quot;</td></tr>
        <tr><td>K</td><td>Key matrix = H W_K</td><td>&quot;What does each token offer?&quot;</td></tr>
        <tr><td>V</td><td>Value matrix = H W_V</td><td>Semantic content passed forward</td></tr>
        <tr><td>d_k</td><td>Key dimension (= 64 per head)</td><td>Scaling factor</td></tr>
        <tr><td>QKᵀ</td><td>Pairwise relevance scores</td><td>&quot;headache&quot; ↔ &quot;feverish&quot; co-attend</td></tr>
        <tr><td>√d_k</td><td>Prevents dot products exploding</td><td>Training stability</td></tr>
      </tbody>
    </VariableTable>
    <CaptionText>
      Worked weights for query &quot;headache&quot;: feverish 0.41, headache 0.32, weak 0.18, filler words ≈ 0.02.
    </CaptionText>
  </BeamerSlideContainer>
);
