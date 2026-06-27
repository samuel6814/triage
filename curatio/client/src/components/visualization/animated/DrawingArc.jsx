import React from 'react';
import styled from 'styled-components';

const Svg = styled.svg`
  width: 100%;
  max-width: 480px;
  height: 140px;
  overflow: visible;
`;

const ARCS = [
  { from: { x: 120, y: 90 }, to: { x: 240, y: 40 }, label: '41%', cls: 'viz-arc-1' },
  { from: { x: 240, y: 40 }, to: { x: 360, y: 90 }, label: '18%', cls: 'viz-arc-2' },
  { from: { x: 120, y: 90 }, to: { x: 360, y: 90 }, label: '32%', cls: 'viz-arc-3' },
];

const TOKENS = [
  { x: 120, y: 90, label: 'feverish' },
  { x: 240, y: 40, label: 'headache' },
  { x: 360, y: 90, label: 'weak' },
];

const DrawingArc = ({ className }) => (
  <Svg className={className} viewBox="0 0 480 120">
    {ARCS.map((a) => {
      const mx = (a.from.x + a.to.x) / 2;
      const my = Math.min(a.from.y, a.to.y) - 30;
      const d = `M ${a.from.x} ${a.from.y} Q ${mx} ${my} ${a.to.x} ${a.to.y}`;
      return (
        <g key={a.cls}>
          <path
            d={d}
            fill="none"
            stroke="#166534"
            strokeWidth="2.5"
            className={a.cls}
            strokeDasharray="200"
            strokeDashoffset="200"
          />
          <text x={mx} y={my + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill="#166534" className={`${a.cls}-label`} opacity="0">
            {a.label}
          </text>
        </g>
      );
    })}
    {TOKENS.map((t) => (
      <g key={t.label}>
        <circle cx={t.x} cy={t.y} r="28" fill="#dcfce7" stroke="#166534" strokeWidth="2" className={`viz-token-node viz-node-${t.label}`} />
        <text x={t.x} y={t.y + 4} textAnchor="middle" fontSize="10" fontWeight="700" fill="#166534">{t.label}</text>
      </g>
    ))}
  </Svg>
);

export default DrawingArc;
