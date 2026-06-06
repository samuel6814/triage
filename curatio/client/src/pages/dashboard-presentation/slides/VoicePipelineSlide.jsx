import React from 'react';
import styled from 'styled-components';
import { SlideContainer, LeadText } from '../../../components/presentation/SlideLayout';
import MathSection from '../../../components/presentation/MathSection';
import PlainEnglish from '../../../components/presentation/PlainEnglish';
import { PipelineStepper, StepBadge } from '../../../components/presentation/PipelineStepper';
import { AudioTranslateDiagram } from '../../../components/presentation/FlowDiagram';
import { VOICE_PIPELINE } from '../../../components/presentation/equations';
import { voicePipelineExample } from '../../../components/presentation/mathExamples';

const WalkthroughGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
`;

const WalkthroughStep = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 0.85rem 1rem;
  font-size: 0.85rem;
  color: #475569;
  line-height: 1.5;

  strong { color: #166534; }
`;

const VoicePipelineSlide = () => (
  <SlideContainer>
    <StepBadge>Step 3 of 5 — Speech & translation</StepBadge>
    <PipelineStepper currentStep={3} />

    <LeadText>
      If the patient sends <strong>audio</strong>, the system transcribes and translates to English.
      Every formula on this page has a <strong>“See worked example”</strong> flip button — use it
      during the presentation to show the maths applied to a real Twi voice note.
    </LeadText>

    <AudioTranslateDiagram />

    <MathSection
      title="Audio → English text pipeline"
      equations={[{
        latex: VOICE_PIPELINE,
        explanationTitle: 'Read inside → outside',
        explanation: (
          <p>
            Voice note → <code>g_ASR</code> (transcribe) → <code>g_trans</code> (translate if needed) →{' '}
            <strong>X</strong>. Typed English from Step 2 skips straight to X.
          </p>
        ),
        example: voicePipelineExample,
      }]}
      variables={[
        { symbol: 'g_ASR', meaning: 'Speech-to-text — sound → written words' },
        { symbol: 'g_trans', meaning: 'Twi / local language → medical English' },
        { symbol: 'X', meaning: 'English text for BioBERT (Step 4)' },
      ]}
      flipMinHeight={240}
    />

    <WalkthroughGrid>
      <WalkthroughStep><strong>Typed path:</strong> Step 2 text → X directly → BioBERT</WalkthroughStep>
      <WalkthroughStep><strong>Voice path:</strong> audio → ASR → translate → X → BioBERT</WalkthroughStep>
    </WalkthroughGrid>

    <PlainEnglish>
      <p>
        g_ASR = ears writing words down. g_trans = medical interpreter. BioBERT only reads English.
      </p>
    </PlainEnglish>
  </SlideContainer>
);

export default VoicePipelineSlide;
