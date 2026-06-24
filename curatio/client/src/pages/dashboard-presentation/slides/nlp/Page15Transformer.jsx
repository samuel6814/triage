import React from 'react';
import {
  CompactSlideContainer,
  LeadText,
  TwoColumn,
} from '../../../../components/presentation/SlideLayout';
import MathSection from '../../../../components/presentation/MathSection';
import { EncoderStack } from '../../../../components/presentation/diagrams/NlpDiagrams';
import {
  ENCODER_Z,
  ENCODER_H,
  FFN,
  STACK_LAYERS,
  CLS_HEAD,
} from '../../../../components/presentation/equations';

export const Page15 = () => (
  <CompactSlideContainer>
    <TwoColumn $ratio="0.45fr 1fr">
      <EncoderStack />
      <div>
        <LeadText>
          Each block = one encoder layer (self-attention + feed-forward). BioBERT-base uses L = 12 layers.
        </LeadText>
        <img
          src="/assets/bert_encoder.pdf"
          alt="BERT encoder stack diagram"
          style={{ width: '100%', maxHeight: '200px', objectFit: 'contain' }}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <LeadText style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
          Diagram: Zhang et al., d2l-ai, CC BY-SA 4.0
        </LeadText>
      </div>
    </TwoColumn>
  </CompactSlideContainer>
);

export const Page16 = () => (
  <CompactSlideContainer>
    <LeadText>
      Each layer ℓ = 1, …, 12 performs two sub-steps with residual connections and layer normalisation.
    </LeadText>
    <MathSection
      title="Inside one encoder layer"
      equations={[
        { latex: ENCODER_Z, label: 'Attention sub-layer Z^(ℓ)', info: 'encoderStack' },
        { latex: ENCODER_H, label: 'FFN sub-layer H^(ℓ)', info: 'transformerLayer' },
        { latex: FFN, label: 'Feed-forward network', info: 'encoderStack' },
      ]}
      compact
      flipMinHeight={160}
    />
    <table style={{ width: '100%', fontSize: '0.78rem', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ background: '#f0fdf4' }}>
          <th style={{ padding: '0.35rem', textAlign: 'left' }}>Component</th>
          <th style={{ padding: '0.35rem', textAlign: 'left' }}>What it does</th>
        </tr>
      </thead>
      <tbody>
        <tr><td style={{ padding: '0.35rem' }}>MultiHeadAttention</td><td>12 parallel heads — different word relationships</td></tr>
        <tr><td style={{ padding: '0.35rem' }}>FFN</td><td>Two linear layers with ReLU between</td></tr>
        <tr><td style={{ padding: '0.35rem' }}>LayerNorm</td><td>Stabilises training across 12 layers</td></tr>
        <tr><td style={{ padding: '0.35rem' }}>Residual (+)</td><td>Prevents information loss in deep stacks</td></tr>
      </tbody>
    </table>
  </CompactSlideContainer>
);

export const Page17 = () => (
  <CompactSlideContainer>
    <MathSection
      title="Stacking 12 layers"
      equations={[
        { latex: STACK_LAYERS, label: 'Layer chain', info: 'encoderLayers' },
        { latex: CLS_HEAD, label: 'Final [CLS] output', info: 'cls768' },
      ]}
      compact
      flipMinHeight={140}
    />
    <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem', color: '#475569' }}>
      <li><strong>Shallow layers (1–4):</strong> individual words and simple phrases</li>
      <li><strong>Middle layers (5–8):</strong> combine headache + feverish + weak</li>
      <li><strong>Deep layers (9–12):</strong> abstract clinical urgency patterns</li>
      <li><strong>Parallel:</strong> all M tokens processed simultaneously — not left-to-right</li>
    </ul>
  </CompactSlideContainer>
);
