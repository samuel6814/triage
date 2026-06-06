import React from 'react';
import styled from 'styled-components';
import MathBlock from './MathBlock';
import PlainEnglish from './PlainEnglish';
import FlipMathCard from './FlipMathCard';
import ExamplePanel from './ExamplePanel';

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const Title = styled.h4`
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: #166534;
`;

const VariableGrid = styled.dl`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.35rem 1rem;
  margin: 0;
  padding: 1rem 1.25rem;
  background: #f8fafc;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  font-size: 0.88rem;

  dt {
    font-family: 'KaTeX_Main', 'Times New Roman', serif;
    font-weight: 600;
    color: #1e293b;
    white-space: nowrap;
  }

  dd {
    margin: 0;
    color: #475569;
    line-height: 1.5;
  }
`;

const MathSection = ({
  title,
  equations = [],
  variables = [],
  compact = false,
  explanationTitle = 'In plain English',
  explanation,
  example,
  flipMinHeight,
}) => {
  const renderFront = (eq) => (
    <>
      <MathBlock equation={eq.latex} label={eq.label} compact={compact} />
      {eq.explanation && (
        <PlainEnglish title={eq.explanationTitle || explanationTitle}>
          {eq.explanation}
        </PlainEnglish>
      )}
    </>
  );

  const renderExample = (ex) => (
    <ExamplePanel title={ex.title}>
      {ex.content}
    </ExamplePanel>
  );

  return (
    <Section>
      {title && <Title>{title}</Title>}

      {equations.map((eq, i) => {
        const ex = eq.example || (equations.length === 1 && i === 0 ? example : null);
        if (ex) {
          return (
            <FlipMathCard
              key={i}
              minHeight={flipMinHeight || (compact ? 180 : 220)}
              front={renderFront(eq)}
              back={renderExample(ex)}
            />
          );
        }
        return (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {renderFront(eq)}
          </div>
        );
      })}

      {variables.length > 0 && (
        <VariableGrid>
          {variables.map(({ symbol, meaning }) => (
            <React.Fragment key={symbol}>
              <dt>{symbol}</dt>
              <dd>{meaning}</dd>
            </React.Fragment>
          ))}
        </VariableGrid>
      )}

      {explanation && (
        <PlainEnglish title={explanationTitle}>
          {explanation}
        </PlainEnglish>
      )}
    </Section>
  );
};

export default MathSection;
