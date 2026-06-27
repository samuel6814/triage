import React from 'react';
import {
  BeamerSlideContainer,
  BeamerColumns,
  BodyText,
  DiagramBox,
  BulletList,
} from '../../../../components/presentation/SlideLayout';
import { NlpPipelineDiagram } from '../../../../components/presentation/diagrams/NlpDiagrams';

export const Page05 = () => (
  <BeamerSlideContainer>
    <BeamerColumns $ratio="58% 38%">
      <div>
        <DiagramBox $minHeight="70px">
          <NlpPipelineDiagram />
        </DiagramBox>
        <BulletList>
          <li><strong>Supervised learning</strong> on ~80,000 nurse-labeled chief complaints.</li>
          <li><strong>Output:</strong> Probabilities over 5 acuity levels → SATS colours (L1–2 Red/Orange; L3 Yellow; L4–5 Green).</li>
          <li>Bag-of-words fails: &quot;I do <em>not</em> have a fever&quot; vs &quot;I <em>do</em> have a fever&quot; look identical to a word counter.</li>
        </BulletList>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <BodyText style={{ fontWeight: 700, marginBottom: '0.75rem' }}>Classification (Supervised)</BodyText>
        <svg viewBox="0 0 120 120" width="160" height="160">
          <line x1="10" y1="110" x2="110" y2="110" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="10" y1="110" x2="10" y2="10" stroke="#94a3b8" strokeWidth="1.5" />
          <circle cx="30" cy="70" r="4" fill="#dc2626" />
          <circle cx="45" cy="85" r="4" fill="#dc2626" />
          <circle cx="40" cy="55" r="4" fill="#dc2626" />
          <circle cx="85" cy="25" r="4" fill="#16a34a" />
          <circle cx="95" cy="40" r="4" fill="#16a34a" />
          <circle cx="90" cy="60" r="4" fill="#16a34a" />
          <line x1="15" y1="25" x2="105" y2="95" stroke="#64748b" strokeWidth="1.5" strokeDasharray="5 4" />
        </svg>
        <BodyText style={{ marginTop: '0.75rem', textAlign: 'center' }}>
          <strong>Class imbalance:</strong> Level 3 (Yellow) = 36%; Level 1 (Red) = 4%.
        </BodyText>
      </div>
    </BeamerColumns>
  </BeamerSlideContainer>
);
