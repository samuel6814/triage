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
