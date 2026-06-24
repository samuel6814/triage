import React from 'react';
import styled from 'styled-components';
import { SATS_COLORS } from '../satsColors';

const Wrap = styled.div`
  width: 100%;
  overflow: hidden;
`;

const Svg = styled.svg`
  display: block;
  margin: 0 auto;
  max-width: 100%;
  height: auto;
`;

export const SatsBar = () => (
  <Wrap>
    <Svg viewBox="0 0 420 72" width="420" height="72">
      <rect x="0" y="14" width="36" height="18" fill={SATS_COLORS.red} rx="2" />
      <text x="18" y="26" textAnchor="middle" fontSize="9" fill="#fff" fontWeight="700">Red</text>
      <rect x="40" y="14" width="36" height="18" fill={SATS_COLORS.blue} rx="2" />
      <text x="58" y="26" textAnchor="middle" fontSize="9" fill="#fff" fontWeight="700">Blue</text>
      <text x="38" y="8" textAnchor="middle" fontSize="8" fill="#64748b">Immediate / special</text>

      <rect x="100" y="14" width="36" height="18" fill={SATS_COLORS.orange} rx="2" />
      <text x="118" y="26" textAnchor="middle" fontSize="9" fill="#fff" fontWeight="700">Orange</text>
      <rect x="142" y="14" width="36" height="18" fill={SATS_COLORS.yellow} rx="2" />
      <text x="160" y="26" textAnchor="middle" fontSize="9" fill="#1e293b" fontWeight="700">Yellow</text>
      <rect x="184" y="14" width="36" height="18" fill={SATS_COLORS.green} rx="2" />
      <text x="202" y="26" textAnchor="middle" fontSize="9" fill="#fff" fontWeight="700">Green</text>

      <line x1="98" y1="42" x2="222" y2="42" stroke="#475569" strokeWidth="1.5" markerEnd="url(#satsArrow)" />
      <text x="160" y="56" textAnchor="middle" fontSize="8" fill="#64748b">Decreasing urgency (living patients)</text>
      <text x="0" y="68" fontSize="7.5" fill="#64748b">Blue = deceased on arrival (dignity protocol)</text>
      <defs>
        <marker id="satsArrow" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
          <polygon points="0 0, 6 2.5, 0 5" fill="#475569" />
        </marker>
      </defs>
    </Svg>
  </Wrap>
);

export const TokenizationPipeline = () => (
  <Wrap>
    <Svg viewBox="0 0 480 56" width="480" height="56">
      {[
        { x: 0, label: 'Sentence X' },
        { x: 120, label: 'WordPiece split' },
        { x: 250, label: 'Vocab lookup' },
        { x: 370, label: 'Integer IDs' },
      ].map((box, i, arr) => (
        <g key={box.label}>
          <rect x={box.x} y="8" width="100" height="40" rx="6" fill="#f0fdf4" stroke="#166534" strokeWidth="1.2" />
          <text x={box.x + 50} y="32" textAnchor="middle" fontSize="10" fontWeight="600" fill="#1e293b">{box.label}</text>
          {i < arr.length - 1 && (
            <line x1={box.x + 100} y1="28" x2={arr[i + 1].x} y2="28" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#tokArr)" />
          )}
        </g>
      ))}
      <defs>
        <marker id="tokArr" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
          <polygon points="0 0, 6 2.5, 0 5" fill="#64748b" />
        </marker>
      </defs>
    </Svg>
  </Wrap>
);

export const ClsTokenDiagram = () => (
  <Wrap>
    <Svg viewBox="0 0 360 100" width="360" height="100">
      {['[CLS]', 'i', 'have', 'head', 'feel', 'fever', '[SEP]'].map((tok, i) => (
        <g key={tok}>
          <rect
            x={8 + i * 48}
            y="8"
            width="42"
            height="28"
            rx="4"
            fill={tok === '[CLS]' ? SATS_COLORS.yellow + '66' : '#f8fafc'}
            stroke={tok === '[CLS]' ? '#166534' : '#cbd5e1'}
            strokeWidth={tok === '[CLS]' ? 2 : 1}
          />
          <text x={29 + i * 48} y="26" textAnchor="middle" fontSize="8" fontWeight={tok === '[CLS]' ? 700 : 500}>{tok}</text>
        </g>
      ))}
      <rect x="60" y="52" width="140" height="36" rx="6" fill="#f0fdf4" stroke="#166534" />
      <text x="130" y="68" textAnchor="middle" fontSize="9" fontWeight="600">768-dim summary</text>
      <text x="130" y="80" textAnchor="middle" fontSize="8" fill="#64748b">h_[CLS]</text>
      <line x1="29" y1="36" x2="100" y2="52" stroke="#166534" strokeWidth="1.5" markerEnd="url(#clsArr)" />
      <text x="220" y="72" fontSize="9" fill="#166534">→ acuity prediction</text>
      <defs>
        <marker id="clsArr" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
          <polygon points="0 0, 6 2.5, 0 5" fill="#166534" />
        </marker>
      </defs>
    </Svg>
  </Wrap>
);

