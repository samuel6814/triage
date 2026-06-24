import React from 'react';
import {
  CompactSlideContainer,
  LeadText,
  TwoColumn,
} from '../../../../components/presentation/SlideLayout';
import MathSection from '../../../../components/presentation/MathSection';
import { NlpPipelineDiagram } from '../../../../components/presentation/diagrams/NlpDiagrams';
import { BAG_OF_WORDS_FAIL } from '../../../../components/presentation/equations';

export const Page05 = () => (
  <CompactSlideContainer>
    <TwoColumn $ratio="1.2fr 0.8fr">
      <div>
        <NlpPipelineDiagram />
        <ul style={{ margin: '0.5rem 0 0', paddingLeft: '1.25rem', fontSize: '0.85rem', color: '#475569' }}>
          <li><strong>Supervised learning</strong> on ~80,000 nurse-labeled chief complaints.</li>
          <li><strong>Output:</strong> Probabilities over 5 acuity levels → SATS colours.</li>
          <li>Bag-of-words fails on negation and word order.</li>
        </ul>
      </div>
      <div>
        <LeadText style={{ fontWeight: 700, fontSize: '0.85rem' }}>Classification (Supervised)</LeadText>
        <svg viewBox="0 0 120 120" width="100%" style={{ maxWidth: '140px' }}>
          <line x1="10" y1="110" x2="110" y2="110" stroke="#94a3b8" />
          <line x1="10" y1="110" x2="10" y2="10" stroke="#94a3b8" />
          <circle cx="30" cy="70" r="3" fill="#dc2626" />
          <circle cx="45" cy="85" r="3" fill="#dc2626" />
          <circle cx="40" cy="55" r="3" fill="#dc2626" />
          <circle cx="85" cy="25" r="3" fill="#16a34a" />
          <circle cx="95" cy="40" r="3" fill="#16a34a" />
          <circle cx="90" cy="60" r="3" fill="#16a34a" />
          <line x1="15" y1="25" x2="105" y2="95" stroke="#64748b" strokeDasharray="4 3" />
        </svg>
        <LeadText style={{ fontSize: '0.82rem' }}>
          <strong>Class imbalance:</strong> Level 3 (Yellow) = 36%; Level 1 (Red) = 4%.
        </LeadText>
      </div>
    </TwoColumn>
    <MathSection
      title="Why not bag-of-words?"
      equations={[{
        latex: BAG_OF_WORDS_FAIL,
        label: 'BoW limitation',
        info: 'bagOfWords',
      }]}
      compact
      flipMinHeight={100}
    />
  </CompactSlideContainer>
);
