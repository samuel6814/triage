import React from 'react';
import styled from 'styled-components';
import MathBlock from '../presentation/MathBlock';

const Strip = styled.div`
  width: 100%;
  margin-top: 0.75rem;
  padding: 0.85rem 1.25rem;
  background: #1e293b;
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  flex-shrink: 0;

  .katex { font-size: 1.35em !important; }
`;

const Terms = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin-top: 0.65rem;
  justify-content: center;
`;

const Term = styled.span`
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  font-size: calc(0.95rem * var(--viz-font-scale, 1));
  font-weight: 700;
  background: #334155;
  color: #94a3b8;
  border: 2px solid #475569;
  transition: all 0.25s ease;

  &.viz-formula-term-active {
    background: #dcfce7;
    color: #166534;
    border-color: #22c55e;
    box-shadow: 0 0 12px rgba(34, 197, 94, 0.35);
    transform: scale(1.05);
  }
`;

const Effect = styled.p`
  margin: 0.55rem 0 0;
  text-align: center;
  font-size: calc(1.05rem * var(--viz-font-scale, 1));
  font-weight: 600;
  color: #bbf7d0;
  min-height: 1.5em;
  opacity: 0;
`;

const AnimatedFormulaStrip = ({ equations = [], formulaTerms = [] }) => {
  if (!equations.length) return null;

  return (
    <Strip className="viz-formula-strip">
      {equations.map((eq, i) => (
        <MathBlock key={i} equation={eq.latex} compact displayMode />
      ))}
      {formulaTerms.length > 0 && (
        <Terms>
          {formulaTerms.map((t) => (
            <Term key={t.id} className="viz-formula-term" data-term={t.id}>
              {t.label}
            </Term>
          ))}
        </Terms>
      )}
      <Effect className="viz-formula-effect" />
    </Strip>
  );
};

export default AnimatedFormulaStrip;
