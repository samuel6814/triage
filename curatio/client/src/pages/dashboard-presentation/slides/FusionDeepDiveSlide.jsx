import React from 'react';
import styled from 'styled-components';
import { SlideContainer, LeadText } from '../../../components/presentation/SlideLayout';
import MathSection from '../../../components/presentation/MathSection';
import PlainEnglish from '../../../components/presentation/PlainEnglish';
import DataTable from '../../../components/presentation/DataTable';
import ColourBadge from '../../../components/presentation/ColourBadge';
import { FusionDiagram } from '../../../components/presentation/FlowDiagram';
import {
  FUSION_FUNCTION,
  FUSION_ORD,
  FUSION_SAFETY,
} from '../../../components/presentation/equations';
import {
  fusionFunctionDeepExample,
  fusionOrdExample,
  fusionSafetyExample,
} from '../../../components/presentation/mathExamples';

const OrderedList = styled.ol`
  margin: 0;
  padding-left: 1.25rem;
  color: #475569;
  line-height: 1.85;
  font-size: 0.92rem;
`;

const FusionDeepDiveSlide = () => {
  const conflictRows = [
    {
      id: 1,
      language: 'd_chest > τ (Orange)',
      tews: 'T = 4 → Yellow',
      result: <ColourBadge color="Orange" label="Orange" />,
    },
    {
      id: 2,
      language: 'Low D',
      tews: 'T ≥ 7 → Red',
      result: <ColourBadge color="Red" label="Red" />,
    },
    {
      id: 3,
      language: 'Ambiguous D',
      tews: 'Incomplete vitals',
      result: 'argmax P(C_k | E)',
    },
  ];

  return (
    <SlideContainer>
      <LeadText>
        Fusion is a priority checklist — flip each formula to see how a real chest-pain case
        moves through the rules.
      </LeadText>

      <FusionDiagram />

      <MathSection
        title="Fusion mathematics"
        equations={[
          {
            latex: FUSION_FUNCTION,
            explanation: <p>Three inputs → one colour via ordered rules.</p>,
            example: fusionFunctionDeepExample,
          },
          {
            latex: FUSION_ORD,
            label: 'Urgency ordering',
            explanation: <p>Red=4 down to Green=1 — higher rank wins conflicts.</p>,
            example: fusionOrdExample,
          },
          {
            latex: FUSION_SAFETY,
            label: 'Safety rule',
            explanation: <p>Final C never less urgent than any layer suggested.</p>,
            example: fusionSafetyExample,
          },
        ]}
        compact
        flipMinHeight={220}
      />

      <PlainEnglish title="Algorithm 1 — checklist">
        <OrderedList>
          <li>Life-threatening words? → Red</li>
          <li>Very urgent words (chest pain)? → Orange</li>
          <li>T &gt; 7? → Red &nbsp;|&nbsp; 5–6? → Orange &nbsp;|&nbsp; 3–4? → Yellow</li>
          <li>Missing vitals? → argmax P(C_k | E)</li>
          <li>Serious disease? → Red / Orange override</li>
          <li>Else → Green</li>
        </OrderedList>
      </PlainEnglish>

      <DataTable
        columns={[
          { key: 'language', label: 'Language (D)' },
          { key: 'tews', label: 'TEWS (T)' },
          { key: 'result', label: 'Final C' },
        ]}
        rows={conflictRows}
      />
    </SlideContainer>
  );
};

export default FusionDeepDiveSlide;
