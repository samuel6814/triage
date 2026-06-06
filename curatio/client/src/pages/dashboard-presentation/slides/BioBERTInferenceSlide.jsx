import React from 'react';
import { SlideContainer, LeadText } from '../../../components/presentation/SlideLayout';
import MathSection from '../../../components/presentation/MathSection';
import PlainEnglish from '../../../components/presentation/PlainEnglish';
import { BioBERTFlowDiagram } from '../../../components/presentation/FlowDiagram';
import {
  TOKEN_EMBED,
  ATTENTION,
  TRANSFORMER_LAYER,
  CLS_HEAD,
  ACUITY_SOFTMAX,
} from '../../../components/presentation/equations';
import {
  tokenEmbedExample,
  attentionExample,
  transformerLayerExample,
  clsHeadExample,
  clsSoftmaxExample,
} from '../../../components/presentation/mathExamples';

const BioBERTInferenceSlide = () => (
  <SlideContainer>
    <LeadText>
      Inside BioBERT at inference — flip each formula to see &quot;crushing chest pain&quot;
      processed step by step.
    </LeadText>

    <MathSection
      title="Step 1 — Input embedding"
      info="tokenEmbed"
      equations={[{
        latex: TOKEN_EMBED,
        label: 'Token embedding',
        info: 'tokenEmbed',
        explanation: <p>Word + position + segment vectors combined per token.</p>,
        example: tokenEmbedExample,
      }]}
      compact
      flipMinHeight={200}
    />

    <MathSection
      title="Step 2 — Self-attention"
      info="attention"
      equations={[{
        latex: ATTENTION,
        label: 'Self-attention',
        info: 'attention',
        explanation: <p>Clinical words get higher weights than filler words.</p>,
        example: attentionExample,
      }]}
      compact
      flipMinHeight={280}
    />

    <MathSection
      title="Step 3 — Transformer layer (×12)"
      info="transformerLayer"
      equations={[{
        latex: TRANSFORMER_LAYER,
        label: 'Transformer layer',
        info: 'transformerLayer',
        explanation: <p>Attention + feed-forward + layer norm, repeated 12 times.</p>,
        example: transformerLayerExample,
      }]}
      compact
      flipMinHeight={200}
    />

    <BioBERTFlowDiagram />

    <MathSection
      title="Step 4 — [CLS] summary & classify"
      info="cls768"
      equations={[
        {
          latex: CLS_HEAD,
          label: '[CLS] → 768-dim summary',
          info: 'cls768',
          explanation: <p>[CLS] token summarises the whole sentence into 768 numbers.</p>,
          example: clsHeadExample,
        },
        {
          latex: ACUITY_SOFTMAX,
          label: 'Softmax classifier head',
          info: 'softmaxHead',
          explanation: <p>Softmax → acuity level + confidence for fusion.</p>,
          example: clsSoftmaxExample,
        },
      ]}
      compact
      flipMinHeight={220}
    />

    <PlainEnglish>
      <p>One forward pass: read sentence → summarise → output urgency percentage.</p>
    </PlainEnglish>
  </SlideContainer>
);

export default BioBERTInferenceSlide;
