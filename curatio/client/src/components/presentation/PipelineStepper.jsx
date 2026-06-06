import styled from 'styled-components';

export const StepBadge = styled.span`
  display: inline-block;
  padding: 5px 14px;
  background: #dcfce7;
  color: #166534;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  margin-bottom: 0.25rem;
`;

export const PipelineProgress = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  overflow-x: auto;
  padding: 0.75rem 0;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

export const ProgressStep = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;

  .dot {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 800;
    background: ${p => (p.$active ? '#166534' : p.$done ? '#22c55e' : '#e2e8f0')};
    color: ${p => (p.$active || p.$done ? '#fff' : '#94a3b8')};
    border: 2px solid ${p => (p.$active ? '#166534' : p.$done ? '#22c55e' : '#e2e8f0')};
  }

  .label {
    margin-left: 6px;
    margin-right: 10px;
    font-size: 0.78rem;
    font-weight: ${p => (p.$active ? 700 : 500)};
    color: ${p => (p.$active ? '#166534' : p.$done ? '#475569' : '#94a3b8')};
    white-space: nowrap;
  }

  .line {
    width: 20px;
    height: 2px;
    background: ${p => (p.$done ? '#22c55e' : '#e2e8f0')};
    margin-right: 10px;
  }
`;

export const PIPELINE_STEPS = [
  { id: 1, label: 'Input' },
  { id: 2, label: 'Text example' },
  { id: 3, label: 'Speech / translate' },
  { id: 4, label: 'BioBERT' },
  { id: 5, label: 'Fusion' },
];

export const PipelineStepper = ({ currentStep }) => (
  <PipelineProgress>
    {PIPELINE_STEPS.map((step, i) => (
      <ProgressStep key={step.id} $active={step.id === currentStep} $done={step.id < currentStep}>
        <span className="dot">{step.id}</span>
        <span className="label">{step.label}</span>
        {i < PIPELINE_STEPS.length - 1 && <span className="line" />}
      </ProgressStep>
    ))}
  </PipelineProgress>
);
