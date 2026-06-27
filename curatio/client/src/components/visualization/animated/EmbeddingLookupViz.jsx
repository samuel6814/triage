import React from 'react';
import styled from 'styled-components';
import VizDataGrid from './VizDataGrid';

const Wrap = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: center;
  gap: 1.25rem;
  width: 100%;
  max-width: 900px;
`;

const MatrixCol = styled.div`
  flex: 1.4;
  opacity: 0;
`;

const ArrowCol = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: 800;
  color: #166534;
  opacity: 0;
  min-width: 48px;
`;

const VectorCol = styled.div`
  flex: 0.8;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

const VectorTitle = styled.div`
  font-weight: 800;
  color: #166534;
  font-size: calc(1.1rem * var(--viz-font-scale, 1));
  text-align: center;
  margin-bottom: 0.35rem;
  opacity: 0;
`;

const VecCell = styled.div`
  padding: 0.55rem 0.75rem;
  border-radius: 8px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  font-family: ui-monospace, monospace;
  font-size: calc(1.05rem * var(--viz-font-scale, 1));
  text-align: center;
  opacity: 0;
  transform: translateX(12px);
`;

const MATRIX_ROWS = [
  { id: '101', idVal: '101', token: '[CLS]' },
  { id: '2031', idVal: '2031', token: 'have' },
  { id: '7994', idVal: '7994', token: 'head+##ache', active: true },
  { id: 'dots', idVal: '⋮', token: '…' },
];

const VECTOR_VALS = [0.02, 0.11, -0.05, 0.33, 0.08, -0.12, 0.21, 0.04];

const EmbeddingLookupViz = ({ className }) => (
  <Wrap className={className}>
    <MatrixCol className="viz-embed-matrix">
      <VizDataGrid
        columns={[
          { key: 'idVal', label: 'ID', width: '72px' },
          { key: 'token', label: 'Token preview', width: 'auto' },
        ]}
        rows={MATRIX_ROWS}
        rowClassName="viz-embed-row"
        activeRowClass="viz-embed-row-active"
      />
    </MatrixCol>
    <ArrowCol className="viz-embed-arrow">→</ArrowCol>
    <VectorCol>
      <VectorTitle className="viz-embed-vec-title">e₄ ∈ ℝ⁷⁶⁸</VectorTitle>
      {VECTOR_VALS.map((v, i) => (
        <VecCell key={i} className="viz-embed-vec-cell">{v}</VecCell>
      ))}
      <VecCell className="viz-embed-vec-cell" style={{ color: '#94a3b8', fontStyle: 'italic' }}>…768</VecCell>
    </VectorCol>
  </Wrap>
);

export default EmbeddingLookupViz;
