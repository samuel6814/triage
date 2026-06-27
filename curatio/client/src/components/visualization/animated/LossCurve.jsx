import React from 'react';
import styled from 'styled-components';
import AnimatedCounter from './AnimatedCounter';

const Wrap = styled.div`
  width: 100%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const Svg = styled.svg`
  width: 100%;
  height: 160px;
`;

const Stats = styled.div`
  display: flex;
  justify-content: space-around;
  font-size: 0.95rem;
  color: #475569;
`;

const LossCurve = ({ className }) => (
  <Wrap className={className}>
    <Svg viewBox="0 0 400 160" className="viz-loss-svg">
      <line x1="40" y1="140" x2="380" y2="140" stroke="#cbd5e1" strokeWidth="2" />
      <line x1="40" y1="20" x2="40" y2="140" stroke="#cbd5e1" strokeWidth="2" />
      <text x="200" y="155" textAnchor="middle" fontSize="11" fill="#64748b">Training steps</text>
      <text x="18" y="80" textAnchor="middle" fontSize="11" fill="#64748b" transform="rotate(-90 18 80)">Loss</text>
      <path
        d="M 40 30 Q 120 50 200 80 T 380 120"
        fill="none"
        stroke="#166534"
        strokeWidth="3"
        className="viz-loss-path"
        strokeDasharray="500"
        strokeDashoffset="500"
      />
      <circle cx="380" cy="120" r="6" fill="#166534" className="viz-loss-dot" opacity="0" />
    </Svg>
    <Stats>
      <span>Steps: <AnimatedCounter className="viz-steps-counter" initial="0" dataTarget="13500" /></span>
      <span>eval_loss: <AnimatedCounter className="viz-loss-counter" initial="0.05" dataTarget="0.001812" suffix="" /></span>
    </Stats>
  </Wrap>
);

export default LossCurve;
