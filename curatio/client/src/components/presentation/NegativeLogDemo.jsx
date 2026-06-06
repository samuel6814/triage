import React, { useState } from 'react';
import styled from 'styled-components';

const Wrap = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 1.25rem 1.5rem;
  margin-top: 0.5rem;
`;

const Title = styled.div`
  font-size: 0.85rem;
  font-weight: 700;
  color: #166534;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
`;

const Slider = styled.input`
  flex: 1;
  min-width: 160px;
  accent-color: #22c55e;
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const Stat = styled.div`
  background: #fff;
  border-radius: 10px;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;

  .label {
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: #64748b;
    margin-bottom: 4px;
  }

  .value {
    font-size: 1.35rem;
    font-weight: 800;
    color: #1e293b;
    font-family: 'KaTeX_Main', 'Times New Roman', serif;
  }
`;

const BarTrack = styled.div`
  height: 12px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
  margin-bottom: 0.75rem;
`;

const BarFill = styled.div`
  height: 100%;
  width: ${props => props.$pct}%;
  background: ${props => props.$color};
  border-radius: 999px;
  transition: width 0.2s ease, background 0.2s ease;
`;

const Caption = styled.p`
  margin: 0;
  font-size: 0.88rem;
  color: #475569;
  line-height: 1.55;
`;

/**
 * Interactive −log(P) explorer for the BioBERT training slide.
 * Drag the slider to show why low confidence generates a huge training penalty.
 */
const NegativeLogDemo = () => {
  const [pct, setPct] = useState(90);
  const p = pct / 100;
  const penalty = -Math.log(p);
  const barPct = Math.min(100, (penalty / 4.6) * 100);
  const barColor = penalty < 0.15 ? '#22c55e' : penalty < 1 ? '#eab308' : '#dc2626';

  let interpretation;
  if (penalty < 0.15) {
    interpretation = 'Tiny penalty — the model guessed correctly with high confidence (e.g. predicted "chest" for severe ___ pain). Weights barely change.';
  } else if (penalty < 1) {
    interpretation = 'Moderate penalty — somewhat unsure; the optimiser nudges weights to improve.';
  } else {
    interpretation = 'Massive penalty — e.g. only 10% confident in the nurse\'s Orange label. −log(0.10) ≈ 2.3 forces a strong weight update.';
  }

  return (
    <Wrap>
      <Title>Explore −log(P) — drag the confidence slider</Title>
      <Row>
        <label htmlFor="conf-slider" style={{ fontSize: '0.88rem', color: '#475569', whiteSpace: 'nowrap' }}>
          Confidence <strong>P</strong> =
        </label>
        <Slider
          id="conf-slider"
          type="range"
          min={1}
          max={99}
          value={pct}
          onChange={(e) => setPct(Number(e.target.value))}
        />
        <strong style={{ color: '#166534', minWidth: '3rem' }}>{pct}%</strong>
      </Row>

      <StatGrid>
        <Stat>
          <div className="label">Probability P</div>
          <div className="value">{p.toFixed(2)}</div>
        </Stat>
        <Stat>
          <div className="label">Penalty −log(P)</div>
          <div className="value">{penalty.toFixed(3)}</div>
        </Stat>
      </StatGrid>

      <BarTrack aria-hidden="true">
        <BarFill $pct={barPct} $color={barColor} />
      </BarTrack>

      <Caption>{interpretation}</Caption>
    </Wrap>
  );
};

export default NegativeLogDemo;
