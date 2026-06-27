import React from 'react';
import styled from 'styled-components';

const Strip = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.75rem;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #bbf7d0;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 600;
  color: #64748b;
  flex-shrink: 0;
  overflow: hidden;
  white-space: nowrap;
`;

const Stage = styled.span`
  color: ${(p) => (p.$active ? '#166534' : '#94a3b8')};
  font-weight: ${(p) => (p.$active ? 800 : 600)};
`;

const Arrow = styled.span`
  color: #cbd5e1;
  font-size: 0.65rem;
`;

const STAGES = [
  'Complaint', 'Pathways', 'Pipeline', 'Tokens', 'Embed', 'Encode',
  'Attention', 'Pre-train', 'Classify', 'Train', 'Result',
];

const stageIndexForStep = (step) => {
  if (step <= 1) return 0;
  if (step <= 2) return 1;
  if (step <= 3) return 2;
  if (step <= 9) return 3;
  if (step <= 13) return 5;
  if (step <= 15) return 7;
  if (step <= 17) return 8;
  if (step <= 20) return 9;
  return 10;
};

const RunningThread = ({ step, stageLabel, className }) => {
  const activeIdx = stageIndexForStep(step);
  const labels = stageLabel
    ? ['Complaint', stageLabel]
    : STAGES.filter((_, i) => i <= activeIdx || i === activeIdx);

  const display = stageLabel
    ? labels
    : STAGES.slice(0, activeIdx + 1);

  return (
    <Strip className={className}>
      {display.map((s, i) => (
        <React.Fragment key={`${s}-${i}`}>
          {i > 0 && <Arrow>→</Arrow>}
          <Stage $active={i === display.length - 1}>{s}</Stage>
        </React.Fragment>
      ))}
    </Strip>
  );
};

export default RunningThread;
