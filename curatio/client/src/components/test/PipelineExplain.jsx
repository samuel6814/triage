import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import MathBlock from '../presentation/MathBlock';
import {
  TOKENIZATION_TAU,
  EMBEDDING_LOOKUP,
  ACUITY_SOFTMAX,
  FUSION_SAFETY,
  TEWS_COLOUR_MAP,
} from '../presentation/equations';

const StageRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 1rem;
`;

const Stage = styled.div`
  flex: 1 1 100px;
  min-width: 100px;
  padding: 10px 12px;
  border-radius: 12px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  font-size: 0.78rem;
  color: #166534;

  strong {
    display: block;
    font-size: 0.82rem;
    margin-bottom: 4px;
  }
`;

const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 0.75rem 0 1rem;
`;

const Chip = styled.span`
  padding: 4px 8px;
  border-radius: 8px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.75rem;
  color: #334155;
`;

const Meta = styled.p`
  margin: 0 0 0.75rem;
  font-size: 0.85rem;
  color: #64748b;
`;

const EqCard = styled.div`
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: 14px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
`;

const EqTitle = styled.h4`
  margin: 0 0 0.5rem;
  font-size: 0.88rem;
  font-weight: 800;
  color: #166534;
`;

const Caption = styled.p`
  margin: 0.65rem 0 0;
  font-size: 0.82rem;
  color: #475569;
  line-height: 1.45;
`;

const VizLink = styled(Link)`
  display: inline-block;
  margin-top: 0.5rem;
  font-weight: 700;
  color: #166534;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const MATH_CARDS = [
  {
    title: 'Tokenization',
    latex: TOKENIZATION_TAU,
    caption: 'The complaint becomes a sequence of WordPiece tokens, capped at 128.',
  },
  {
    title: 'Embedding lookup',
    latex: EMBEDDING_LOOKUP,
    caption: 'Each token ID selects a 768-dimensional vector that carries meaning.',
  },
  {
    title: 'Acuity softmax',
    latex: ACUITY_SOFTMAX,
    caption: 'The classification head turns the [CLS] summary into five class probabilities.',
  },
  {
    title: 'TEWS colour bands',
    latex: TEWS_COLOUR_MAP,
    caption: 'When vitals exist, TEWS total maps to a colour band for fusion.',
  },
  {
    title: 'Fusion safety',
    latex: FUSION_SAFETY,
    caption: 'Final colour is never less urgent than any active layer vote.',
  },
];

export function PipelinePanel({ explain, vizLabel }) {
  if (!explain) {
    return <Meta>Run a prediction to load tokens for this complaint.</Meta>;
  }

  return (
    <div>
      <Meta>
        {explain.token_count} tokens
        {explain.truncated ? ' (truncated to 128)' : ''} — real BioBERT WordPiece pieces
      </Meta>
      <ChipRow>
        {(explain.tokens || []).map((tok, i) => (
          <Chip key={`${tok}-${i}`}>{tok}</Chip>
        ))}
      </ChipRow>
      <StageRow>
        {(explain.stages || []).map((s) => (
          <Stage key={s.id}>
            <strong>{s.title}</strong>
            {s.blurb}
          </Stage>
        ))}
      </StageRow>
      <VizLink to="/visualization/1">{vizLabel}</VizLink>
    </div>
  );
}

export function MathPanel() {
  return (
    <div>
      {MATH_CARDS.map((card) => (
        <EqCard key={card.title}>
          <EqTitle>{card.title}</EqTitle>
          <MathBlock equation={card.latex} compact />
          <Caption>{card.caption}</Caption>
        </EqCard>
      ))}
    </div>
  );
}
