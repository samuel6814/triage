import React from 'react';
import styled from 'styled-components';

const Counter = styled.span`
  font-variant-numeric: tabular-nums;
  font-weight: 800;
  color: #166534;
`;

/**
 * Counter element — GSAP animates inner text via .viz-counter-value
 */
const AnimatedCounter = ({ className, prefix = '', suffix = '', initial = '0', dataTarget }) => (
  <Counter className={className}>
    {prefix}
    <span className="viz-counter-value" data-target={dataTarget}>{initial}</span>
    {suffix}
  </Counter>
);

export default AnimatedCounter;
