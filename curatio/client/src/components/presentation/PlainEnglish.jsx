import styled from 'styled-components';

const Box = styled.div`
  background: #f0fdf4;
  border-left: 4px solid #22c55e;
  padding: 1.25rem 1.5rem;
  border-radius: 0 12px 12px 0;
  color: #166534;

  strong { display: block; margin-bottom: 0.35rem; }

  ul {
    margin: 8px 0 0 20px;
    padding: 0;
    line-height: 1.75;
  }

  p { margin: 0; line-height: 1.65; }
`;

const PlainEnglish = ({ title = 'In plain English', children }) => (
  <Box>
    <strong>{title}</strong>
    {children}
  </Box>
);

export default PlainEnglish;
