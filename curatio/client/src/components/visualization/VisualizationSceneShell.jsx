import styled from 'styled-components';

export const SceneShell = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
`;

export const SceneHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
`;

export const StepBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.65rem;
  background: #dcfce7;
  color: #166534;
  border-radius: 6px;
  font-size: 0.78rem;
  font-weight: 700;
`;

export const SectionLabel = styled.span`
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 600;
`;

export const SceneBody = styled.div`
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: 58% 42%;
  gap: 1rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    overflow-y: auto;
  }
`;

export const AnimationCanvas = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 0;
  overflow: hidden;
`;

export const MathPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  justify-content: center;
  min-height: 0;
  overflow-y: auto;
`;

export const NarrativeText = styled.p`
  margin: 0;
  font-size: 0.92rem;
  color: #475569;
  line-height: 1.55;
`;

export const ComplaintBlock = styled.blockquote`
  margin: 0;
  padding: 0.75rem 1rem;
  border-left: 4px solid #22c55e;
  background: #f0fdf4;
  color: #166534;
  font-style: italic;
  font-size: 0.95rem;
  line-height: 1.5;
`;

export const TokenChip = styled.span`
  display: inline-block;
  padding: 0.45rem 0.75rem;
  margin: 0.15rem;
  border-radius: 8px;
  font-size: calc(1.1rem * var(--viz-font-scale, 1));
  font-weight: ${(p) => (p.$highlight ? 700 : 500)};
  background: ${(p) => {
    if (p.$mask) return '#fef3c7';
    if (p.$highlight) return '#dcfce7';
    return '#f8fafc';
  }};
  border: 1.5px solid ${(p) => {
    if (p.$mask) return '#d97706';
    if (p.$highlight) return '#166534';
    return '#e2e8f0';
  }};
  opacity: ${(p) => (p.$visible === false ? 0 : 1)};
  transform: scale(${(p) => (p.$visible === false ? 0.8 : 1)});
`;

export const TokenRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.15rem;
  justify-content: center;
`;

export const NumericCell = styled.span`
  display: inline-block;
  padding: 0.35rem 0.5rem;
  border-radius: 6px;
  font-size: calc(1.05rem * var(--viz-font-scale, 1));
  font-family: ui-monospace, monospace;
  min-width: 3.25rem;
  text-align: center;
  background: ${(p) => (p.$active ? '#fef9c3' : '#f1f5f9')};
  border: 1px solid ${(p) => (p.$active ? '#fde047' : '#e2e8f0')};
`;
