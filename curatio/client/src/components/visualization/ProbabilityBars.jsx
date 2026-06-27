import React from 'react';
import styled from 'styled-components';

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
`;

const BarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Label = styled.span`
  width: 56px;
  font-size: 0.82rem;
  font-weight: 600;
  color: #475569;
  text-align: right;
  flex-shrink: 0;
`;

const Track = styled.div`
  flex: 1;
  height: 22px;
  background: #f1f5f9;
  border-radius: 6px;
  overflow: hidden;
`;

const Fill = styled.div`
  height: 100%;
  width: 0%;
  background: ${(p) => p.$color};
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 6px;
`;

const PctLabel = styled.span`
  font-size: 0.72rem;
  font-weight: 700;
  color: ${(p) => (p.$light ? '#1e293b' : '#fff')};
`;

export const ProbabilityBars = ({ items, className }) => (
  <Wrap className={className}>
    {items.map((item) => {
      const pct = Math.round(item.prob * 100);
      const isYellow = item.label === 'Yellow';
      return (
        <BarRow key={item.level} className="viz-prob-row" data-level={item.level}>
          <Label>{item.label}</Label>
          <Track>
            <Fill
              className="viz-prob-fill"
              $color={item.color}
              data-target={pct}
            >
              <PctLabel $light={isYellow} className="viz-prob-label" style={{ opacity: 0 }}>
                {pct}%
              </PctLabel>
            </Fill>
          </Track>
        </BarRow>
      );
    })}
  </Wrap>
);

export default ProbabilityBars;
