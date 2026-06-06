import styled from 'styled-components';
import { SATS_COLORS } from './satsColors';

const DiagramWrap = styled.div`
  width: 100%;
  overflow-x: auto;
  padding: 0.5rem 0;
`;

const Svg = styled.svg`
  display: block;
  margin: 0 auto;
  max-width: 100%;
  height: auto;
`;

const Box = ({ x, y, w, h, label, sublabel, fill = '#f0fdf4', stroke = '#166534' }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx={8} fill={fill} stroke={stroke} strokeWidth={1.5} />
    <text x={x + w / 2} y={y + (sublabel ? h / 2 - 4 : h / 2 + 5)} textAnchor="middle" fontSize={11} fontWeight={700} fill="#1e293b">
      {label}
    </text>
    {sublabel && (
      <text x={x + w / 2} y={y + h / 2 + 12} textAnchor="middle" fontSize={9} fill="#64748b">
        {sublabel}
      </text>
    )}
  </g>
);

const Arrow = ({ x1, y1, x2, y2, label }) => (
  <g>
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#64748b" strokeWidth={1.5} markerEnd="url(#arrowhead)" />
    {label && (
      <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 6} textAnchor="middle" fontSize={9} fill="#64748b">
        {label}
      </text>
    )}
  </g>
);

export const PipelineDiagram = () => (
  <DiagramWrap>
    <Svg viewBox="0 0 720 220" width="720" height="220">
      <defs>
        <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#64748b" />
        </marker>
      </defs>
      <Box x={10} y={20} w={90} h={44} label="Patient" sublabel="chat / voice" />
      <Box x={120} y={20} w={90} h={44} label="Speech /" sublabel="translate" />
      <Box x={230} y={20} w={80} h={44} label="BioBERT" sublabel="NLP layer" />
      <Box x={340} y={20} w={80} h={44} label="Fusion" fill="#dcfce7" />
      <Box x={450} y={20} w={70} h={44} label="Colour" sublabel="C" fill={SATS_COLORS.red + '22'} stroke={SATS_COLORS.red} />
      <Box x={10} y={120} w={90} h={44} label="Nurse" sublabel="vitals" />
      <Box x={120} y={120} w={90} h={44} label="TEWS" sublabel="score T" />
      <Box x={230} y={120} w={80} h={44} label="Bayesian" sublabel="P(C|E)" />
      <Arrow x1={100} y1={42} x2={120} y2={42} />
      <Arrow x1={210} y1={42} x2={230} y2={42} label="X" />
      <Arrow x1={310} y1={42} x2={340} y2={42} label="D" />
      <Arrow x1={420} y1={42} x2={450} y2={42} />
      <Arrow x1={100} y1={142} x2={120} y2={142} />
      <Arrow x1={210} y1={142} x2={340} y2={62} label="T" />
      <Arrow x1={270} y1={120} x2={270} y2={64} />
      <Arrow x1={310} y1={142} x2={380} y2={64} label="P" />
    </Svg>
  </DiagramWrap>
);

export const FusionDiagram = () => (
  <DiagramWrap>
    <Svg viewBox="0 0 480 160" width="480" height="160">
      <defs>
        <marker id="arrowhead2" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#64748b" />
        </marker>
      </defs>
      <Box x={20} y={20} w={100} h={40} label="D" sublabel="language" />
      <Box x={20} y={70} w={100} h={40} label="T" sublabel="TEWS" />
      <Box x={20} y={120} w={100} h={40} label="P" sublabel="Bayesian" />
      <Box x={200} y={55} w={120} h={50} label="f_fusion" sublabel="priority rules" fill="#dcfce7" />
      <Box x={360} y={55} w={90} h={50} label="Final C" fill={SATS_COLORS.orange + '33'} stroke={SATS_COLORS.orange} />
      <line x1={120} y1={40} x2={200} y2={70} stroke="#64748b" strokeWidth={1.5} markerEnd="url(#arrowhead2)" />
      <line x1={120} y1={90} x2={200} y2={80} stroke="#64748b" strokeWidth={1.5} markerEnd="url(#arrowhead2)" />
      <line x1={120} y1={140} x2={200} y2={90} stroke="#64748b" strokeWidth={1.5} markerEnd="url(#arrowhead2)" />
      <line x1={320} y1={80} x2={360} y2={80} stroke="#64748b" strokeWidth={1.5} markerEnd="url(#arrowhead2)" />
    </Svg>
  </DiagramWrap>
);

