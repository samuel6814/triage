import React from 'react';
import {
  BeamerSlideContainer,
  BeamerColumns,
  LeadText,
  CaptionText,
  NumberedSteps,
  ComplaintQuote,
  DiagramBox,
} from '../../../../components/presentation/SlideLayout';
import { EndToEndDiagram } from '../../../../components/presentation/diagrams/NlpDiagrams';
import { RUNNING_COMPLAINT } from './nlpShared';
import { SATS_COLORS } from '../../../../components/presentation/satsColors';

export const Page28 = () => (
  <BeamerSlideContainer>
    <BeamerColumns>
      <div>
        <LeadText>
          <strong>Putting it all together</strong> for our running example:
        </LeadText>
        <NumberedSteps>
          <li>Patient says: <em>{RUNNING_COMPLAINT}</em></li>
          <li>Tokenize → embed → 12 transformer layers</li>
          <li>Self-attention weights &quot;headache&quot;, &quot;feverish&quot;, &quot;weak&quot; heavily</li>
          <li>h_[CLS] → softmax → Level 3 at 72%</li>
          <li>Fusion with TEWS vitals → final <span style={{ color: SATS_COLORS.yellow, fontWeight: 700 }}>Yellow</span> pathway</li>
        </NumberedSteps>
        <CaptionText style={{ marginTop: '0.75rem' }}>
          Trained on ~80,000 nurse-labeled complaints; BioBERT pre-trained on PubMed MLM.
        </CaptionText>
      </div>
      <DiagramBox $minHeight="320px">
        <EndToEndDiagram />
      </DiagramBox>
    </BeamerColumns>
  </BeamerSlideContainer>
);
