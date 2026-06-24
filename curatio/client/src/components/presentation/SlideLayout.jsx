import styled from 'styled-components';

export const SlideContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  animation: fadeIn 0.5s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

export const LeadText = styled.p`
  font-size: 1.05rem;
  color: #475569;
  line-height: 1.65;
  margin: 0;
  max-width: 900px;
`;

export const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: #166534;
  margin: 0.5rem 0 0;
`;

export const CompactSlideContainer = styled(SlideContainer)`
  gap: 0.75rem;
  font-size: calc(0.92rem * var(--slide-font-scale, 1));
  height: 100%;
`;

export const TwoColumn = styled.div`
  display: grid;
  grid-template-columns: ${(p) => p.$ratio || '1fr 1fr'};
  gap: 1.25rem;
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const ComplaintQuote = styled.blockquote`
  margin: 0;
  padding: 0.65rem 0.9rem;
  border-left: 3px solid #22c55e;
  background: #f0fdf4;
  color: #166534;
  font-style: italic;
  font-size: 0.9rem;
  line-height: 1.5;
`;

export const DataTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.78rem;

  th, td {
    border: 1px solid #e2e8f0;
    padding: 0.35rem 0.5rem;
    text-align: left;
  }

  th {
    background: #f0fdf4;
    color: #166534;
    font-weight: 700;
  }

  td code {
    font-size: 0.85em;
    background: #f1f5f9;
    padding: 1px 4px;
    border-radius: 4px;
  }
`;
