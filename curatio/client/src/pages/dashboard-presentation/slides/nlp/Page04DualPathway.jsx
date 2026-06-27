import React from 'react';
import {
  BeamerSlideContainer,
  DiagramBox,
  BulletList,
} from '../../../../components/presentation/SlideLayout';
import { DualPathwayDiagram } from '../../../../components/presentation/diagrams/NlpDiagrams';

export const Page04 = () => (
  <BeamerSlideContainer>
    <DiagramBox $minHeight="160px" $maxHeight="240px">
      <DualPathwayDiagram />
    </DiagramBox>
    <BulletList>
      <li><strong>TEWS:</strong> Deterministic sum of vital-sign points from SATS tables: T = Σₖ wₖ fₖ(vₖ).</li>
      <li><strong>NLP:</strong> Probabilistic classifier on chief-complaint text — catches symptoms before vitals are measured.</li>
      <li><strong>Safety rule:</strong> Fusion never assigns a less urgent colour than a strong language signal requires.</li>
    </BulletList>
  </BeamerSlideContainer>
);
