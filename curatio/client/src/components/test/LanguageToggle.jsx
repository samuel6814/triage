import React from 'react';
import styled from 'styled-components';

const Row = styled.div`
  display: inline-flex;
  padding: 4px;
  border-radius: 999px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  gap: 4px;
`;

const Tab = styled.button`
  padding: 8px 16px;
  border-radius: 999px;
  border: none;
  background: ${(p) => (p.$active ? '#166534' : 'transparent')};
  color: ${(p) => (p.$active ? '#fff' : '#475569')};
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
`;

export default function LanguageToggle({ value, onChange, labels }) {
  return (
    <Row role="tablist" aria-label={labels.language}>
      <Tab
        type="button"
        role="tab"
        $active={value === 'en'}
        aria-selected={value === 'en'}
        onClick={() => onChange('en')}
      >
        {labels.english}
      </Tab>
      <Tab
        type="button"
        role="tab"
        $active={value === 'tw'}
        aria-selected={value === 'tw'}
        onClick={() => onChange('tw')}
      >
        {labels.twi}
      </Tab>
    </Row>
  );
}
