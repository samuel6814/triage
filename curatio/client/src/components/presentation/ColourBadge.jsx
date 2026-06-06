import styled from 'styled-components';
import { SATS_COLORS } from './satsColors';

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 700;
  color: ${props => (props.colorKey === 'yellow' ? '#1e293b' : '#fff')};
  background: ${props => SATS_COLORS[props.colorKey] || '#64748b'};
  white-space: nowrap;
`;

const Dot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.9;
`;

const ColourBadge = ({ color, label }) => {
  const colorKey = color.toLowerCase();
  return (
    <Badge colorKey={colorKey}>
      <Dot />
      {label || color}
    </Badge>
  );
};

export default ColourBadge;
