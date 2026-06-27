import React from 'react';
import styled, { keyframes } from 'styled-components';
import CaptionBar from './CaptionBar';
import DetailsDrawer from './DetailsDrawer';
import RunningThread from './animated/RunningThread';

const enterAnim = keyframes`
  from { opacity: 0; transform: scale(0.98); }
  to { opacity: 1; transform: scale(1); }
`;

const Frame = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  animation: ${enterAnim} 0.45s ease-out;
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
  letter-spacing: 0.02em;
`;

const StepNum = styled.span`
  font-size: 0.82rem;
  color: #94a3b8;
  font-weight: 600;
`;

const Stage = styled.div`
  flex: 1;
  min-height: 0;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
`;

const Canvas = styled.div`
  width: 100%;
  max-width: 960px;
  height: 100%;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  font-size: 1.05rem;
`;

export const PictorialFrame = React.forwardRef(({
  step,
  section,
  caption,
  stageLabel,
  equations = [],
  children,
}, ref) => (
  <Frame ref={ref} key={`frame-${step}`}>
    <Header>
      <SectionPill>{section}</SectionPill>
      <StepNum>{step} / 21</StepNum>
      <RunningThread step={step} stageLabel={stageLabel} />
    </Header>
    <Stage>
      <Canvas>{children}</Canvas>
      <DetailsDrawer equations={equations} />
    </Stage>
    {caption && <CaptionBar>{caption}</CaptionBar>}
  </Frame>
));

PictorialFrame.displayName = 'PictorialFrame';

export default PictorialFrame;
