import React, { useState } from 'react';
import styled from 'styled-components';
import { FlipHorizontal2 } from 'lucide-react';

const Wrapper = styled.div`
  width: 100%;
`;

const FlipToolbar = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0.5rem;
`;

const FlipButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid #bbf7d0;
  background: #f0fdf4;
  color: #166534;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #dcfce7;
    border-color: #22c55e;
    transform: scale(1.02);
  }

  svg { flex-shrink: 0; }
`;

const Scene = styled.div`
  perspective: 1200px;
  width: 100%;
`;

const Inner = styled.div`
  position: relative;
  width: 100%;
  min-height: ${props => props.$minHeight}px;
  transition: transform 0.55s cubic-bezier(0.4, 0.2, 0.2, 1);
  transform-style: preserve-3d;
  transform: ${props => (props.$flipped ? 'rotateY(180deg)' : 'rotateY(0deg)')};
`;

const Face = styled.div`
  width: 100%;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Front = styled(Face)``;

const Back = styled(Face)`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  transform: rotateY(180deg);
  overflow-y: auto;
`;

const SideLabel = styled.span`
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${props => (props.$back ? '#92400e' : '#166534')};
  margin-bottom: 2px;
`;

/**
 * Dual-view card: front = formula/math, back = worked example.
 */
const FlipMathCard = ({
  front,
  back,
  minHeight = 160,
  exampleLabel = 'See worked example',
  formulaLabel = 'See formula',
}) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <Wrapper>
      <FlipToolbar>
        <FlipButton
          type="button"
          onClick={() => setFlipped(f => !f)}
          aria-pressed={flipped}
        >
          <FlipHorizontal2 size={16} />
          {flipped ? formulaLabel : exampleLabel}
        </FlipButton>
      </FlipToolbar>
      <Scene>
        <Inner $flipped={flipped} $minHeight={minHeight}>
          <Front>
            <SideLabel>Formula</SideLabel>
            {front}
          </Front>
          <Back>
            <SideLabel $back>Worked example</SideLabel>
            {back}
          </Back>
        </Inner>
      </Scene>
    </Wrapper>
  );
};

export default FlipMathCard;
