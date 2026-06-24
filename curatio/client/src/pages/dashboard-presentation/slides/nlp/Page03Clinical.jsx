import React from 'react';
import {
  CompactSlideContainer,
  LeadText,
  ComplaintQuote,
  TwoColumn,
} from '../../../../components/presentation/SlideLayout';
import { SatsBar } from '../../../../components/presentation/diagrams/NlpDiagrams';
import { RUNNING_COMPLAINT } from './nlpShared';

export const Page03 = () => (
  <CompactSlideContainer>
    <TwoColumn $ratio="1.1fr 0.9fr">
      <div>
        <img
          src="/assets/convo.jpg"
          alt="Patient chat conversation"
          style={{ width: '100%', maxHeight: '140px', objectFit: 'contain', borderRadius: '8px' }}
        />
        <SatsBar />
      </div>
      <div>
        <LeadText>
          <strong>Setting:</strong> Komfo Anokye Teaching Hospital (KATH), Kumasi — SATS triage.
        </LeadText>
        <LeadText>
          <strong>Chief complaint (running example):</strong>
        </LeadText>
        <ComplaintQuote>{RUNNING_COMPLAINT}</ComplaintQuote>
        <LeadText>
          How does a computer mathematically interpret this unstructured complaint and convert it
          into a triage colour?
        </LeadText>
        <LeadText style={{ fontSize: '0.82rem', fontStyle: 'italic', color: '#64748b' }}>
          The system supports triage staff; it does not diagnose disease or replace clinical judgment.
        </LeadText>
      </div>
    </TwoColumn>
  </CompactSlideContainer>
);
