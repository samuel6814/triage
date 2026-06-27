import React from 'react';
import styled from 'styled-components';
import { TokenChip } from './VisualizationSceneShell';

export const AnimatedTokenRow = ({ tokens, visibleCount, highlightIndex, className }) => (
  <div className={className} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.15rem', justifyContent: 'center' }}>
    {tokens.map((tok, i) => (
      <TokenChip
        key={`${tok}-${i}`}
        className="viz-token"
        data-index={i}
        $highlight={i === highlightIndex}
        $mask={tok === '[MASK]'}
        $visible={i < visibleCount}
      >
        {tok}
      </TokenChip>
    ))}
  </div>
);

export default AnimatedTokenRow;
