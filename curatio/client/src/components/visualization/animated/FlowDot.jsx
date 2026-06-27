import React from 'react';
import styled from 'styled-components';

const Svg = styled.svg`
  width: 100%;
  max-width: 640px;
  height: auto;
  overflow: visible;
`;

const Dot = styled.circle`
  fill: #22c55e;
  filter: drop-shadow(0 0 6px #22c55e);
`;

/**
 * Animated dot traveling along a horizontal path with optional merge point.
 */
const FlowDot = ({ className, variant = 'dual' }) => {
  if (variant === 'dual') {
    return (
      <Svg className={className} viewBox="0 0 520 120">
        <path id="tews-path" d="M 40 40 L 200 40 L 260 70" fill="none" stroke="#e2e8f0" strokeWidth="3" strokeDasharray="6 4" />
        <path id="nlp-path" d="M 40 90 L 200 90 L 260 70" fill="none" stroke="#e2e8f0" strokeWidth="3" strokeDasharray="6 4" />
        <circle cx="260" cy="70" r="22" fill="#dcfce7" stroke="#166534" strokeWidth="2" className="viz-fusion-node" />
        <text x="260" y="75" textAnchor="middle" fontSize="11" fontWeight="700" fill="#166534">Fusion</text>
        <circle cx="380" cy="70" r="18" fill="#fde047" stroke="#ca8a04" strokeWidth="2" className="viz-output-badge" opacity="0" />
        <text x="380" y="75" textAnchor="middle" fontSize="10" fontWeight="700" fill="#1e293b" className="viz-output-label" opacity="0">Yellow</text>
        <Dot r="8" className="viz-dot-tews" cx="40" cy="40" />
        <Dot r="8" className="viz-dot-nlp" cx="40" cy="90" style={{ fill: '#3b82f6' }} />
        <text x="40" y="28" textAnchor="middle" fontSize="10" fontWeight="600" fill="#64748b">TEWS</text>
        <text x="40" y="108" textAnchor="middle" fontSize="10" fontWeight="600" fill="#64748b">BioBERT</text>
      </Svg>
    );
  }

  return (
    <Svg className={className} viewBox="0 0 600 80">
      {['Tokenize', 'Embed', 'Encode', 'Classify'].map((label, i) => {
        const x = [0, 150, 310, 470][i];
        return (
          <g key={label}>
            <rect x={x} y="20" width="120" height="40" rx="8" fill="#f0fdf4" stroke="#166534" strokeWidth="1.5" className={`viz-pipe-box viz-box-${i}`} />
            <text x={x + 60} y="45" textAnchor="middle" fontSize="11" fontWeight="600" fill="#166534">{label}</text>
            {i < 3 && <line x1={x + 120} y1="40" x2={x + 150} y2="40" stroke="#cbd5e1" strokeWidth="2" />}
          </g>
        );
      })}
      <Dot r="10" className="viz-packet" cx="60" cy="40" />
    </Svg>
  );
};

export default FlowDot;
