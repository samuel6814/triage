import React from 'react';
import {
  CompactSlideContainer,
  LeadText,
} from '../../../../components/presentation/SlideLayout';
import MathSection from '../../../../components/presentation/MathSection';
import { DualPathwayDiagram } from '../../../../components/presentation/diagrams/NlpDiagrams';
import { FUSION_SAFETY } from '../../../../components/presentation/equations';

export const Page04 = () => (
  <CompactSlideContainer>
    <DualPathwayDiagram />
    <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#475569', fontSize: '0.88rem' }}>
      <li>
        <strong>TEWS:</strong> Deterministic sum of vital-sign points from SATS tables.
      </li>
      <li>
        <strong>NLP:</strong> Probabilistic classifier on chief-complaint text — catches symptoms before vitals.
      </li>
      <li>
        <strong>Safety rule:</strong> Fusion never assigns a less urgent colour than a strong language signal requires.
      </li>
    </ul>
    <MathSection
      title="Fusion safety rule"
      equations={[{
        latex: FUSION_SAFETY,
        label: 'Safety ordering',
        info: 'fusionSafetyNlp',
      }]}
      compact
      flipMinHeight={120}
    />
  </CompactSlideContainer>
);
