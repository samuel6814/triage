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

export const BeamerSlideContainer = styled(SlideContainer)`
  height: 100%;
  gap: 1rem;
  font-size: 1.1rem;
  line-height: 1.55;
`;

/** @deprecated use BeamerSlideContainer */
export const CompactSlideContainer = BeamerSlideContainer;

export const LeadText = styled.p`
  font-size: 1.15rem;
  color: #475569;
  line-height: 1.6;
  margin: 0;
  max-width: none;
`;

export const BodyText = styled.p`
  font-size: 1.05rem;
  color: #475569;
  line-height: 1.6;
  margin: 0;
`;

export const CaptionText = styled.p`
  font-size: 0.95rem;
  color: #64748b;
  line-height: 1.5;
  margin: 0;
  font-style: italic;
`;

export const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #166534;
  margin: 0;
`;

export const BeamerColumns = styled.div`
  display: grid;
  grid-template-columns: ${(p) => p.$ratio || '52% 48%'};
  gap: 1.5rem;
  align-items: stretch;
  flex: 1;
  min-height: 0;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

/** @deprecated use BeamerColumns */
export const TwoColumn = BeamerColumns;

export const SlideFigure = styled.div`
  width: 100%;
  height: 245px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.75rem;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 8px;
  }
`;

export const DiagramBox = styled.div`
  width: 100%;
  min-height: ${(p) => p.$minHeight || '80px'};
  max-height: ${(p) => p.$maxHeight || 'none'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 100%;
    height: auto;
    max-height: ${(p) => p.$maxHeight || '320px'};
  }
`;

export const ComplaintQuote = styled.blockquote`
  margin: 0.5rem 0;
  padding: 0.85rem 1.1rem;
  border-left: 4px solid #22c55e;
  background: #f0fdf4;
  color: #166534;
  font-style: italic;
  font-size: 1.05rem;
  line-height: 1.55;
`;

export const DataTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.92rem;

  th, td {
    border: 1px solid #e2e8f0;
    padding: 0.45rem 0.6rem;
    text-align: left;
  }

  th {
    background: #f0fdf4;
    color: #166534;
    font-weight: 700;
  }

  td code {
    font-size: 0.9em;
    background: #f1f5f9;
    padding: 1px 5px;
    border-radius: 4px;
  }
`;

export const InfoBox = styled.div`
  background: #f8fafc;
  border-radius: 10px;
  padding: 1rem 1.15rem;
  font-size: 1rem;
  line-height: 1.55;
  color: #475569;
`;

export const BulletList = styled.ul`
  margin: 0.5rem 0 0;
  padding-left: 1.35rem;
  font-size: 1.05rem;
  color: #475569;
  line-height: 1.65;

  li {
    margin-bottom: 0.35rem;
  }
`;

/** Beamer \plain{} block */
export const PlainEnglishBlock = styled.div`
  background: #f0fdf4;
  border-left: 4px solid #22c55e;
  border-radius: 0 8px 8px 0;
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
  line-height: 1.55;
  color: #475569;

  strong {
    color: #166534;
    display: block;
    margin-bottom: 0.35rem;
    font-size: 0.9rem;
  }
`;

/** Symbol glossary table — columns: symbol | meaning | (optional) role */
export const VariableTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.88rem;

  th, td {
    border: 1px solid #e2e8f0;
    padding: 0.4rem 0.55rem;
    text-align: left;
    vertical-align: top;
  }

  th {
    background: #f0fdf4;
    color: #166534;
    font-weight: 700;
  }

  td:first-child {
    font-weight: 600;
    color: #1e293b;
    white-space: nowrap;
  }
`;

/** Beamer exampleblock */
export const WorkedExampleBlock = styled.div`
  background: #fef9c3;
  border: 1px solid #fde047;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
  line-height: 1.55;
  color: #475569;

  strong {
    color: #854d0e;
    display: block;
    margin-bottom: 0.35rem;
  }
`;

export const NumberedSteps = styled.ol`
  margin: 0.5rem 0 0;
  padding-left: 1.35rem;
  font-size: 1.05rem;
  color: #475569;
  line-height: 1.65;

  li {
    margin-bottom: 0.4rem;
  }
`;
