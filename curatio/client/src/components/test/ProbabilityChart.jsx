import React, { useMemo } from 'react';
import styled from 'styled-components';
import { getAcuityMeta } from '../../data/acuityLevels';

const Wrap = styled.div`
  display: grid;
  gap: 1.25rem;
`;

const ChartTitle = styled.h3`
  margin: 0 0 0.75rem;
  font-size: 0.95rem;
  font-weight: 800;
  color: #166534;
`;

const BarRow = styled.div`
  display: grid;
  grid-template-columns: 72px 1fr 64px;
  gap: 10px;
  align-items: center;
  margin-bottom: 8px;
  font-size: 0.82rem;
  color: #334155;
`;

const Track = styled.div`
  height: 10px;
  background: #f1f5f9;
  border-radius: 999px;
  overflow: hidden;
`;

const Fill = styled.div`
  height: 100%;
  width: ${(p) => p.$w}%;
  background: ${(p) => p.$color || '#22c55e'};
  border-radius: 999px;
`;

const COLOUR_HEX = {
  Red: '#ef4444',
  Orange: '#f97316',
  Yellow: '#eab308',
  Green: '#22c55e',
};

const ORD = { Green: 1, Yellow: 2, Orange: 3, Red: 4 };

function ProbabilityBars({ probabilities }) {
  const rows = [...(probabilities || [])].sort((a, b) => a.level - b.level);
  return (
    <div>
      <ChartTitle>Acuity probabilities (bars)</ChartTitle>
      {rows.map((p) => {
        const meta = getAcuityMeta(p.level);
        const pct = Math.min(100, (p.probability || 0) * 100);
        return (
          <BarRow key={p.level}>
            <span>L{p.level}</span>
            <Track>
              <Fill $w={pct} $color={COLOUR_HEX[meta.colour] || '#22c55e'} />
            </Track>
            <span>{pct.toFixed(2)}%</span>
          </BarRow>
        );
      })}
    </div>
  );
}

function SoftmaxLine({ probabilities }) {
  const rows = useMemo(
    () => [...(probabilities || [])].sort((a, b) => a.level - b.level),
    [probabilities],
  );
  const w = 420;
  const h = 140;
  const pad = 28;
  if (!rows.length) return null;

  const xs = rows.map((_, i) => pad + (i * (w - 2 * pad)) / Math.max(rows.length - 1, 1));
  const ys = rows.map((p) => h - pad - (p.probability || 0) * (h - 2 * pad));
  const points = xs.map((x, i) => `${x},${ys[i]}`).join(' ');

  return (
    <div>
      <ChartTitle>Softmax curve (by level)</ChartTitle>
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" style={{ maxWidth: 480 }}>
        <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} stroke="#cbd5e1" />
        <line x1={pad} y1={pad} x2={pad} y2={h - pad} stroke="#cbd5e1" />
        <polyline fill="none" stroke="#166534" strokeWidth="2.5" points={points} />
        {rows.map((p, i) => (
          <g key={p.level}>
            <circle cx={xs[i]} cy={ys[i]} r="4" fill="#22c55e" />
            <text x={xs[i]} y={h - 8} textAnchor="middle" fontSize="11" fill="#64748b">
              L{p.level}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function FusionUrgencyChart({ layers, fusedColour }) {
  if (!layers) return null;
  const entries = [
    ['C_NLP', layers.c_nlp],
    ['C_TEWS', layers.c_tews],
    ['C_disc', layers.c_disc],
    ['C_Bayes', layers.c_bayes],
    ['Fused', fusedColour],
  ].filter(([, c]) => c);

  if (!entries.length) return null;

  const w = 420;
  const h = 140;
  const pad = 28;
  const xs = entries.map((_, i) => pad + (i * (w - 2 * pad)) / Math.max(entries.length - 1, 1));
  const ys = entries.map(([, c]) => h - pad - ((ORD[c] || 1) / 4) * (h - 2 * pad));
  const points = xs.map((x, i) => `${x},${ys[i]}`).join(' ');

  return (
    <div>
      <ChartTitle>Fusion urgency (ord)</ChartTitle>
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" style={{ maxWidth: 480 }}>
        <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} stroke="#cbd5e1" />
        <polyline fill="none" stroke="#f97316" strokeWidth="2.5" points={points} />
        {entries.map(([label, c], i) => (
          <g key={label}>
            <circle cx={xs[i]} cy={ys[i]} r="4" fill={COLOUR_HEX[c] || '#64748b'} />
            <text x={xs[i]} y={h - 8} textAnchor="middle" fontSize="10" fill="#64748b">
              {label.replace('C_', '')}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export default function ProbabilityChart({ probabilities, layers, fusedColour }) {
  return (
    <Wrap>
      <ProbabilityBars probabilities={probabilities} />
      <SoftmaxLine probabilities={probabilities} />
      <FusionUrgencyChart layers={layers} fusedColour={fusedColour} />
    </Wrap>
  );
}
