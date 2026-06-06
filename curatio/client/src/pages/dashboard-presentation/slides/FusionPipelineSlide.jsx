import React from 'react';
import { SlideContainer, LeadText } from '../../../components/presentation/SlideLayout';
import MathSection from '../../../components/presentation/MathSection';
import PlainEnglish from '../../../components/presentation/PlainEnglish';
import ColourBadge from '../../../components/presentation/ColourBadge';
import { PipelineStepper, StepBadge } from '../../../components/presentation/PipelineStepper';
import { FusionPipelineDiagram } from '../../../components/presentation/FlowDiagram';
import { FUSION_FUNCTION } from '../../../components/presentation/equations';
import { fusionFunctionExample } from '../../../components/presentation/mathExamples';

const FusionPipelineSlide = () => (
  <SlideContainer>
    <StepBadge>Step 5 of 5 — Fusion → triage colour</StepBadge>
    <PipelineStepper currentStep={5} />

    <LeadText>
      Fusion combines BioBERT, TEWS, and Bayesian into one SATS colour <strong>C</strong>.
      Flip the formula to see a chest-pain patient worked through f_fusion.
    </LeadText>

    <FusionPipelineDiagram />

    <MathSection
      title="Fusion master controller"
      equations={[{
        latex: FUSION_FUNCTION,
        explanation: (
          <p>
            f_fusion is a safety checklist — not an average. It always picks the more urgent signal
            when layers disagree.
          </p>
        ),
        example: fusionFunctionExample,
      }]}
      variables={[
        { symbol: 'ŷ / D', meaning: 'BioBERT from Step 4' },
        { symbol: 'T', meaning: 'TEWS from vitals (parallel branch)' },
        { symbol: 'P', meaning: 'Bayesian when data is incomplete' },
        { symbol: 'C', meaning: 'Final colour → Ghana pathway' },
      ]}
      flipMinHeight={280}
    />

    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
      <span style={{ color: '#475569', fontSize: '0.9rem' }}>Example output:</span>
      <ColourBadge color="Orange" label="C = Orange → Majors (ED)" />
    </div>

    <PlainEnglish>
      <p>
        Next slides flip through TEWS and Bayesian formulas with their own worked examples, then
        the full mathematics deep dive.
      </p>
    </PlainEnglish>
  </SlideContainer>
);

export default FusionPipelineSlide;
