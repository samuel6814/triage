import React from 'react';
import styled from 'styled-components';
import { TokenChip } from '../VisualizationSceneShell';

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
`;

const Sentence = styled.p`
  margin: 0;
  font-size: 1.05rem;
  font-style: italic;
  color: #166534;
  text-align: center;
  max-width: 520px;
  line-height: 1.55;
`;

const ChipGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  justify-content: center;
  max-width: 560px;
`;

const ChipWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  opacity: 0;
  transform: scale(0.6);

  span.id {
    font-size: 0.68rem;
    color: #64748b;
    font-family: ui-monospace, monospace;
  }
`;

const SplitComplaint = ({ text, tokens, className }) => (
  <Wrap className={className}>
    <Sentence className="viz-full-sentence">{text}</Sentence>
    <ChipGrid className="viz-chip-grid">
      {tokens.map((t) => (
        <ChipWrap key={t.i} className="viz-flying-chip" data-id={t.id}>
          <TokenChip $highlight={t.token.includes('head') || t.token.includes('fever')}>{t.token}</TokenChip>
          <span className="id viz-chip-id">0</span>
        </ChipWrap>
      ))}
    </ChipGrid>
  </Wrap>
);

export default SplitComplaint;
