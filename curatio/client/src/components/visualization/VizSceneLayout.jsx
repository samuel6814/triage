import React from 'react';
import styled from 'styled-components';
import MathBlock from '../presentation/MathBlock';
import InfoTooltip from '../presentation/InfoTooltip';
import { PlainEnglishBlock } from '../presentation/SlideLayout';
import {
  SceneShell,
  SceneHeader,
  StepBadge,
  SectionLabel,
  SceneBody,
  AnimationCanvas,
  MathPanel,
  NarrativeText,
} from './VisualizationSceneShell';

const EqRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  margin-bottom: 0.35rem;
`;

export const VizSceneLayout = React.forwardRef(({
  step,
  section,
  children,
  equations = [],
  plainEnglish,
}, ref) => (
  <SceneShell ref={ref}>
    <SceneHeader>
      <StepBadge>Step {step}</StepBadge>
      <SectionLabel>{section}</SectionLabel>
    </SceneHeader>
    <SceneBody>
      <AnimationCanvas>{children}</AnimationCanvas>
      <MathPanel>
        {equations.map((eq, i) => (
          <div key={i}>
            {eq.info && (
              <EqRow>
                <InfoTooltip topic={eq.info} />
              </EqRow>
            )}
            <MathBlock equation={eq.latex} compact />
          </div>
        ))}
        {plainEnglish && (
          <PlainEnglishBlock>
            <strong>In plain English</strong>
            {plainEnglish}
          </PlainEnglishBlock>
        )}
        {!plainEnglish && !equations.length && (
          <NarrativeText>Watch the animation — each step shows data flowing through BioBERT.</NarrativeText>
        )}
      </MathPanel>
    </SceneBody>
  </SceneShell>
));

VizSceneLayout.displayName = 'VizSceneLayout';
