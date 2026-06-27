import React from 'react';
import styled from 'styled-components';

const Bar = styled.p`
  margin: 0;
  padding: 0.65rem 1.25rem;
  text-align: center;
  font-size: 1.15rem;
  font-weight: 600;
  color: #334155;
  line-height: 1.45;
  flex-shrink: 0;
`;

const CaptionBar = ({ children }) => (
  <Bar>{children}</Bar>
);

export default CaptionBar;
