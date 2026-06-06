import React, { useMemo } from 'react';
import styled from 'styled-components';
import katex from 'katex';
import 'katex/dist/katex.min.css';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.span`
  font-size: 0.8rem;
  font-weight: 700;
  color: #166534;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const MathCard = styled.div`
  background: #1e293b;
  border-radius: 12px;
  padding: ${props => (props.$compact ? '1rem 1.25rem' : '1.5rem 2rem')};
  overflow-x: auto;
  box-shadow: inset 0 4px 20px rgba(0, 0, 0, 0.25);
  -webkit-overflow-scrolling: touch;

  .katex-display {
    margin: 0;
    text-align: center;
  }

  .katex {
    font-size: ${props => (props.$compact ? '1.05em' : '1.2em')};
    color: #f8fafc;
    white-space: nowrap;
  }

  .katex .mord,
  .katex .mop,
  .katex .mbin,
  .katex .mrel,
  .katex .mopen,
  .katex .mclose,
  .katex .mpunct,
  .katex .minner,
  .katex .mord.text,
  .katex .mathnormal,
  .katex .mathrm {
    color: #f8fafc;
  }

  .katex .frac-line {
    border-bottom-color: #f8fafc;
  }

  .katex .overline .overline-line,
  .katex .underline .underline-line {
    border-bottom-color: #f8fafc;
  }

  .katex .sqrt > .root {
    color: #f8fafc;
  }

  .katex-error {
    color: #fca5a5 !important;
    font-family: monospace;
    font-size: 0.85rem;
    white-space: pre-wrap;
  }
`;

const MathBlock = ({ equation, compact = false, displayMode = true, label }) => {
  const { html, error } = useMemo(() => {
    try {
      const rendered = katex.renderToString(equation, {
        throwOnError: true,
        displayMode,
        strict: false,
        trust: true,
        output: 'html',
      });
      return { html: rendered, error: null };
    } catch (e) {
      return { html: e.message, error: true };
    }
  }, [equation, displayMode]);

  return (
    <Wrapper>
      {label && <Label>{label}</Label>}
      <MathCard $compact={compact} dangerouslySetInnerHTML={{ __html: html }} />
    </Wrapper>
  );
};

export default MathBlock;
