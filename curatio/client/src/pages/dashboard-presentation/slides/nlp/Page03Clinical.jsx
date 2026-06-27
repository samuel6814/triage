import React from 'react';
import {
  BeamerSlideContainer,
  BeamerColumns,
  LeadText,
  BodyText,
  CaptionText,
  ComplaintQuote,
  SlideFigure,
  DiagramBox,
} from '../../../../components/presentation/SlideLayout';
import { SatsBar } from '../../../../components/presentation/diagrams/NlpDiagrams';
import { RUNNING_COMPLAINT } from './nlpShared';

export const Page03 = () => (
  <BeamerSlideContainer>
    <BeamerColumns>
      <div>
        <SlideFigure>
          <img src="/assets/convo.jpg" alt="Patient chat conversation" />
        </SlideFigure>
        <DiagramBox $minHeight="100px">
          <SatsBar />
        </DiagramBox>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.75rem' }}>
        <LeadText>
          <strong>Setting:</strong> Komfo Anokye Teaching Hospital (KATH), Kumasi — <strong>SATS</strong> triage.
        </LeadText>
        <BodyText>
          <strong>Chief complaint (running example):</strong>
        </BodyText>
        <ComplaintQuote>{RUNNING_COMPLAINT}</ComplaintQuote>
        <BodyText>
          How does a computer mathematically interpret this simple, unstructured complaint and convert it
          into a triage colour?
        </BodyText>
        <CaptionText>
          The system supports triage staff; it does not diagnose disease or replace clinical judgment.
        </CaptionText>
      </div>
    </BeamerColumns>
  </BeamerSlideContainer>
);
