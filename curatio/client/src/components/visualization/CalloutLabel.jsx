import React from 'react';
import styled from 'styled-components';

const Wrap = styled.div`
  position: absolute;
  z-index: 2;
  ${(p) => {
    switch (p.$position) {
      case 'top':
        return 'top: 0; left: 50%; transform: translateX(-50%);';
      case 'bottom':
        return 'bottom: 0; left: 50%; transform: translateX(-50%);';
      case 'left':
        return 'left: 0; top: 50%; transform: translateY(-50%);';
      case 'right':
        return 'right: 0; top: 50%; transform: translateY(-50%);';
      default:
        return 'top: 8%; right: 4%;';
    }
  }}
`;

const Badge = styled.span`
  display: inline-block;
  padding: 0.45rem 0.85rem;
  border-radius: 999px;
  background: ${(p) => (p.$accent ? '#166534' : '#ffffff')};
  color: ${(p) => (p.$accent ? '#ffffff' : '#166534')};
  border: 2px solid #166534;
  font-size: 0.95rem;
  font-weight: 700;
  white-space: nowrap;
  box-shadow: 0 4px 14px rgba(22, 101, 52, 0.15);
  opacity: ${(p) => (p.$visible === false ? 0 : 1)};
  transition: opacity 0.3s ease;
`;

const CalloutLabel = ({
  children,
  className,
  position = 'right',
  accent = false,
  visible = true,
}) => (
  <Wrap $position={position} className={className}>
    <Badge $accent={accent} $visible={visible}>{children}</Badge>
  </Wrap>
);

export default CalloutLabel;
