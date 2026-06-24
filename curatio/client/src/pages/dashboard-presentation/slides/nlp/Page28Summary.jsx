import React from 'react';
import {
  CompactSlideContainer,
  LeadText,
  ComplaintQuote,
  SectionTitle,
} from '../../../../components/presentation/SlideLayout';
import { EndToEndDiagram } from '../../../../components/presentation/diagrams/NlpDiagrams';
import MathSection from '../../../../components/presentation/MathSection';
import { NLP_CHAIN, ACUITY_SOFTMAX } from '../../../../components/presentation/equations';
import { RUNNING_COMPLAINT } from './nlpShared';

export const Page28 = () => (
  <CompactSlideContainer>
    <SectionTitle>End-to-End: Complaint → Yellow (72%)</SectionTitle>
    <ComplaintQuote>{RUNNING_COMPLAINT}</ComplaintQuote>
    <EndToEndDiagram />
    <MathSection
      title="Full NLP chain"
      equations={[
        { latex: NLP_CHAIN, label: 'Pipeline', info: 'chiefComplaint' },
        { latex: ACUITY_SOFTMAX, label: 'Output ŷ', info: 'softmaxHead' },
      ]}
      compact
      flipMinHeight={140}
    />
    <LeadText style={{ fontSize: '0.85rem' }}>
      Tokenise → embed → 12 transformer layers → [CLS] summary → softmax → <strong>Yellow (72%)</strong>.
      Fusion with TEWS and Bayesian pathways may adjust the final colour C — never below a strong language signal.
    </LeadText>
  </CompactSlideContainer>
);
