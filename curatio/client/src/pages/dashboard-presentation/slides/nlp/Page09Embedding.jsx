import React from 'react';
import {
  CompactSlideContainer,
  LeadText,
  TwoColumn,
} from '../../../../components/presentation/SlideLayout';
import MathSection from '../../../../components/presentation/MathSection';
import { EMBEDDING_LOOKUP } from '../../../../components/presentation/equations';

export const Page09 = () => (
  <CompactSlideContainer>
    <LeadText>
      A token ID alone carries no meaning. The embedding layer converts each ID to a dense vector.
    </LeadText>
    <MathSection
      title="Embedding lookup"
      equations={[{
        latex: EMBEDDING_LOOKUP,
        label: 'ID → 768-d vector',
        info: 'embeddingLookup',
      }]}
      compact
      flipMinHeight={120}
    />
    <TwoColumn>
      <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem', color: '#475569' }}>
        <li><strong>V ≈ 30,000</strong> — vocabulary size (rows)</li>
        <li><strong>D = 768</strong> — embedding dimension (columns)</li>
        <li>Each row is a learned vector for one token ID</li>
        <li>Similar clinical words end up with similar vectors after training</li>
      </ul>
      <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '0.75rem', fontSize: '0.78rem' }}>
        <div style={{ fontWeight: 700, color: '#166534', marginBottom: '0.35rem' }}>Lookup table E_word</div>
        <div>Row 101 → [0.02, 0.11, …, 0.33]  <em>[CLS]</em></div>
        <div>Row 9643 → [0.44, 0.27, …, 0.61]  <em>fever</em></div>
        <div>Row 7994 → [0.31, -0.18, …, 0.09]  <em>head</em></div>
      </div>
    </TwoColumn>
  </CompactSlideContainer>
);

export const Page10 = () => (
  <CompactSlideContainer>
    <LeadText>
      Each of the 768 dimensions is <strong>learned</strong> — not hand-labelled. After training on
      medical text, some dimensions correlate with symptom severity, body region, or temporal patterns.
    </LeadText>
    <LeadText style={{ fontWeight: 700, color: '#166534' }}>What D₁ … D₇₆₈ represent</LeadText>
    <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem', color: '#475569' }}>
      <li>Individual dimensions have no fixed human label — meaning emerges from data</li>
      <li>fever and headache vectors differ most in dimensions that encode symptom type</li>
      <li>The full 768-d vector is the input to layer 1 of BioBERT</li>
      <li>Contextual layers then refine these numbers using attention across all tokens</li>
    </ul>
    <LeadText style={{ fontSize: '0.85rem', fontStyle: 'italic' }}>
      For our running complaint, fever and weak cluster in dimensions learned from similar PubMed abstracts.
    </LeadText>
  </CompactSlideContainer>
);
