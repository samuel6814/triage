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
  width: 100%;
  height: auto;
`;

export const SatsBar = () => (
  <Wrap>
    <Svg viewBox="0 0 520 96" preserveAspectRatio="xMidYMid meet">
      <rect x="0" y="18" width="44" height="24" fill={SATS_COLORS.red} rx="3" />
      <text x="22" y="34" textAnchor="middle" fontSize="12" fill="#fff" fontWeight="700">Red</text>
      <rect x="50" y="18" width="44" height="24" fill={SATS_COLORS.blue} rx="3" />
      <text x="72" y="34" textAnchor="middle" fontSize="12" fill="#fff" fontWeight="700">Blue</text>
      <text x="47" y="10" textAnchor="middle" fontSize="11" fill="#64748b">Immediate / special</text>

      <rect x="130" y="18" width="44" height="24" fill={SATS_COLORS.orange} rx="3" />
      <text x="152" y="34" textAnchor="middle" fontSize="12" fill="#fff" fontWeight="700">Orange</text>
      <rect x="182" y="18" width="44" height="24" fill={SATS_COLORS.yellow} rx="3" />
      <text x="204" y="34" textAnchor="middle" fontSize="12" fill="#1e293b" fontWeight="700">Yellow</text>
      <rect x="234" y="18" width="44" height="24" fill={SATS_COLORS.green} rx="3" />
      <text x="256" y="34" textAnchor="middle" fontSize="12" fill="#fff" fontWeight="700">Green</text>

      <line x1="126" y1="56" x2="282" y2="56" stroke="#475569" strokeWidth="2" markerEnd="url(#satsArrow)" />
      <text x="204" y="74" textAnchor="middle" fontSize="11" fill="#64748b">Decreasing urgency (living patients)</text>
      <text x="0" y="90" fontSize="10" fill="#64748b">Blue = deceased on arrival (dignity protocol, not low urgency)</text>
      <defs>
        <marker id="satsArrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#475569" />
        </marker>
      </defs>
    </Svg>
  </Wrap>
);

export const TokenizationPipeline = () => (
  <Wrap>
    <Svg viewBox="0 0 600 72" preserveAspectRatio="xMidYMid meet">
      {[
        { x: 0, label: 'Sentence X' },
        { x: 150, label: 'WordPiece split' },
        { x: 310, label: 'Vocab lookup' },
        { x: 470, label: 'Integer IDs' },
      ].map((box, i, arr) => (
        <g key={box.label}>
          <rect x={box.x} y="10" width="120" height="52" rx="8" fill="#f0fdf4" stroke="#166534" strokeWidth="1.5" />
          <text x={box.x + 60} y="42" textAnchor="middle" fontSize="14" fontWeight="600" fill="#1e293b">{box.label}</text>
          {i < arr.length - 1 && (
            <line x1={box.x + 120} y1="36" x2={arr[i + 1].x} y2="36" stroke="#64748b" strokeWidth="2" markerEnd="url(#tokArr)" />
          )}
        </g>
      ))}
      <defs>
        <marker id="tokArr" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#64748b" />
        </marker>
      </defs>
    </Svg>
  </Wrap>
);

export const ClsTokenDiagram = () => (
  <Wrap>
    <Svg viewBox="0 0 520 130" preserveAspectRatio="xMidYMid meet">
      {['[CLS]', 'i', 'have', 'head', 'feel', 'fever', '[SEP]'].map((tok, i) => (
        <g key={tok}>
          <rect
            x={8 + i * 70}
            y="10"
            width="62"
            height="36"
            rx="6"
            fill={tok === '[CLS]' ? `${SATS_COLORS.yellow}66` : '#f8fafc'}
            stroke={tok === '[CLS]' ? '#166534' : '#cbd5e1'}
            strokeWidth={tok === '[CLS]' ? 2 : 1}
          />
          <text x={39 + i * 70} y="33" textAnchor="middle" fontSize="12" fontWeight={tok === '[CLS]' ? 700 : 500}>{tok}</text>
        </g>
      ))}
      <rect x="80" y="68" width="180" height="48" rx="8" fill="#f0fdf4" stroke="#166534" />
      <text x="170" y="90" textAnchor="middle" fontSize="13" fontWeight="600">768-dim summary</text>
      <text x="170" y="106" textAnchor="middle" fontSize="12" fill="#64748b">h_[CLS]</text>
      <line x1="39" y1="46" x2="130" y2="68" stroke="#166534" strokeWidth="2" markerEnd="url(#clsArr)" />
      <text x="320" y="96" fontSize="13" fill="#166534" fontWeight="600">→ acuity prediction</text>
      <defs>
        <marker id="clsArr" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#166534" />
        </marker>
      </defs>
    </Svg>
  </Wrap>
);

export const EncoderStack = () => (
  <Wrap>
    <Svg viewBox="0 0 220 320" preserveAspectRatio="xMidYMid meet">
      {[...Array(12)].map((_, i) => (
        <g key={i}>
          <rect x="30" y={270 - i * 22} width="160" height="20" rx="4" fill="#f0fdf4" stroke="#166534" strokeWidth="1.2" />
          <text x="110" y={284 - i * 22} textAnchor="middle" fontSize="11" fill="#166534" fontWeight="600">Layer {12 - i}</text>
        </g>
      ))}
      <text x="110" y="16" textAnchor="middle" fontSize="13" fontWeight="700" fill="#1e293b">H^(L) output</text>
      <text x="110" y="310" textAnchor="middle" fontSize="13" fontWeight="700" fill="#1e293b">H^(0) input</text>
    </Svg>
  </Wrap>
);

export const AttentionFlow = () => (
  <Wrap>
    <Svg viewBox="0 0 400 480" preserveAspectRatio="xMidYMid meet">
      <rect x="60" y="8" width="280" height="52" rx="8" fill="#dcfce7" stroke="#166534" strokeWidth="1.5" />
      <text x="200" y="30" textAnchor="middle" fontSize="13" fontWeight="700">1. Input Embeddings</text>
      <text x="200" y="48" textAnchor="middle" fontSize="11" fill="#64748b">headache, feverish, weak</text>

      {[
        { x: 8, label: 'Query (Q)', sub: 'What am I looking for?' },
        { x: 136, label: 'Key (K)', sub: 'What do I represent?' },
        { x: 264, label: 'Value (V)', sub: 'What is my content?' },
      ].map((box) => (
        <g key={box.label}>
          <rect x={box.x} y="88" width="120" height="52" rx="8" fill="#f8fafc" stroke="#64748b" strokeWidth="1.2" />
          <text x={box.x + 60} y="110" textAnchor="middle" fontSize="12" fontWeight="700">{box.label}</text>
          <text x={box.x + 60} y="128" textAnchor="middle" fontSize="10" fill="#64748b">{box.sub}</text>
          <line x1={box.x + 60} y1="60" x2={box.x + 60} y2="88" stroke="#64748b" strokeWidth="1.5" />
          <text x={box.x + 60} y="78" textAnchor="middle" fontSize="9" fill="#64748b" fontStyle="italic">Linear</text>
        </g>
      ))}

      <rect x="80" y="168" width="240" height="48" rx="8" fill="#fef9c3" stroke="#ca8a04" strokeWidth="1.5" />
      <text x="200" y="190" textAnchor="middle" fontSize="13" fontWeight="700">2. Alignment Scores</text>
      <text x="200" y="206" textAnchor="middle" fontSize="11" fill="#64748b">Q · Kᵀ</text>
      {[68, 196, 324].map((x) => (
        <line key={x} x1={x} y1="140" x2={200} y2="168" stroke="#64748b" strokeWidth="1.5" />
      ))}

      <rect x="80" y="248" width="240" height="48" rx="8" fill="#ffedd5" stroke="#ea580c" strokeWidth="1.5" />
      <text x="200" y="270" textAnchor="middle" fontSize="13" fontWeight="700">3. Softmax Normalization</text>
      <text x="200" y="286" textAnchor="middle" fontSize="10" fill="#64748b">Scale by 1/√d_k → probabilities</text>
      <line x1="200" y1="216" x2="200" y2="248" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#attArr)" />

      <rect x="60" y="328" width="280" height="52" rx="8" fill="#fee2e2" stroke="#dc2626" strokeWidth="1.5" />
      <text x="200" y="350" textAnchor="middle" fontSize="13" fontWeight="700">4. Context-Aware Output</text>
      <text x="200" y="368" textAnchor="middle" fontSize="11" fill="#64748b">Attention × V (weighted sum)</text>
      <line x1="200" y1="296" x2="200" y2="328" stroke="#64748b" strokeWidth="1.5" />
      <line x1="324" y1="140" x2="340" y2="354" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 3" />

      <defs>
        <marker id="attArr" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#64748b" />
        </marker>
      </defs>
    </Svg>
  </Wrap>
);

export const MlmMask = () => (
  <Wrap>
    <Svg viewBox="0 0 520 100" preserveAspectRatio="xMidYMid meet">
      {['The', 'patient', '[MASK]', 'severe', 'headache'].map((tok, i) => (
        <g key={i}>
          <rect
            x={10 + i * 98}
            y="18"
            width="88"
            height="40"
            rx="6"
            fill={tok === '[MASK]' ? '#fef3c7' : '#f8fafc'}
            stroke={tok === '[MASK]' ? '#d97706' : '#cbd5e1'}
            strokeWidth={tok === '[MASK]' ? 2 : 1}
          />
          <text x={54 + i * 98} y="44" textAnchor="middle" fontSize="13" fontWeight={tok === '[MASK]' ? 700 : 500}>{tok}</text>
        </g>
      ))}
      <text x="260" y="82" textAnchor="middle" fontSize="12" fill="#64748b">~15% of tokens masked during PubMed pre-training</text>
    </Svg>
  </Wrap>
);

export const NlpPipelineDiagram = () => (
  <Wrap>
    <Svg viewBox="0 0 640 64" preserveAspectRatio="xMidYMid meet">
      {[
        'Chief Complaint', 'Tokenize', 'Embed 768-d', 'BioBERT 12L', 'Softmax 5', 'SATS Colour',
      ].map((label, i, arr) => (
        <g key={label}>
          <rect x={i * 106} y="8" width="98" height="48" rx="6" fill={i === arr.length - 1 ? '#fef9c3' : '#f0fdf4'} stroke="#166534" strokeWidth="1.5" />
          <text x={i * 106 + 49} y="36" textAnchor="middle" fontSize="11" fontWeight="600">{label}</text>
          {i < arr.length - 1 && (
            <line x1={i * 106 + 98} y1="32" x2={(i + 1) * 106} y2="32" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#nlpArr)" />
          )}
        </g>
      ))}
      <defs>
        <marker id="nlpArr" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#64748b" />
        </marker>
      </defs>
    </Svg>
  </Wrap>
);

export const DualPathwayDiagram = () => (
  <Wrap>
    <Svg viewBox="0 0 560 160" preserveAspectRatio="xMidYMid meet">
      <rect x="10" y="58" width="80" height="44" rx="8" fill="#f0fdf4" stroke="#166534" strokeWidth="1.5" />
      <text x="50" y="85" textAnchor="middle" fontSize="13" fontWeight="700">Patient</text>
      <rect x="120" y="22" width="95" height="44" rx="8" fill="#f8fafc" stroke="#64748b" strokeWidth="1.2" />
      <text x="167" y="42" textAnchor="middle" fontSize="12" fontWeight="600">Nurse vitals</text>
      <text x="167" y="56" textAnchor="middle" fontSize="10" fill="#64748b">objective</text>
      <rect x="240" y="22" width="95" height="44" rx="8" fill="#f8fafc" stroke="#64748b" strokeWidth="1.2" />
      <text x="287" y="50" textAnchor="middle" fontSize="12" fontWeight="600">TEWS</text>
      <rect x="120" y="94" width="95" height="44" rx="8" fill="#f8fafc" stroke="#64748b" strokeWidth="1.2" />
      <text x="167" y="114" textAnchor="middle" fontSize="12" fontWeight="600">Chatbot</text>
      <text x="167" y="128" textAnchor="middle" fontSize="10" fill="#64748b">subjective X</text>
      <rect x="240" y="94" width="95" height="44" rx="8" fill="#f0fdf4" stroke="#166534" strokeWidth="1.5" />
      <text x="287" y="122" textAnchor="middle" fontSize="12" fontWeight="600">BioBERT</text>
      <rect x="370" y="58" width="95" height="44" rx="8" fill="#ffedd5" stroke="#ea580c" strokeWidth="1.5" />
      <text x="417" y="85" textAnchor="middle" fontSize="12" fontWeight="700">Fusion</text>
      <rect x="480" y="58" width="70" height="44" rx="8" fill="#fef9c3" stroke="#ca8a04" strokeWidth="1.5" />
      <text x="515" y="85" textAnchor="middle" fontSize="12" fontWeight="700">Colour C</text>
      <line x1="90" y1="68" x2="120" y2="44" stroke="#64748b" strokeWidth="1.5" />
      <line x1="215" y1="44" x2="240" y2="44" stroke="#64748b" strokeWidth="1.5" />
      <line x1="335" y1="44" x2="370" y2="68" stroke="#64748b" strokeWidth="1.5" />
      <line x1="90" y1="82" x2="120" y2="116" stroke="#64748b" strokeWidth="1.5" />
      <line x1="215" y1="116" x2="240" y2="116" stroke="#64748b" strokeWidth="1.5" />
      <line x1="335" y1="116" x2="370" y2="92" stroke="#64748b" strokeWidth="1.5" />
      <line x1="465" y1="80" x2="480" y2="80" stroke="#64748b" strokeWidth="1.5" />
    </Svg>
  </Wrap>
);

export const EndToEndDiagram = () => (
  <Wrap>
    <Svg viewBox="0 0 280 360" preserveAspectRatio="xMidYMid meet">
      {[
        { y: 8, label: 'Headache, feverish,\nbody aches, weak', fill: '#f0fdf4' },
        { y: 88, label: 'BioBERT\n(12 Layers + Attention)', fill: '#dbeafe' },
        { y: 168, label: '[CLS] Vector\n(768 Dimensions)', fill: '#fef9c3' },
        { y: 248, label: 'Priority: YELLOW', fill: `${SATS_COLORS.yellow}99` },
      ].map((box, i, arr) => (
        <g key={box.label}>
          <rect x="20" y={box.y} width="240" height="64" rx="8" fill={box.fill} stroke="#166534" strokeWidth="1.5" />
          {box.label.split('\n').map((line, li) => (
            <text key={line} x="140" y={box.y + 28 + li * 16} textAnchor="middle" fontSize="12" fontWeight={i === arr.length - 1 ? 700 : 600}>{line}</text>
          ))}
          {i < arr.length - 1 && (
            <>
              <line x1="140" y1={box.y + 64} x2="140" y2={arr[i + 1].y} stroke="#64748b" strokeWidth="2" markerEnd="url(#e2ev)" />
              {i === 2 && (
                <text x="200" y={box.y + 84} fontSize="10" fill="#64748b">Custom Weights</text>
              )}
            </>
          )}
        </g>
      ))}
      <defs>
        <marker id="e2ev" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#64748b" />
        </marker>
      </defs>
    </Svg>
  </Wrap>
);

export const EmbeddingLookupDiagram = () => (
  <Wrap>
    <Svg viewBox="0 0 400 180" preserveAspectRatio="xMidYMid meet">
      <rect x="10" y="20" width="220" height="140" rx="4" fill="#fff" stroke="#cbd5e1" strokeWidth="1.5" />
      <text x="120" y="12" textAnchor="middle" fontSize="12" fontWeight="700">E_word (V × 768)</text>
      {[40, 70, 100, 130].map((y) => (
        <line key={y} x1="10" y1={y} x2="230" y2={y} stroke="#e2e8f0" strokeWidth="1" />
      ))}
      <text x="0" y="48" fontSize="10" fill="#64748b">ID 101</text>
      <text x="0" y="78" fontSize="10" fill="#64748b">ID 2031</text>
      <text x="0" y="108" fontSize="11" fontWeight="700" fill="#166534">ID 7994</text>
      <text x="0" y="138" fontSize="10" fill="#64748b">⋮</text>
      <rect x="10" y="95" width="220" height="28" fill="#dcfce7" opacity="0.8" className="viz-highlight-row" />
      <text x="120" y="114" textAnchor="middle" fontSize="11" fill="#166534">row lookup → e₄ ∈ ℝ⁷⁶⁸</text>
      <line x1="240" y1="109" x2="290" y2="109" stroke="#166534" strokeWidth="2" markerEnd="url(#embArr)" />
      <text x="330" y="105" fontSize="11" fill="#475569">&quot;head&quot;</text>
      <text x="330" y="120" fontSize="10" fill="#64748b">vector</text>
      <defs>
        <marker id="embArr" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#166534" />
        </marker>
      </defs>
    </Svg>
  </Wrap>
);

export const ContextualMappingDiagram = () => (
  <Wrap>
    <Svg viewBox="0 0 520 200" preserveAspectRatio="xMidYMid meet">
      {[
        { y: 10, label: 'E_word', sub: '(headache)' },
        { y: 58, label: 'E_pos(4)', sub: '(position 4)' },
        { y: 106, label: 'E_seg(0)', sub: '(segment 0)' },
      ].map((box) => (
        <g key={box.label}>
          <rect x="20" y={box.y} width="140" height="40" rx="6" fill="#f0fdf4" stroke="#166534" strokeWidth="1.2" />
          <text x="90" y={box.y + 18} textAnchor="middle" fontSize="12" fontWeight="600">{box.label}</text>
          <text x="90" y={box.y + 32} textAnchor="middle" fontSize="10" fill="#64748b">{box.sub}</text>
        </g>
      ))}
      <circle cx="220" cy="100" r="18" fill="#fff" stroke="#166534" strokeWidth="2" />
      <text x="220" y="106" textAnchor="middle" fontSize="18" fontWeight="700">+</text>
      {[30, 78, 126].map((y) => (
        <line key={y} x1="160" y1={y} x2="200" y2="100" stroke="#64748b" strokeWidth="1.5" />
      ))}
      <rect x="260" y="72" width="120" height="56" rx="6" fill="#f0fdf4" stroke="#166534" strokeWidth="1.2" />
      <text x="320" y="96" textAnchor="middle" fontSize="12" fontWeight="600">E(t₄)</text>
      <text x="320" y="112" textAnchor="middle" fontSize="10" fill="#64748b">final embedding</text>
      <line x1="380" y1="100" x2="410" y2="100" stroke="#64748b" strokeWidth="2" markerEnd="url(#ctxArr)" />
      <rect x="410" y="72" width="100" height="56" rx="6" fill={`${SATS_COLORS.yellow}44`} stroke="#166534" strokeWidth="1.5" />
      <text x="460" y="96" textAnchor="middle" fontSize="11" fontWeight="600">Row 4 of</text>
      <text x="460" y="112" textAnchor="middle" fontSize="11" fontWeight="700">H⁽⁰⁾</text>
      <defs>
        <marker id="ctxArr" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#64748b" />
        </marker>
      </defs>
    </Svg>
  </Wrap>
);

export const InputMatrixFlowDiagram = () => (
  <Wrap>
    <Svg viewBox="0 0 520 90" preserveAspectRatio="xMidYMid meet">
      {[
        { x: 0, label: 'ID sequence', sub: '101, 1045, 2031…' },
        { x: 170, label: 'Embedding lookup', sub: 'E_word' },
        { x: 340, label: 'H⁽⁰⁾', sub: 'M × 768' },
      ].map((box, i, arr) => (
        <g key={box.label}>
          <rect x={box.x} y="10" width="150" height="56" rx="8" fill={i === 2 ? `${SATS_COLORS.yellow}44` : i === 1 ? '#f0fdf4' : '#f8fafc'} stroke="#166534" strokeWidth="1.2" />
          <text x={box.x + 75} y="36" textAnchor="middle" fontSize="12" fontWeight="600">{box.label}</text>
          <text x={box.x + 75} y="52" textAnchor="middle" fontSize="10" fill="#64748b">{box.sub}</text>
          {i < arr.length - 1 && (
            <line x1={box.x + 150} y1="38" x2={arr[i + 1].x} y2="38" stroke="#64748b" strokeWidth="2" markerEnd="url(#matArr)" />
          )}
        </g>
      ))}
      <text x="425" y="82" textAnchor="middle" fontSize="10" fill="#64748b">Row 0 = [CLS] → triage summary</text>
      <defs>
        <marker id="matArr" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#64748b" />
        </marker>
      </defs>
    </Svg>
  </Wrap>
);
