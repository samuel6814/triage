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
      equations={[{
        latex: TOKEN_EMBED,
        explanation: <p>Word + position + segment vectors combined per token.</p>,
        example: tokenEmbedExample,
      }]}
      compact
      flipMinHeight={200}
    />

    <MathSection
      title="Step 2 — Self-attention"
      equations={[{
        latex: ATTENTION,
        explanation: <p>Clinical words get higher weights than filler words.</p>,
        example: attentionExample,
      }]}
      compact
      flipMinHeight={280}
    />

    <MathSection
      title="Step 3 — Transformer layer (×12)"
      equations={[{
        latex: TRANSFORMER_LAYER,
        explanation: <p>Attention + feed-forward + layer norm, repeated 12 times.</p>,
        example: transformerLayerExample,
      }]}
      compact
      flipMinHeight={200}
    />

    <BioBERTFlowDiagram />

    <MathSection
      title="Step 4 — [CLS] summary & classify"
      equations={[
        {
          latex: CLS_HEAD,
          explanation: <p>[CLS] token summarises the whole sentence into 768 numbers.</p>,
          example: clsHeadExample,
        },
        {
          latex: ACUITY_SOFTMAX,
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
