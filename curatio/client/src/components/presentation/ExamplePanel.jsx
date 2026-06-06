import styled from 'styled-components';

const Panel = styled.div`
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
  border: 1px solid #fde68a;
  border-radius: 12px;
  padding: 1.15rem 1.25rem;
  flex: 1;
  min-height: 120px;

  h5 {
    margin: 0 0 10px;
    font-size: 0.92rem;
    color: #92400e;
    font-weight: 700;
  }

  p {
    margin: 0 0 8px;
    font-size: 0.88rem;
    color: #78350f;
    line-height: 1.6;
  }

  p:last-child { margin-bottom: 0; }

  ol, ul {
    margin: 0;
    padding-left: 1.2rem;
    color: #78350f;
    font-size: 0.88rem;
    line-height: 1.75;
  }

  li { margin-bottom: 4px; }

  code {
    background: rgba(255, 255, 255, 0.6);
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.82rem;
    color: #1e293b;
  }

  .result {
    margin-top: 10px;
    padding: 10px 12px;
    background: rgba(255, 255, 255, 0.55);
    border-radius: 8px;
    border-left: 3px solid #f59e0b;
    font-weight: 600;
    color: #92400e;
    font-size: 0.88rem;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.82rem;
    margin-top: 8px;

    th, td {
      padding: 6px 10px;
      text-align: left;
      border-bottom: 1px solid #fde68a;
      color: #78350f;
    }

    th {
      color: #92400e;
      font-weight: 700;
    }
  }
`;

const ExamplePanel = ({ title, children }) => (
  <Panel>
    {title && <h5>{title}</h5>}
    {children}
  </Panel>
);

export default ExamplePanel;
