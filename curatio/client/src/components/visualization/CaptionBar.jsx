import React from 'react';
import styled from 'styled-components';

const Bar = styled.p`
  margin: 0;
  padding: 0.5rem 1rem;
  text-align: center;
  font-size: calc(1.4rem * var(--viz-font-scale, 1));
  font-weight: 600;
  color: #334155;
  line-height: 1.45;
  flex-shrink: 0;
`;

const CaptionBar = ({ children }) => (
  <Bar>{children}</Bar>
);

export default CaptionBar;
