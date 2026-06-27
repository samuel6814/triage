import React from 'react';
import {
  BeamerSlideContainer,
  BodyText,
  CaptionText,
  BulletList,
  DataTable,
  PlainEnglishBlock,
  SlideFigure,
} from '../../../../components/presentation/SlideLayout';
import MathSection from '../../../../components/presentation/MathSection';
import {
  ENCODER_Z,
  ENCODER_H,
  STACK_LAYERS,
} from '../../../../components/presentation/equations';

export const Page15 = () => (
  <BeamerSlideContainer style={{ justifyContent: 'center' }}>
    <SlideFigure style={{ height: '520px', marginBottom: '0.5rem' }}>
      <img src="/assets/bert_encoder.png" alt="BERT encoder stack diagram" />
    </SlideFigure>
    <CaptionText>
      Diagram: Zhang et al., d2l-ai, CC BY-SA 4.0. Each block = one encoder layer (self-attention + feed-forward).
    </CaptionText>
  </BeamerSlideContainer>
);

export const Page16 = () => (
  <BeamerSlideContainer>
    <BodyText>
      Each layer ℓ = 1, …, 12 performs two sub-steps with <strong>residual connections</strong>:
    </BodyText>
    <MathSection
      title="Inside one encoder layer"
      equations={[
        { latex: ENCODER_Z, label: 'Attention sub-layer Z⁽ℓ⁾', info: 'encoderStack' },
        { latex: ENCODER_H, label: 'FFN sub-layer H⁽ℓ⁾', info: 'transformerLayer' },
      ]}
      compact
      flipMinHeight={120}
    />
    <DataTable>
      <thead>
        <tr><th>Component</th><th>What it does</th></tr>
      </thead>
      <tbody>
        <tr><td>MultiHeadAttention</td><td>12 parallel self-attention heads; each learns different word relationships</td></tr>
        <tr><td>FFN</td><td>Two linear layers: FFN(x) = W₂ ReLU(W₁x + b₁) + b₂</td></tr>
        <tr><td>LayerNorm</td><td>Normalises activations — stabilises training across 12 layers</td></tr>
        <tr><td>Residual (+)</td><td>Adds input back to output — prevents information loss in deep stacks</td></tr>
      </tbody>
    </DataTable>
  </BeamerSlideContainer>
);

export const Page17 = () => (
  <BeamerSlideContainer>
    <MathSection
      title="Stacking 12 layers"
      equations={[{
        latex: STACK_LAYERS,
        label: 'Layer chain',
        info: 'encoderLayers',
      }]}
      compact
      flipMinHeight={100}
    />
    <BulletList>
      <li><strong>Shallow layers</strong> (1–4): recognise individual words and simple phrases</li>
      <li><strong>Middle layers</strong> (5–8): combine symptoms — &quot;headache&quot; + &quot;feverish&quot; + &quot;weak&quot;</li>
      <li><strong>Deep layers</strong> (9–12): abstract clinical urgency patterns</li>
      <li><strong>Parallel processing:</strong> all M tokens processed simultaneously (not left-to-right)</li>
    </BulletList>
    <BodyText>
      <strong>Output:</strong> h_[CLS] = H⁽ᴸ⁾ row 0 ∈ ℝ⁷⁶⁸ → fed to the classification head.
    </BodyText>
    <PlainEnglishBlock>
      Stacking layers is like reading a complaint once for words, once for phrases, and once for overall urgency.
    </PlainEnglishBlock>
  </BeamerSlideContainer>
);
