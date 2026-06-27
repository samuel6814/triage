import React from 'react';
import styled, { keyframes } from 'styled-components';
import CaptionBar from './CaptionBar';
import AnimatedFormulaStrip from './AnimatedFormulaStrip';
import RunningThread from './animated/RunningThread';
import VizScaleWrapper from './VizScaleWrapper';

const enterAnim = keyframes`
  from { opacity: 0; transform: scale(0.98); }
  to { opacity: 1; transform: scale(1); }
`;

const Frame = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  animation: ${enterAnim} 0.45s ease-out;
  --viz-font-scale: 1.25;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  flex-shrink: 0;
  padding: 0 0.25rem;
  flex-wrap: wrap;
`;

const SectionPill = styled.span`
  display: inline-block;
  padding: 0.3rem 0.75rem;
  background: #ecfdf5;
  color: #166534;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 700;
`;

const StepNum = styled.span`
  font-size: 0.82rem;
  color: #94a3b8;
  font-weight: 600;
`;

const Stage = styled.div`
  flex: 1;
  min-height: calc(100vh - 200px);
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.25rem 0.5rem;
`;

const DiagramArea = styled.div`
  flex: 1;
  min-height: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const PictorialFrame = React.forwardRef(({
  step,
  section,
  caption,
  stageLabel,
  equations = [],
  formulaTerms = [],
  children,
}, ref) => (
  <Frame ref={ref} key={`frame-${step}`}>
    <Header>
      <SectionPill>{section}</SectionPill>
      <StepNum>{step} / 21</StepNum>
      <RunningThread step={step} stageLabel={stageLabel} />
    </Header>
    <Stage>
      <DiagramArea>
        <VizScaleWrapper contentKey={step}>
          {children}
        </VizScaleWrapper>
      </DiagramArea>
      <AnimatedFormulaStrip equations={equations} formulaTerms={formulaTerms} />
    </Stage>
    {caption && <CaptionBar>{caption}</CaptionBar>}
  </Frame>
));

PictorialFrame.displayName = 'PictorialFrame';

export default PictorialFrame;
