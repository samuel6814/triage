import React, { useState } from 'react';
import styled from 'styled-components';
import { ChevronDown, ChevronUp } from 'lucide-react';
import MathBlock from '../presentation/MathBlock';

const Wrap = styled.div`
  position: absolute;
  bottom: 0.5rem;
  right: 0.5rem;
  z-index: 3;
`;

const Toggle = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid #cbd5e1;
  background: rgba(255, 255, 255, 0.92);
  color: #64748b;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  backdrop-filter: blur(4px);

  &:hover {
    background: #f8fafc;
    color: #166534;
    border-color: #bbf7d0;
  }
`;

const Panel = styled.div`
  margin-top: 0.35rem;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid #e2e8f0;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  max-width: 320px;
`;

const DetailsDrawer = ({ equations = [] }) => {
  const [open, setOpen] = useState(false);

  if (!equations.length) return null;

  return (
    <Wrap>
      <Toggle type="button" onClick={() => setOpen((v) => !v)}>
        {open ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        See formula
      </Toggle>
      {open && (
        <Panel>
          {equations.map((eq, i) => (
            <MathBlock key={i} equation={eq.latex} compact />
          ))}
        </Panel>
      )}
    </Wrap>
  );
};

export default DetailsDrawer;
