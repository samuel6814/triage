import styled from 'styled-components';
import { SlideContainer, LeadText } from '../../../components/presentation/SlideLayout';
import PlainEnglish from '../../../components/presentation/PlainEnglish';
import ColourBadge from '../../../components/presentation/ColourBadge';
import { PipelineStepper, StepBadge } from '../../../components/presentation/PipelineStepper';

const ChatMock = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  overflow: hidden;
  max-width: 520px;
`;

const ChatHeader = styled.div`
  background: #166534;
  color: white;
  padding: 12px 16px;
  font-size: 0.9rem;
  font-weight: 600;
`;

const ChatBody = styled.div`
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Bubble = styled.div`
  align-self: flex-end;
  max-width: 85%;
  background: #dcfce7;
  border: 1px solid #bbf7d0;
  border-radius: 16px 16px 4px 16px;
  padding: 12px 16px;
  color: #1e293b;
  font-size: 0.95rem;
  line-height: 1.5;
`;

const CodeBlock = styled.pre`
  background: #1e293b;
  color: #e2e8f0;
  border-radius: 12px;
  padding: 1rem 1.25rem;
  font-size: 0.82rem;
  line-height: 1.65;
  overflow-x: auto;
  margin: 0;
`;

const ExampleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const TextExampleSlide = () => (
  <SlideContainer>
    <StepBadge>Step 2 of 5 — Example text input</StepBadge>
    <PipelineStepper currentStep={2} />

    <LeadText>
      If the patient <strong>types</strong> their complaint, the message is stored directly as raw
      text. Here is a real example from our training dataset — this becomes the input the system reads.
    </LeadText>

    <ChatMock>
      <ChatHeader>Curatio Triage Chat</ChatHeader>
      <ChatBody>
        <Bubble>
          thunderclap headache, worsening with movement
        </Bubble>
      </ChatBody>
    </ChatMock>

    <CodeBlock>{`{
  "patient_id": "TG-UXRGA9UCO",
  "chief_complaint_raw": "thunderclap headache, worsening with movement"
}`}</CodeBlock>

    <ExampleRow>
      <span style={{ color: '#475569', fontSize: '0.9rem' }}>Nurse ground truth:</span>
      <ColourBadge color="Orange" label="Acuity Level 2 — Highly urgent" />
    </ExampleRow>

    <PlainEnglish>
      <p>
        Typed English text moves to the next processing stage as <strong>Text X</strong> (max 128 tokens).
        If the patient used voice instead, we take the audio path on the next slide — ASR and translation
        first — before reaching BioBERT.
      </p>
    </PlainEnglish>
  </SlideContainer>
);

export default TextExampleSlide;
