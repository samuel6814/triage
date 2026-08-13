import React from 'react';
import styled from 'styled-components';

const Wrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const Block = styled.div`
  padding: 0.85rem 1.1rem;
  border-radius: 10px;
  background: #f0fdf4;
  border: 2px solid #166534;
  font-weight: 700;
  color: #166534;
  transform: translateY(20px);
`;

const Plus = styled.span`
  font-size: 1.5rem;
  font-weight: 800;
  color: #94a3b8;
`;

const Result = styled.div`
  padding: 1rem 1.5rem;
  border-radius: 12px;
  background: #166534;
  color: #fff;
  font-weight: 800;
  transform: scale(0.8);
  margin-top: 0.5rem;
  width: 100%;
  text-align: center;
`;

const StackMerge = ({ className }) => (
  <div className={className} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <Wrap>
      <Block className="viz-block-word">E_word</Block>
      <Plus className="viz-plus">+</Plus>
      <Block className="viz-block-pos">E_pos</Block>
      <Plus className="viz-plus">+</Plus>
      <Block className="viz-block-seg">E_seg</Block>
    </Wrap>
    <Result className="viz-merge-result">E(t_i) — token input vector</Result>
  </div>
);

export default StackMerge;