export const EncoderStack = () => (
  <Wrap>
    <Svg viewBox="0 0 200 280" width="200" height="280">
      {[...Array(12)].map((_, i) => (
        <g key={i}>
          <rect x="30" y={240 - i * 20} width="140" height="16" rx="3" fill="#f0fdf4" stroke="#166534" strokeWidth="1" />
          <text x="100" y={252 - i * 20} textAnchor="middle" fontSize="8" fill="#166534">Layer {12 - i}</text>
        </g>
      ))}
      <text x="100" y="12" textAnchor="middle" fontSize="9" fontWeight="700" fill="#1e293b">H^(L) output</text>
      <text x="100" y="272" textAnchor="middle" fontSize="9" fontWeight="700" fill="#1e293b">H^(0) input</text>
    </Svg>
  </Wrap>
);

export const AttentionFlow = () => (
  <Wrap>
    <Svg viewBox="0 0 400 200" width="400" height="200">
      <rect x="120" y="8" width="160" height="36" rx="6" fill="#dcfce7" stroke="#166534" strokeWidth="1.5" />
      <text x="200" y="24" textAnchor="middle" fontSize="10" fontWeight="700">Input embeddings</text>
      <text x="200" y="36" textAnchor="middle" fontSize="8" fill="#64748b">headache, feverish, weak</text>

      {[
        { x: 20, label: 'Query (Q)', sub: 'What am I looking for?' },
        { x: 150, label: 'Key (K)', sub: 'What do I offer?' },
        { x: 280, label: 'Value (V)', sub: 'Content to mix' },
      ].map((box) => (
        <g key={box.label}>
          <rect x={box.x} y="70" width="100" height="44" rx="6" fill="#f8fafc" stroke="#64748b" />
          <text x={box.x + 50} y="88" textAnchor="middle" fontSize="9" fontWeight="700">{box.label}</text>
          <text x={box.x + 50} y="102" textAnchor="middle" fontSize="7" fill="#64748b">{box.sub}</text>
          <line x1={box.x + 50} y1="44" x2={box.x + 50} y2="70" stroke="#64748b" strokeWidth="1.2" />
        </g>
      ))}

      <rect x="100" y="140" width="200" height="36" rx="6" fill="#fef3c7" stroke="#d97706" />
      <text x="200" y="158" textAnchor="middle" fontSize="10" fontWeight="700">softmax(QKᵀ/√d_k) · V</text>
      <text x="200" y="170" textAnchor="middle" fontSize="8" fill="#64748b">Weighted context per token</text>
      {[70, 200, 330].map((x) => (
        <line key={x} x1={x} y1="114" x2={200} y2="140" stroke="#64748b" strokeWidth="1" />
      ))}
    </Svg>
  </Wrap>
);

export const MlmMask = () => (
  <Wrap>
    <Svg viewBox="0 0 400 80" width="400" height="80">
      {['The', 'patient', '[MASK]', 'severe', 'headache'].map((tok, i) => (
        <g key={i}>
          <rect
            x={8 + i * 76}
            y="16"
            width="68"
            height="32"
            rx="4"
            fill={tok === '[MASK]' ? '#fef3c7' : '#f8fafc'}
            stroke={tok === '[MASK]' ? '#d97706' : '#cbd5e1'}
            strokeWidth={tok === '[MASK]' ? 2 : 1}
          />
          <text x={42 + i * 76} y="36" textAnchor="middle" fontSize="9" fontWeight={tok === '[MASK]' ? 700 : 500}>{tok}</text>
        </g>
      ))}
      <text x="200" y="68" textAnchor="middle" fontSize="9" fill="#64748b">~15% of tokens masked during PubMed pre-training</text>
    </Svg>
  </Wrap>
);

