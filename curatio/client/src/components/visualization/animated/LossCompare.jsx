import React from 'react';
import styled from 'styled-components';

const Wrap = styled.div`
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  width: 100%;
  max-width: 520px;
`;

const Column = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const Label = styled.span`
  font-size: 0.9rem;
  font-weight: 700;
  color: #475569;
`;

const Track = styled.div`
  width: 100%;
  height: 120px;
  background: #f1f5f9;
  border-radius: 10px;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
  border: 2px solid #e2e8f0;
`;

const Fill = styled.div`
  width: 100%;
  height: 0%;
  border-radius: 0 0 8px 8px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 6px;
`;

const Value = styled.span`
  font-size: 1.1rem;
  font-weight: 800;
  color: #fff;
`;

/**
 * Two penalty bars — GSAP animates .viz-loss-fill height
 */
const LossCompare = ({
  className,
  leftLabel = 'Correct guess',
  rightLabel = 'Wrong guess',
  leftValue = '0.08',
  rightValue = '4.6',
  leftPct = 15,
  rightPct = 95,
  leftColor = '#22c55e',
  rightColor = '#ef4444',
}) => (
  <Wrap className={className}>
    <Column>
      <Label>{leftLabel}</Label>
      <Track>
        <Fill className="viz-loss-fill viz-loss-left" style={{ background: leftColor }} data-pct={leftPct}>
          <Value className="viz-loss-val-left">{leftValue}</Value>
        </Fill>
      </Track>
    </Column>
    <Column>
      <Label>{rightLabel}</Label>
      <Track>
        <Fill className="viz-loss-fill viz-loss-right" style={{ background: rightColor }} data-pct={rightPct}>
          <Value className="viz-loss-val-right">{rightValue}</Value>
        </Fill>
      </Track>
    </Column>
  </Wrap>
);

export default LossCompare;