export const PathwayDiagram = () => (
  <DiagramWrap>
    <Svg viewBox="0 0 640 100" width="640" height="100">
      <defs>
        <marker id="arrowhead3" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#64748b" />
        </marker>
      </defs>
      <Box x={10} y={28} w={80} h={44} label="Patient" />
      <Box x={110} y={28} w={80} h={44} label="Colour C" fill="#fef3c7" />
      <Box x={210} y={28} w={100} h={44} label="Department" sublabel="Ghana ED" />
      <Box x={330} y={28} w={120} h={44} label="System Action" fill="#dcfce7" />
      <line x1={90} y1={50} x2={110} y2={50} stroke="#64748b" strokeWidth={1.5} markerEnd="url(#arrowhead3)" />
      <line x1={190} y1={50} x2={210} y2={50} stroke="#64748b" strokeWidth={1.5} markerEnd="url(#arrowhead3)" />
      <line x1={310} y1={50} x2={330} y2={50} stroke="#64748b" strokeWidth={1.5} markerEnd="url(#arrowhead3)" />
    </Svg>
  </DiagramWrap>
);

export const UrgencyBar = () => (
  <DiagramWrap>
    <Svg viewBox="0 0 640 60" width="640" height="60">
      <rect x={10} y={20} width={120} height={24} rx={4} fill={SATS_COLORS.red} />
      <rect x={130} y={20} width={120} height={24} fill={SATS_COLORS.orange} />
      <rect x={250} y={20} width={120} height={24} fill={SATS_COLORS.yellow} />
      <rect x={370} y={20} width={120} height={24} fill={SATS_COLORS.green} />
      <rect x={490} y={20} width={120} height={24} rx={4} fill={SATS_COLORS.blue} />
      <text x={70} y={36} textAnchor="middle" fontSize={10} fontWeight={700} fill="#fff">Red</text>
      <text x={190} y={36} textAnchor="middle" fontSize={10} fontWeight={700} fill="#fff">Orange</text>
      <text x={310} y={36} textAnchor="middle" fontSize={10} fontWeight={700} fill="#1e293b">Yellow</text>
      <text x={430} y={36} textAnchor="middle" fontSize={10} fontWeight={700} fill="#fff">Green</text>
      <text x={550} y={36} textAnchor="middle" fontSize={10} fontWeight={700} fill="#fff">Blue</text>
      <text x={10} y={12} fontSize={10} fill="#64748b">Most urgent</text>
      <text x={580} y={12} textAnchor="end" fontSize={10} fill="#64748b">Least urgent</text>
      <polygon points="320,52 330,58 310,58" fill="#166534" />
      <line x1={70} y1={52} x2={550} y2={52} stroke="#166534" strokeWidth={1} markerEnd="url(#arrowhead)" />
    </Svg>
  </DiagramWrap>
);

export const VoiceStepsDiagram = () => (
  <DiagramWrap>
    <Svg viewBox="0 0 600 80" width="600" height="80">
      <defs>
        <marker id="arrowhead4" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#64748b" />
        </marker>
      </defs>
      {[
        { x: 10, label: 'Audio', sub: 'voice note' },
        { x: 130, label: 'ASR', sub: 'speech→text' },
        { x: 250, label: 'Translate', sub: 'Twi→English' },
        { x: 370, label: 'Text X', sub: 'for BioBERT' },
      ].map((step, i, arr) => (
        <g key={step.label}>
          <Box x={step.x} y={18} w={100} h={44} label={step.label} sublabel={step.sub} />
          {i < arr.length - 1 && (
            <line
              x1={step.x + 100} y1={40} x2={arr[i + 1].x} y2={40}
              stroke="#64748b" strokeWidth={1.5} markerEnd="url(#arrowhead4)"
            />
          )}
        </g>
      ))}
    </Svg>
  </DiagramWrap>
);

