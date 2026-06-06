import React from 'react';
import { SlideContainer, LeadText } from '../../../components/presentation/SlideLayout';
import MathSection from '../../../components/presentation/MathSection';
import PlainEnglish from '../../../components/presentation/PlainEnglish';
import DataTable from '../../../components/presentation/DataTable';
import { PipelineStepper, StepBadge } from '../../../components/presentation/PipelineStepper';
import { BioBERTFlowDiagram } from '../../../components/presentation/FlowDiagram';
import {
  NLP_CHAIN,
  ACUITY_SOFTMAX,
  CONFIDENCE,
} from '../../../components/presentation/equations';
import {
  nlpChainExample,
  acuitySoftmaxExample,
  confidenceExample,
} from '../../../components/presentation/mathExamples';

const BioBERTPipelineSlide = () => {
  const mappingRows = [
    { id: 1, acuity: 'Level 1–2', sats: 'Red / Orange', meaning: 'Highly urgent symptoms' },
    { id: 2, acuity: 'Level 3', sats: 'Yellow', meaning: 'Moderate urgency' },
    { id: 3, acuity: 'Level 4–5', sats: 'Green', meaning: 'Non-urgent / routine' },
  ];

  return (
    <SlideContainer>
      <StepBadge>Step 4 of 5 — Fine-tuned BioBERT layer</StepBadge>
      <PipelineStepper currentStep={4} />

      <LeadText>
        English text <strong>X</strong> passes through our fine-tuned BioBERT model. Each formula
        below has a <strong>flip button</strong> — click it to see how real patient data flows through
        the equation.
      </LeadText>

      <BioBERTFlowDiagram />

      <MathSection
        title="1. Text in → prediction out"
        equations={[
          {
            latex: NLP_CHAIN,
            label: 'The journey of text X',
            explanation: (
              <p>X is tokenised, encoded through 12 layers, then classified into an acuity level ŷ.</p>
            ),
            example: nlpChainExample,
          },
          {
            latex: ACUITY_SOFTMAX,
            label: 'Softmax picks the level',
            explanation: (
              <p>Converts raw scores into percentages over 5 acuity levels — highest wins.</p>
            ),
            example: acuitySoftmaxExample,
          },
          {
            latex: CONFIDENCE,
            label: 'Confidence gate',
            explanation: (
              <p>If max(ŷ) &lt; τ ≈ 0.85, flag for Bayesian fallback at fusion.</p>
            ),
            example: confidenceExample,
          },
        ]}
        variables={[
          { symbol: 'X', meaning: 'Chief complaint from chat or Step 3 (ASR + translate)' },
          { symbol: 'ŷ', meaning: 'Five probabilities — one per acuity level' },
        ]}
        compact
        flipMinHeight={260}
      />

      <DataTable
        columns={[
          { key: 'acuity', label: 'Predicted acuity' },
          { key: 'sats', label: 'Maps to SATS colour' },
          { key: 'meaning', label: 'Clinical meaning' },
        ]}
        rows={mappingRows}
      />

      <PlainEnglish title="What to tell the audience">
        <p>
          Fine-tuning taught BioBERT our hospital&apos;s phrasing. It answers &quot;how urgent does
          this sound?&quot; — that answer goes to fusion in Step 5 with vitals and Bayesian when needed.
        </p>
      </PlainEnglish>
    </SlideContainer>
  );
};

export default BioBERTPipelineSlide;
