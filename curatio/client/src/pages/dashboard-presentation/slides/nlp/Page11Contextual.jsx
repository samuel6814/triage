import React from 'react';
import {
  CompactSlideContainer,
  LeadText,
} from '../../../../components/presentation/SlideLayout';
import MathSection from '../../../../components/presentation/MathSection';
import { CONTEXTUAL_SUM, TOKEN_EMBED } from '../../../../components/presentation/equations';

export const Page11 = () => (
  <CompactSlideContainer>
    <LeadText>
      Before attention, each token gets three learned vectors summed element-wise: word meaning,
      position in sentence, and segment ID.
    </LeadText>
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center', fontSize: '0.78rem' }}>
      {['E_word(t_i)', '+', 'E_pos(i)', '+', 'E_seg(t_i)', '=', 'H^(0)[i]'].map((part) => (
        <span
          key={part}
          style={{
            padding: '0.35rem 0.6rem',
            background: part === '=' ? 'transparent' : '#f0fdf4',
            border: part === '=' ? 'none' : '1px solid #bbf7d0',
            borderRadius: '6px',
            fontWeight: part.includes('H') ? 700 : 500,
          }}
        >
          {part}
        </span>
      ))}
    </div>
    <LeadText style={{ fontSize: '0.85rem' }}>
      For &quot;headache&quot; at position 4: word vector + position-4 vector + segment-0 vector → one 768-d input row.
    </LeadText>
  </CompactSlideContainer>
);

export const Page12 = () => (
  <CompactSlideContainer>
    <MathSection
      title="Contextual mapping formula"
      equations={[
        {
          latex: CONTEXTUAL_SUM,
          label: 'H^(0)[i] sum',
          info: 'contextualSum',
        },
        {
          latex: TOKEN_EMBED,
          label: 'Equivalent notation',
          info: 'tokenEmbed',
        },
      ]}
      compact
      flipMinHeight={140}
      explanation={
        <p>
          Same formula as standard BERT — three embeddings added per token before the first encoder layer.
        </p>
      }
    />
  </CompactSlideContainer>
);
