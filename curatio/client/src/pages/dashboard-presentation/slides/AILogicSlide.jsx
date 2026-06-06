import React, { useMemo } from 'react';
import styled from 'styled-components';
import katex from 'katex';

const SlideContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const MathCard = styled.div`
  background: #1e293b; /* Dark slate for a "chalkboard" feel */
  border-radius: 16px;
  padding: 2.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: inset 0 4px 20px rgba(0,0,0,0.2);
  /* KaTeX renders text, we want it white on this dark background */
  color: white; 
  font-size: 1.5rem;
  overflow-x: auto;
`;

const Explanation = styled.div`
  background: #f0fdf4;
  border-left: 4px solid #22c55e;
  padding: 1.5rem;
  border-radius: 0 12px 12px 0;
  color: #166534;

  ul {
    margin: 10px 0 0 20px;
    padding: 0;
    line-height: 1.8;
  }
`;

const AILogicSlide = () => {
  // Using KaTeX to render an algorithm formula into a string of HTML
  const formulaHtml = useMemo(() => {
    const equation = `P(T_c | S) = \\frac{P(S | T_c) \\cdot P(T_c)}{\\sum_{i=1}^{k} P(S | T_i) \\cdot P(T_i)}`;
    return katex.renderToString(equation, {
      throwOnError: false,
      displayMode: true,
    });
  }, []);

  return (
    <SlideContainer>
      <p style={{ color: '#475569', fontSize: '1.1rem' }}>
        Curatio utilizes a Bayesian inference model to calculate the probability of a specific 
        Triage Category (Critical, Urgent, Standard) given the presented Symptoms.
      </p>

      {/* Render the KaTeX HTML */}
      <MathCard dangerouslySetInnerHTML={{ __html: formulaHtml }} />

      <Explanation>
        <strong>Variables Defined:</strong>
        <ul>
          <li><strong>P(T_c | S):</strong> Probability of Triage Category given Symptoms</li>
          <li><strong>P(S | T_c):</strong> Likelihood of these symptoms occurring in this category</li>
          <li><strong>P(T_c):</strong> Prior probability of this category based on historical hospital data</li>
        </ul>
      </Explanation>
    </SlideContainer>
  );
};

export default AILogicSlide;