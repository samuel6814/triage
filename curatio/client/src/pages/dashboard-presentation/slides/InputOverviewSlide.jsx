import React from 'react';
import { SlideContainer, LeadText } from '../../../components/presentation/SlideLayout';
import PlainEnglish from '../../../components/presentation/PlainEnglish';
import { PipelineStepper, StepBadge } from '../../../components/presentation/PipelineStepper';
import {
  PatientInputForkDiagram,
  SymptomPipelineRoadmap,
} from '../../../components/presentation/FlowDiagram';

const InputOverviewSlide = () => (
  <SlideContainer>
    <StepBadge>Step 1 of 5 — Patient input</StepBadge>
    <PipelineStepper currentStep={1} />

    <LeadText>
      Every triage session begins with the <strong>patient describing their symptoms</strong> through
      the Curatio chatbot — either by <strong>typing a message</strong> or by sending a{' '}
      <strong>voice note</strong> (audio).
    </LeadText>

    <PatientInputForkDiagram />

    <PlainEnglish title="Two ways in, one pipeline ahead">
      <ul>
        <li><strong>Typed text</strong> — patient writes their complaint in the chat window (e.g. &quot;I have chest pain&quot;)</li>
        <li><strong>Voice / audio</strong> — patient records a voice note in Twi or another local Ghanaian language</li>
      </ul>
    </PlainEnglish>

    <SymptomPipelineRoadmap highlightStep={1} />

    <PlainEnglish>
      <p>
        Over the next slides we follow this path step by step: text example → speech transcription
        and translation → fine-tuned BioBERT → fusion to a final SATS colour. Vital signs (TEWS)
        and Bayesian fallback join at the fusion stage.
      </p>
    </PlainEnglish>
  </SlideContainer>
);

export default InputOverviewSlide;
