import React from 'react';
import {
  CompactSlideContainer,
  LeadText,
} from '../../../../components/presentation/SlideLayout';
import MathSection from '../../../../components/presentation/MathSection';
import { AttentionFlow } from '../../../../components/presentation/diagrams/NlpDiagrams';
import {
  ATTENTION,
  ATTENTION_QKV,
} from '../../../../components/presentation/equations';

const VARS = [
  ['Q', 'Query — what is this token looking for?'],
  ['K', 'Key — what does each token offer?'],
  ['V', 'Value — content mixed after weights'],
  ['d_k', 'Key dimension — √d_k scales dot products'],
  ['H', 'Hidden state matrix from previous layer'],
  ['W_Q, W_K, W_V', 'Learned projection matrices'],
];

export const Page18 = () => (
  <CompactSlideContainer>
    <AttentionFlow />
    <LeadText style={{ fontSize: '0.85rem' }}>
      For our complaint, tokens like feverish and weak attend strongly to headache — building clinical context.
    </LeadText>
  </CompactSlideContainer>
);

export const Page19 = () => (
  <CompactSlideContainer>
    <MathSection
      title="Self-attention equation"
      equations={[
        { latex: ATTENTION_QKV, label: 'Q, K, V projections', info: 'attentionQKV' },
        { latex: ATTENTION, label: 'Attention output', info: 'attention' },
      ]}
      compact
      flipMinHeight={160}
    />
    <dl style={{
      display: 'grid',
      gridTemplateColumns: 'auto 1fr',
      gap: '0.3rem 1rem',
      margin: 0,
      padding: '0.75rem',
      background: '#f8fafc',
      borderRadius: '8px',
      fontSize: '0.82rem',
    }}
    >
      {VARS.map(([sym, desc]) => (
        <React.Fragment key={sym}>
          <dt style={{ fontWeight: 700, color: '#166534' }}>{sym}</dt>
          <dd style={{ margin: 0, color: '#475569' }}>{desc}</dd>
        </React.Fragment>
      ))}
    </dl>
  </CompactSlideContainer>
);