export const BioBERTFlowDiagram = () => (
  <DiagramWrap>
    <Svg viewBox="0 0 620 80" width="620" height="80">
      <defs>
        <marker id="arrowhead5" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#64748b" />
        </marker>
      </defs>
      {[
        { x: 10, label: 'Text', sub: 'chief complaint' },
        { x: 120, label: 'Tokens', sub: '128 max' },
        { x: 230, label: 'Encoder', sub: '12 layers' },
        { x: 340, label: '[CLS]', sub: '768-dim' },
        { x: 450, label: 'Softmax', sub: '5 levels' },
      ].map((step, i, arr) => (
        <g key={step.label}>
          <Box x={step.x} y={18} w={95} h={44} label={step.label} sublabel={step.sub} />
          {i < arr.length - 1 && (
            <line
              x1={step.x + 95} y1={40} x2={arr[i + 1].x} y2={40}
              stroke="#64748b" strokeWidth={1.5} markerEnd="url(#arrowhead5)"
            />
          )}
        </g>
      ))}
    </Svg>
  </DiagramWrap>
);

/** Step 1 — patient enters symptoms as audio OR typed text */
export const PatientInputForkDiagram = () => (
  <DiagramWrap>
    <Svg viewBox="0 0 520 130" width="520" height="130">
      <defs>
        <marker id="arrowhead6" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#64748b" />
        </marker>
      </defs>
      <Box x={200} y={10} w={120} h={48} label="Patient" sublabel="describes symptoms" fill="#dcfce7" />
      <Box x={60} y={78} w={110} h={44} label="Typed text" sublabel="chat message" fill="#eff6ff" stroke="#3b82f6" />
      <Box x={350} y={78} w={110} h={44} label="Voice / audio" sublabel="voice note" fill="#fef3c7" stroke="#f59e0b" />
      <line x1={240} y1={58} x2={115} y2={78} stroke="#64748b" strokeWidth={1.5} markerEnd="url(#arrowhead6)" />
      <line x1={280} y1={58} x2={405} y2={78} stroke="#64748b" strokeWidth={1.5} markerEnd="url(#arrowhead6)" />
      <text x={260} y={72} textAnchor="middle" fontSize={9} fill="#64748b">OR</text>
    </Svg>
  </DiagramWrap>
);

/** Full symptom pipeline roadmap (steps 1–5) */
export const SymptomPipelineRoadmap = ({ highlightStep = 1 }) => {
  const steps = [
    { x: 10, label: 'Input', sub: 'audio / text' },
    { x: 118, label: 'Text X', sub: 'example' },
    { x: 226, label: 'ASR +', sub: 'translate' },
    { x: 334, label: 'BioBERT', sub: 'fine-tuned' },
    { x: 442, label: 'Fusion', sub: '→ colour C' },
  ];
  const hl = highlightStep - 1;

  return (
    <DiagramWrap>
      <Svg viewBox="0 0 560 80" width="560" height="80">
        <defs>
          <marker id="arrowhead7" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#64748b" />
          </marker>
        </defs>
        {steps.map((step, i, arr) => (
          <g key={step.label}>
            <Box
              x={step.x} y={18} w={98} h={44}
              label={step.label} sublabel={step.sub}
              fill={i === hl ? '#dcfce7' : '#f8fafc'}
              stroke={i === hl ? '#166534' : '#cbd5e1'}
            />
            {i < arr.length - 1 && (
              <line
                x1={step.x + 98} y1={40} x2={arr[i + 1].x} y2={40}
                stroke="#64748b" strokeWidth={1.5} markerEnd="url(#arrowhead7)"
              />
            )}
          </g>
        ))}
      </Svg>
    </DiagramWrap>
  );
};