export const NlpPipelineDiagram = () => (
  <Wrap>
    <Svg viewBox="0 0 560 48" width="560" height="48">
      {[
        'Chief Complaint', 'Tokenize', 'Embed 768-d', 'BioBERT 12L', 'Softmax 5', 'SATS Colour',
      ].map((label, i, arr) => (
        <g key={label}>
          <rect x={i * 92} y="6" width="84" height="36" rx="5" fill={i === arr.length - 1 ? '#fef9c3' : '#f0fdf4'} stroke="#166534" />
          <text x={i * 92 + 42} y="28" textAnchor="middle" fontSize="8" fontWeight="600">{label}</text>
          {i < arr.length - 1 && (
            <line x1={i * 92 + 84} y1="24" x2={(i + 1) * 92} y2="24" stroke="#64748b" strokeWidth="1.2" markerEnd="url(#nlpArr)" />
          )}
        </g>
      ))}
      <defs>
        <marker id="nlpArr" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
          <polygon points="0 0, 6 2.5, 0 5" fill="#64748b" />
        </marker>
      </defs>
    </Svg>
  </Wrap>
);

export const DualPathwayDiagram = () => (
  <Wrap>
    <Svg viewBox="0 0 520 140" width="520" height="140">
      <rect x="10" y="50" width="70" height="36" rx="6" fill="#f0fdf4" stroke="#166534" />
      <text x="45" y="72" textAnchor="middle" fontSize="9" fontWeight="700">Patient</text>
      <rect x="110" y="20" width="80" height="36" rx="6" fill="#f8fafc" stroke="#64748b" />
      <text x="150" y="36" textAnchor="middle" fontSize="8" fontWeight="600">Nurse vitals</text>
      <text x="150" y="48" textAnchor="middle" fontSize="7" fill="#64748b">objective</text>
      <rect x="220" y="20" width="80" height="36" rx="6" fill="#f8fafc" stroke="#64748b" />
      <text x="260" y="42" textAnchor="middle" fontSize="8" fontWeight="600">TEWS</text>
      <rect x="110" y="80" width="80" height="36" rx="6" fill="#f8fafc" stroke="#64748b" />
      <text x="150" y="96" textAnchor="middle" fontSize="8" fontWeight="600">Chatbot</text>
      <text x="150" y="108" textAnchor="middle" fontSize="7" fill="#64748b">subjective X</text>
      <rect x="220" y="80" width="80" height="36" rx="6" fill="#f0fdf4" stroke="#166534" />
      <text x="260" y="102" textAnchor="middle" fontSize="8" fontWeight="600">BioBERT</text>
      <rect x="340" y="50" width="80" height="36" rx="6" fill="#ffedd5" stroke="#ea580c" />
      <text x="380" y="72" textAnchor="middle" fontSize="8" fontWeight="700">Fusion</text>
      <rect x="440" y="50" width="60" height="36" rx="6" fill="#fef9c3" stroke="#ca8a04" />
      <text x="470" y="72" textAnchor="middle" fontSize="8" fontWeight="700">Colour C</text>
      <line x1="80" y1="60" x2="110" y2="38" stroke="#64748b" strokeWidth="1.2" />
      <line x1="190" y1="38" x2="220" y2="38" stroke="#64748b" strokeWidth="1.2" />
      <line x1="300" y1="38" x2="340" y2="58" stroke="#64748b" strokeWidth="1.2" />
      <line x1="80" y1="72" x2="110" y2="98" stroke="#64748b" strokeWidth="1.2" />
      <line x1="190" y1="98" x2="220" y2="98" stroke="#64748b" strokeWidth="1.2" />
      <line x1="300" y1="98" x2="340" y2="78" stroke="#64748b" strokeWidth="1.2" />
      <line x1="420" y1="68" x2="440" y2="68" stroke="#64748b" strokeWidth="1.2" />
    </Svg>
  </Wrap>
);

export const EndToEndDiagram = () => (
  <Wrap>
    <Svg viewBox="0 0 480 60" width="480" height="60">
      {['Complaint X', 'τ → IDs', 'H^(0)', '12 layers', 'ŷ softmax', 'Yellow 72%'].map((label, i, arr) => (
        <g key={label}>
          <rect x={i * 78} y="10" width="72" height="32" rx="5" fill={i === arr.length - 1 ? '#fef9c3' : '#f0fdf4'} stroke="#166534" />
          <text x={i * 78 + 36} y="30" textAnchor="middle" fontSize="7.5" fontWeight="600">{label}</text>
          {i < arr.length - 1 && (
            <line x1={i * 78 + 72} y1="26" x2={(i + 1) * 78} y2="26" stroke="#64748b" strokeWidth="1" markerEnd="url(#e2e)" />
          )}
        </g>
      ))}
      <defs>
        <marker id="e2e" markerWidth="5" markerHeight="4" refX="4" refY="2" orient="auto">
          <polygon points="0 0, 5 2, 0 4" fill="#64748b" />
        </marker>
      </defs>
    </Svg>
  </Wrap>
);