/** Audio path: transcribe then translate local language → English text X */
export const AudioTranslateDiagram = () => (
  <DiagramWrap>
    <Svg viewBox="0 0 640 150" width="640" height="150">
      <defs>
        <marker id="arrowhead8" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#64748b" />
        </marker>
      </defs>
      <Box x={10} y={50} w={90} h={44} label="Audio" sublabel="voice note" fill="#fef3c7" stroke="#f59e0b" />
      <Box x={120} y={50} w={100} h={44} label="ASR" sublabel="speech → text" />
      <Box x={240} y={50} w={110} h={44} label="Translate" sublabel="Twi → English" fill="#eff6ff" stroke="#3b82f6" />
      <Box x={370} y={50} w={90} h={44} label="Text X" sublabel="English" fill="#dcfce7" />
      <line x1={100} y1={72} x2={120} y2={72} stroke="#64748b" strokeWidth={1.5} markerEnd="url(#arrowhead8)" />
      <line x1={220} y1={72} x2={240} y2={72} stroke="#64748b" strokeWidth={1.5} markerEnd="url(#arrowhead8)" />
      <line x1={350} y1={72} x2={370} y2={72} stroke="#64748b" strokeWidth={1.5} markerEnd="url(#arrowhead8)" />
      <text x={480} y={76} fontSize={10} fill="#64748b">→ BioBERT</text>
      <Box x={120} y={8} w={230} h={30} label="If local language (Twi, etc.)" fill="#f1f5f9" stroke="#94a3b8" />
      <text x={10} y={130} fontSize={9} fill="#64748b">Typed English text skips ASR + translate — goes straight to Text X</text>
    </Svg>
  </DiagramWrap>
);

/** Step 5 — BioBERT output + vitals branch → Fusion → Colour */
export const FusionPipelineDiagram = () => (
  <DiagramWrap>
    <Svg viewBox="0 0 620 120" width="620" height="120">
      <defs>
        <marker id="arrowhead9" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#64748b" />
        </marker>
      </defs>
      <Box x={10} y={10} w={100} h={44} label="BioBERT" sublabel="language ŷ" fill="#dcfce7" />
      <Box x={10} y={66} w={100} h={44} label="TEWS" sublabel="vitals T" fill="#f8fafc" stroke="#94a3b8" />
      <Box x={160} y={38} w={110} h={44} label="Fusion" sublabel="f_fusion" fill="#fef3c7" stroke="#166534" />
      <Box x={310} y={38} w={90} h={44} label="Colour C" fill={SATS_COLORS.orange + '33'} stroke={SATS_COLORS.orange} />
      <Box x={430} y={38} w={120} h={44} label="Pathway" sublabel="Ghana ED route" />
      <line x1={110} y1={32} x2={160} y2={52} stroke="#64748b" strokeWidth={1.5} markerEnd="url(#arrowhead9)" />
      <line x1={110} y1={88} x2={160} y2={68} stroke="#64748b" strokeWidth={1.5} markerEnd="url(#arrowhead9)" strokeDasharray="4 2" />
      <line x1={270} y1={60} x2={310} y2={60} stroke="#64748b" strokeWidth={1.5} markerEnd="url(#arrowhead9)" />
      <line x1={400} y1={60} x2={430} y2={60} stroke="#64748b" strokeWidth={1.5} markerEnd="url(#arrowhead9)" />
      <text x={520} y={64} fontSize={9} fill="#64748b">(+ Bayesian</text>
      <text x={520} y={76} fontSize={9} fill="#64748b">if needed)</text>
    </Svg>
  </DiagramWrap>
);

export default PipelineDiagram;
