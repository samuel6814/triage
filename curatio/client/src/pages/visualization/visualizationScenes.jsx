import React, { useImperativeHandle, forwardRef } from 'react';
import { gsap } from 'gsap';
import styled from 'styled-components';
import { User } from 'lucide-react';
import PictorialFrame from '../../components/visualization/PictorialFrame';
import CalloutLabel from '../../components/visualization/CalloutLabel';
import { useSceneTimeline } from '../../components/visualization/useSceneTimeline';
import { TokenChip, TokenRow, NumericCell } from '../../components/visualization/VisualizationSceneShell';
import { ProbabilityBars } from '../../components/visualization/ProbabilityBars';
import { DiagramBox } from '../../components/presentation/SlideLayout';
import {
  SatsBar, DualPathwayDiagram, NlpPipelineDiagram, ClsTokenDiagram,
  EmbeddingLookupDiagram, InputMatrixFlowDiagram, AttentionFlow, MlmMask,
} from '../../components/presentation/diagrams/NlpDiagrams';
import { SATS_COLORS } from '../../components/presentation/satsColors';
import FlowDot from '../../components/visualization/animated/FlowDot';
import SplitComplaint from '../../components/visualization/animated/SplitComplaint';
import StackMerge from '../../components/visualization/animated/StackMerge';
import DrawingArc from '../../components/visualization/animated/DrawingArc';
import LossCompare from '../../components/visualization/animated/LossCompare';
import LossCurve from '../../components/visualization/animated/LossCurve';
import AnimatedCounter from '../../components/visualization/animated/AnimatedCounter';
import { getStepMeta } from './visualizationSteps';
import { animateCounter, drawArc, fillBar, fillWidthBar, typeText } from './sceneHelpers';
import {
  COMPLAINT_TEXT, TOKEN_ROWS, MATRIX_ROWS, ATTENTION_WEIGHTS,
  SOFTMAX_OUTPUT, MLM_EXAMPLE, ENCODER_LAYER_PHASES, LAYER_WALKTHROUGH,
  CROSS_ENTROPY_EXAMPLE, GRADIENT_DESCENT_STATS,
} from './runningExampleData';

const PatientRow = styled.div` display: flex; align-items: flex-start; gap: 1.25rem; `;
const PatientAvatar = styled.div`
  width: 72px; height: 72px; border-radius: 50%; background: #dcfce7;
  border: 3px solid #166534; display: flex; align-items: center; justify-content: center; color: #166534;
`;
const SpeechBubble = styled.div`
  max-width: 520px; padding: 1rem 1.25rem; background: #fff; border: 2px solid #166534;
  border-radius: 16px 16px 16px 4px; font-size: 1.05rem; font-style: italic; color: #166534; min-height: 3.5rem;
`;
const WeightBar = styled.div`
  display: flex; align-items: center; gap: 0.65rem; margin-bottom: 0.45rem; opacity: 0; width: 100%; max-width: 420px;
  span.label { width: 80px; font-size: 0.95rem; font-weight: 700; }
  span.track { flex: 1; height: 18px; background: #f1f5f9; border-radius: 6px; overflow: hidden; }
  span.fill { display: block; height: 100%; width: 0%; background: #166534; border-radius: 6px; }
  span.pct { font-size: 0.9rem; font-weight: 700; color: #166534; width: 44px; }
`;
const LayerPulse = styled.div`
  position: absolute; left: 0; right: 0; height: 5px; background: #22c55e; opacity: 0; box-shadow: 0 0 14px #22c55e;
`;
const EncoderWrap = styled.div`
  position: relative; width: 100%; display: flex; align-items: center; justify-content: center;
  img { max-height: min(400px, 48vh); width: auto; object-fit: contain; }
`;
const YellowBadge = styled.div`
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(0);
  background: ${SATS_COLORS.yellow}; color: #1e293b; font-size: 2.5rem; font-weight: 900;
  padding: 1rem 2rem; border-radius: 20px; border: 4px solid #ca8a04;
  box-shadow: 0 12px 40px rgba(202, 138, 4, 0.35); z-index: 5;
`;
const FinalBadge = styled.div`
  background: ${SATS_COLORS.yellow}; color: #1e293b; font-size: 2.2rem; font-weight: 900;
  padding: 0.85rem 1.75rem; border-radius: 20px; border: 4px solid #ca8a04; transform: scale(0);
`;
const PhaseBlock = styled.div`
  padding: 0.85rem 1.1rem; border-radius: 12px; background: #fff; border: 2px solid #e2e8f0;
  opacity: 0; transform: translateY(24px); margin-bottom: 0.5rem; width: 100%; max-width: 480px;
  strong { color: #166534; }
`;
const LayerNode = styled.div`
  display: flex; align-items: center; gap: 1rem; width: 100%; max-width: 520px; justify-content: center;
`;
const Node = styled.div`
  padding: 0.85rem 1.25rem; border-radius: 12px; background: #dcfce7; border: 2px solid #166534;
  font-weight: 800; color: #166534; opacity: 0; transform: scale(0.8);
`;
const NodeArrow = styled.div`
  font-size: 1.5rem; color: #166534; opacity: 0; font-weight: 800;
`;
const ClusterToken = styled.div`
  position: absolute; padding: 0.4rem 0.75rem; border-radius: 8px; background: #dcfce7;
  border: 2px solid #166534; font-weight: 700; color: #166534; font-size: 0.9rem;
`;
const MlmWord = styled.span`
  display: inline-block; padding: 0.35rem 0.65rem; margin: 0 0.2rem; border-radius: 8px;
  font-weight: 700; background: #f8fafc; border: 2px solid #e2e8f0;
`;
const LayerNum = styled.span`
  position: absolute; right: 8%; font-size: 0.75rem; font-weight: 700; color: #166534; opacity: 0;
`;
const E2EStage = styled.div`
  opacity: 0; transform: translateY(16px); width: 100%; max-width: 640px;
  text-align: center; padding: 0.75rem;
`;

const makeScene = (stepNum, buildAnim, animContent) => {
  const stepMeta = getStepMeta(stepNum);
  const Comp = forwardRef(({ onTimelineComplete }, ref) => {
    const { rootRef, play, pause, restart, getDuration } = useSceneTimeline(
      (tl, el) => buildAnim(tl, el),
      [stepNum],
      { onComplete: onTimelineComplete, autoPlay: false },
    );
    useImperativeHandle(ref, () => ({ play, pause, restart, getDuration }), [play, pause, restart, getDuration]);
    return (
      <div ref={rootRef} style={{ height: '100%' }}>
        <PictorialFrame step={stepMeta.step} section={stepMeta.section} caption={stepMeta.caption}
          stageLabel={stepMeta.stageLabel} equations={stepMeta.equations}>
          {animContent()}
        </PictorialFrame>
      </div>
    );
  });
  Comp.displayName = `VizScene${stepNum}`;
  return Comp;
};

export const VizScene01 = makeScene(1, (tl, el) => {
  tl.from(el.querySelector('.viz-avatar'), { scale: 0, duration: 0.6, ease: 'back.out' })
    .from(el.querySelector('.viz-bubble-wrap'), { opacity: 0, x: 20, duration: 0.5 });
  typeText(tl, el, '.viz-typed', COMPLAINT_TEXT, { duration: 2.5 });
  tl.from(el.querySelectorAll('.viz-sats rect'), { scaleX: 0, duration: 0.35, stagger: 0.07, transformOrigin: 'left' }, '-=0.5')
    .from(el.querySelector('.viz-yellow-pulse'), { opacity: 0, scale: 0.8, duration: 0.5 })
    .to(el.querySelector('.viz-yellow-pulse'), { scale: 1.08, duration: 0.4, yoyo: true, repeat: 2 });
}, () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '100%' }}>
    <PatientRow>
      <PatientAvatar className="viz-avatar"><User size={36} /></PatientAvatar>
      <SpeechBubble className="viz-bubble-wrap"><span className="viz-typed" /></SpeechBubble>
    </PatientRow>
    <div className="viz-sats" style={{ width: '100%', maxWidth: 640 }}>
      <DiagramBox $minHeight="90px"><SatsBar /></DiagramBox>
    </div>
    <CalloutLabel className="viz-yellow-pulse" position="bottom" accent>Moderate urgency → Yellow</CalloutLabel>
  </div>
));

export const VizScene02 = makeScene(2, (tl, el) => {
  tl.from(el.querySelector('.viz-flow-dual'), { opacity: 0, duration: 0.5 })
    .to(el.querySelector('.viz-dot-tews'), { attr: { cx: 260, cy: 70 }, duration: 1.8, ease: 'power2.inOut' })
    .to(el.querySelector('.viz-dot-nlp'), { attr: { cx: 260, cy: 70 }, duration: 1.8, ease: 'power2.inOut' }, '-=1.6')
    .to(el.querySelector('.viz-fusion-node'), { scale: 1.15, duration: 0.3, yoyo: true, repeat: 1, transformOrigin: '260px 70px' })
    .to(el.querySelector('.viz-output-badge'), { opacity: 1, scale: 1, duration: 0.5, transformOrigin: '380px 70px' }, '-=0.2')
    .to(el.querySelector('.viz-output-label'), { opacity: 1, duration: 0.3 });
}, () => (
  <FlowDot className="viz-flow-dual" variant="dual" />
));

export const VizScene03 = makeScene(3, (tl, el) => {
  tl.from(el.querySelector('.viz-pipe-flow'), { opacity: 0, duration: 0.4 })
    .to(el.querySelector('.viz-packet'), { attr: { cx: 150 }, duration: 0.6, ease: 'power2.inOut' })
    .to(el.querySelector('.viz-box-0'), { attr: { fill: '#bbf7d0' }, duration: 0.25 })
    .to(el.querySelector('.viz-verb-0'), { opacity: 1, y: 0, duration: 0.3 }, '-=0.1')
    .to(el.querySelector('.viz-packet'), { attr: { cx: 310 }, duration: 0.6, ease: 'power2.inOut' })
    .to(el.querySelector('.viz-box-1'), { attr: { fill: '#bbf7d0' }, duration: 0.25 })
    .to(el.querySelector('.viz-verb-1'), { opacity: 1, y: 0, duration: 0.3 }, '-=0.1')
    .to(el.querySelector('.viz-packet'), { attr: { cx: 470 }, duration: 0.6, ease: 'power2.inOut' })
    .to(el.querySelector('.viz-box-2'), { attr: { fill: '#bbf7d0' }, duration: 0.25 })
    .to(el.querySelector('.viz-verb-2'), { opacity: 1, y: 0, duration: 0.3 }, '-=0.1')
    .to(el.querySelector('.viz-packet'), { attr: { cx: 530 }, duration: 0.6, ease: 'power2.inOut' })
    .to(el.querySelector('.viz-box-3'), { attr: { fill: '#bbf7d0' }, duration: 0.25 })
    .to(el.querySelector('.viz-verb-3'), { opacity: 1, y: 0, duration: 0.3 }, '-=0.1');
}, () => (
  <div style={{ width: '100%' }}>
    <FlowDot className="viz-pipe-flow" variant="pipeline" />
    <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: 600, margin: '0.5rem auto 0', fontSize: '0.88rem', fontWeight: 700, color: '#166534' }}>
      {['Tokenize', 'Embed', 'Encode', 'Classify'].map((v, i) => (
        <span key={v} className={`viz-verb-${i}`} style={{ opacity: 0, transform: 'translateY(6px)' }}>{v}</span>
      ))}
    </div>
  </div>
));

export const VizScene04 = makeScene(4, (tl, el) => {
  tl.from(el.querySelector('.viz-full-sentence'), { opacity: 1, duration: 0.8 })
    .to(el.querySelector('.viz-full-sentence'), { opacity: 0, y: -20, duration: 0.5 })
    .to(el.querySelectorAll('.viz-flying-chip'), { opacity: 1, scale: 1, duration: 0.45, stagger: 0.08, ease: 'back.out' });
  el.querySelectorAll('.viz-flying-chip').forEach((chip, i) => {
    tl.to(chip.querySelector('.viz-chip-id'), {
      duration: 0.01,
      onComplete: () => {
        chip.querySelector('.viz-chip-id').textContent = (chip.dataset.id ?? '').split(',')[0];
      },
    }, `-=${0.3 - i * 0.02}`);
  });
}, () => (
  <SplitComplaint text={COMPLAINT_TEXT} tokens={TOKEN_ROWS.slice(1, 9)} className="viz-split" />
));

export const VizScene05 = makeScene(5, (tl, el) => {
  tl.from(el.querySelector('.viz-cls-slide'), { x: -80, opacity: 0, duration: 0.7, ease: 'power3.out' })
    .to(el.querySelector('.viz-token-row'), { x: 40, duration: 0.6, ease: 'power2.out' }, '-=0.3')
    .from(el.querySelector('.viz-summary-arrow'), { opacity: 0, scaleX: 0, duration: 0.5, transformOrigin: 'left' })
    .from(el.querySelector('.viz-callout'), { opacity: 0, scale: 0.9, duration: 0.4 });
}, () => (
  <div style={{ position: 'relative', width: '100%' }}>
    <DiagramBox $minHeight="150px">
      <div style={{ position: 'relative' }}>
        <span className="viz-cls-slide" data-token="cls" style={{ display: 'inline-block' }}>
          <ClsTokenDiagram />
        </span>
      </div>
    </DiagramBox>
    <div className="viz-summary-arrow" style={{ textAlign: 'center', fontWeight: 800, color: '#166534', marginTop: '0.5rem', opacity: 0 }}>→ whole-sentence summary</div>
    <CalloutLabel className="viz-callout" position="bottom" accent>Summary slot at position 0</CalloutLabel>
  </div>
));

export const VizScene06 = makeScene(6, (tl, el) => {
  tl.from(el.querySelector('.viz-embed'), { opacity: 0, duration: 0.5 })
    .fromTo(el.querySelector('.viz-highlight-row'), { scaleX: 0 }, { scaleX: 1, duration: 0.7, transformOrigin: 'left' })
    .from(el.querySelectorAll('.viz-vec-num'), { opacity: 0, y: 8, stagger: 0.04, duration: 0.25 })
    .from(el.querySelector('.viz-callout'), { opacity: 0, duration: 0.4 });
}, () => (
  <div style={{ width: '100%' }}>
    <DiagramBox $minHeight="160px" className="viz-embed"><EmbeddingLookupDiagram /></DiagramBox>
    <TokenRow style={{ marginTop: '0.75rem', justifyContent: 'center' }}>
      {[0.02, 0.11, -0.05, 0.33, 0.08, -0.12, 0.21, 0.04].map((n, i) => (
        <NumericCell key={i} className="viz-vec-num">{n}</NumericCell>
      ))}
      <span style={{ color: '#94a3b8', fontSize: '0.85rem' }} className="viz-vec-num">…768</span>
    </TokenRow>
    <CalloutLabel className="viz-callout" position="bottom" accent>768 numbers = meaning</CalloutLabel>
  </div>
));

export const VizScene07 = makeScene(7, (tl, el) => {
  tl.from(el.querySelector('.viz-cluster-wrap'), { opacity: 0, duration: 0.4 })
    .to(el.querySelector('.viz-tok-head'), { x: 0, y: 0, duration: 1, ease: 'power2.inOut' })
    .to(el.querySelector('.viz-tok-fever'), { x: 0, y: 0, duration: 1, ease: 'power2.inOut' }, '-=0.9')
    .to(el.querySelector('.viz-tok-weak'), { x: 0, y: 0, duration: 1, ease: 'power2.inOut' }, '-=0.9')
    .to(el.querySelector('.viz-cluster-ring'), { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out' });
}, () => (
  <div className="viz-cluster-wrap" style={{ position: 'relative', width: 280, height: 200 }}>
    <ClusterToken className="viz-tok-head" style={{ left: -60, top: 20 }}>headache</ClusterToken>
    <ClusterToken className="viz-tok-fever" style={{ left: 180, top: 10 }}>feverish</ClusterToken>
    <ClusterToken className="viz-tok-weak" style={{ left: 100, top: 120 }}>weak</ClusterToken>
    <div className="viz-cluster-ring" style={{
      position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%) scale(0)',
      width: 140, height: 140, borderRadius: '50%', border: '3px dashed #166534', opacity: 0,
    }} />
    <CalloutLabel position="bottom">Symptoms cluster in embedding space</CalloutLabel>
  </div>
));

export const VizScene08 = makeScene(8, (tl, el) => {
  tl.from(el.querySelector('.viz-block-word'), { opacity: 0, y: 20, duration: 0.45 })
    .from(el.querySelectorAll('.viz-plus'), { opacity: 0, scale: 0, duration: 0.25, stagger: 0.1 }, '-=0.2')
    .from(el.querySelector('.viz-block-pos'), { opacity: 0, y: 20, duration: 0.45 }, '-=0.3')
    .from(el.querySelector('.viz-block-seg'), { opacity: 0, y: 20, duration: 0.45 }, '-=0.3')
    .to(el.querySelector('.viz-merge-result'), { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out' })
    .to(el.querySelector('.viz-merge-flash'), { opacity: 0.6, duration: 0.15, yoyo: true, repeat: 1 });
}, () => (
  <div style={{ position: 'relative' }}>
    <StackMerge className="viz-stack" />
    <div className="viz-merge-flash" style={{
      position: 'absolute', inset: 0, background: '#dcfce7', opacity: 0, pointerEvents: 'none', borderRadius: 12,
    }} />
  </div>
));

export const VizScene09 = makeScene(9, (tl, el) => {
  tl.from(el.querySelector('.viz-flow'), { opacity: 0, duration: 0.4 })
    .from(el.querySelectorAll('.viz-mat-row'), { opacity: 0, x: -16, stagger: 0.2, duration: 0.4 })
    .from(el.querySelectorAll('.viz-cell'), { scale: 0, stagger: 0.04, duration: 0.15 }, '-=0.3');
}, () => (
  <>
    <DiagramBox $minHeight="70px" className="viz-flow"><InputMatrixFlowDiagram /></DiagramBox>
    <div style={{ marginTop: '0.75rem' }}>
      {MATRIX_ROWS.map((r) => (
        <div key={r.i} className="viz-mat-row" style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.35rem', opacity: 0 }}>
          <span style={{ width: 56, fontWeight: 700, fontSize: '0.82rem' }}>{r.token}</span>
          {r.dims.map((d, j) => <NumericCell key={j} className="viz-cell">{d}</NumericCell>)}
        </div>
      ))}
    </div>
  </>
));

export const VizScene10 = makeScene(10, (tl, el) => {
  tl.from(el.querySelector('.viz-enc-img'), { opacity: 0, duration: 0.6 })
    .fromTo(el.querySelector('.viz-pulse'), { bottom: '8%', opacity: 1 }, { bottom: '88%', duration: 3, ease: 'power1.inOut' })
    .to(el.querySelectorAll('.viz-layer-num'), { opacity: 1, stagger: 0.08, duration: 0.2 }, '-=2.5');
}, () => (
  <EncoderWrap className="viz-enc-img">
    <img src="/assets/bert_encoder.png" alt="BERT encoder" />
    <LayerPulse className="viz-pulse" style={{ bottom: '8%' }} />
    {[1, 4, 8, 12].map((n, i) => (
      <LayerNum key={n} className="viz-layer-num" style={{ bottom: `${12 + i * 22}%` }}>L{n}</LayerNum>
    ))}
  </EncoderWrap>
));

export const VizScene11 = makeScene(11, (tl, el) => {
  tl.from(el.querySelector('.viz-node-headache'), { opacity: 0, scale: 0.7, duration: 0.5, ease: 'back.out' })
    .from(el.querySelector('.viz-arrow-add'), { opacity: 0, x: -10, duration: 0.4 })
    .from(el.querySelector('.viz-node-fever'), { opacity: 0, scale: 0.7, duration: 0.5, ease: 'back.out' }, '-=0.2');
  animateCounter(tl, el, '.viz-add-counter .viz-counter-value', LAYER_WALKTHROUGH.attentionAdd, { duration: 0.8, decimals: 1 });
  tl.from(el.querySelector('.viz-node-result'), { opacity: 0, scale: 0.8, duration: 0.5, ease: 'back.out' })
    .to(el.querySelector('.viz-residual'), { opacity: 1, x: 0, duration: 0.4 });
}, () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
    <LayerNode>
      <Node className="viz-node-fever">feverish</Node>
      <NodeArrow className="viz-arrow-add">+ <AnimatedCounter className="viz-add-counter" initial="0.0" dataTarget={LAYER_WALKTHROUGH.attentionAdd} /></NodeArrow>
      <Node className="viz-node-headache">headache = {LAYER_WALKTHROUGH.headache}</Node>
    </LayerNode>
    <Node className="viz-node-result">Z ≈ {LAYER_WALKTHROUGH.afterNorm}</Node>
    <div className="viz-residual" style={{ opacity: 0, transform: 'translateX(-12px)', fontWeight: 700, color: '#166534' }}>
      + residual → H ≈ {LAYER_WALKTHROUGH.afterResidual}
    </div>
  </div>
));

export const VizScene12 = makeScene(12, (tl, el) => {
  tl.from(el.querySelectorAll('.viz-phase-block'), { opacity: 0, y: 30, stagger: 0.45, duration: 0.55, ease: 'power2.out' })
    .to(el.querySelectorAll('.viz-phase-block'), { borderColor: '#166534', duration: 0.3, stagger: 0.15 });
}, () => (
  <div style={{ width: '100%', maxWidth: 480 }}>
    {ENCODER_LAYER_PHASES.map((p) => (
      <PhaseBlock key={p.range} className="viz-phase-block">
        <strong>Layers {p.range} ({p.label})</strong> — {p.focus}
      </PhaseBlock>
    ))}
  </div>
));

export const VizScene13 = makeScene(13, (tl, el) => {
  tl.from(el.querySelector('.viz-arcs'), { opacity: 0, duration: 0.4 });
  drawArc(tl, el, 'viz-arc-1', { duration: 0.7 });
  drawArc(tl, el, 'viz-arc-2', { duration: 0.7, position: '-=0.3' });
  drawArc(tl, el, 'viz-arc-3', { duration: 0.7, position: '-=0.3' });
  tl.from(el.querySelectorAll('.viz-weight'), { opacity: 0, x: -8, stagger: 0.1, duration: 0.35 });
  fillWidthBar(tl, el, '.viz-weight .fill', { duration: 0.55, stagger: 0.08 });
}, () => (
  <>
    <DrawingArc className="viz-arcs" />
    <div style={{ marginTop: '0.5rem', width: '100%', maxWidth: 420 }}>
      {ATTENTION_WEIGHTS.filter((w) => w.weight > 0.05).map((w) => (
        <WeightBar key={w.token} className="viz-weight" data-pct={Math.round(w.weight * 100)}>
          <span className="label">{w.token}</span>
          <span className="track"><span className="fill" /></span>
          <span className="pct">{Math.round(w.weight * 100)}%</span>
        </WeightBar>
      ))}
    </div>
  </>
));

export const VizScene14 = makeScene(14, (tl, el) => {
  tl.from(el.querySelector('.viz-mlm-wrap'), { opacity: 0, duration: 0.4 })
    .to(el.querySelector('.viz-mask'), { opacity: 0.3, duration: 0.3, yoyo: true, repeat: 3 })
    .from(el.querySelector('.viz-cand-1'), { opacity: 0, duration: 0.2 })
    .to(el.querySelector('.viz-cand-1'), { opacity: 0, duration: 0.15, delay: 0.3 })
    .from(el.querySelector('.viz-cand-2'), { opacity: 1, duration: 0.2 })
    .to(el.querySelector('.viz-cand-2'), { opacity: 0, duration: 0.15, delay: 0.3 })
    .from(el.querySelector('.viz-cand-3'), { opacity: 1, scale: 1.1, duration: 0.4, ease: 'back.out' })
    .to(el.querySelector('.viz-lock'), { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out' }, '-=0.1');
}, () => (
  <div className="viz-mlm-wrap" style={{ textAlign: 'center' }}>
    <DiagramBox $minHeight="90px"><MlmMask /></DiagramBox>
    <div style={{ marginTop: '0.75rem', fontSize: '1.1rem' }}>
      {MLM_EXAMPLE.tokens.map((t) => (
        <MlmWord key={t} className={t === '[MASK]' ? 'viz-mask' : ''}>{t === '[MASK]' ? '[MASK]' : t}</MlmWord>
      ))}
    </div>
    <p style={{ marginTop: '0.5rem', fontWeight: 800, color: '#64748b' }}>
      Predict:
      <span className="viz-cand-1" style={{ color: '#94a3b8', marginLeft: 6 }}>fever</span>
      <span className="viz-cand-2" style={{ color: '#94a3b8', marginLeft: 6, opacity: 0 }}>pain</span>
      <span className="viz-cand-3" style={{ color: '#166534', marginLeft: 6, opacity: 0 }}>{MLM_EXAMPLE.correct}</span>
    </p>
    <CalloutLabel className="viz-lock" position="bottom" accent>
      Locked: {MLM_EXAMPLE.correct}
    </CalloutLabel>
  </div>
));

export const VizScene15 = makeScene(15, (tl, el) => {
  tl.from(el.querySelector('.viz-loss-compare'), { opacity: 0, y: 12, duration: 0.4 });
  fillBar(tl, el, '.viz-loss-left', 15, { duration: 0.9 });
  fillBar(tl, el, '.viz-loss-right', 95, { duration: 1.1, position: '-=0.5' });
}, () => (
  <LossCompare
    className="viz-loss-compare"
    leftLabel={`P = ${MLM_EXAMPLE.pGood} ✓`}
    rightLabel={`P = ${MLM_EXAMPLE.pBad} ✗`}
    leftValue={(-Math.log(MLM_EXAMPLE.pGood)).toFixed(2)}
    rightValue={(-Math.log(MLM_EXAMPLE.pBad)).toFixed(1)}
    leftPct={15}
    rightPct={95}
  />
));

export const VizScene16 = makeScene(16, (tl, el) => {
  tl.from(el.querySelectorAll('.viz-raw-score'), { opacity: 0, y: 8, stagger: 0.08, duration: 0.35 })
    .to(el.querySelectorAll('.viz-raw-score'), { opacity: 0, duration: 0.3, stagger: 0.05 })
    .from(el.querySelectorAll('.viz-weight'), { opacity: 0, duration: 0.3, stagger: 0.06 });
  fillWidthBar(tl, el, '.viz-weight .fill', { duration: 0.5, stagger: 0.07 });
  tl.from(el.querySelector('.viz-sum-check'), { opacity: 0, scale: 0.8, duration: 0.4, ease: 'back.out' });
}, () => (
  <div style={{ width: '100%', maxWidth: 440 }}>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.75rem', justifyContent: 'center' }}>
      {ATTENTION_WEIGHTS.map((w) => (
        <span key={w.token} className="viz-raw-score" style={{ padding: '0.25rem 0.5rem', background: '#f1f5f9', borderRadius: 6, fontSize: '0.82rem' }}>
          {w.token}: { (w.weight * 10).toFixed(1) }
        </span>
      ))}
    </div>
    {ATTENTION_WEIGHTS.map((w) => (
      <WeightBar key={w.token} className="viz-weight" data-pct={Math.max(2, Math.round(w.weight * 100))}>
        <span className="label">{w.token}</span>
        <span className="track"><span className="fill" /></span>
        <span className="pct">α={w.weight.toFixed(2)}</span>
      </WeightBar>
    ))}
    <CalloutLabel className="viz-sum-check" position="bottom" accent>Σ α = 1.00</CalloutLabel>
  </div>
));

export const VizScene17 = makeScene(17, (tl, el) => {
  const fills = el.querySelectorAll('.viz-prob-fill');
  tl.from(el.querySelector('.viz-bars'), { opacity: 0, duration: 0.35 })
    .to(fills, { width: (i, t) => `${t.dataset.target}%`, duration: 0.85, stagger: 0.1, ease: 'power2.out' })
    .to(el.querySelectorAll('.viz-prob-label'), { opacity: 1, duration: 0.25, stagger: 0.05 }, '-=0.5')
    .to(el.querySelector('.viz-yellow-badge'), { scale: 1, duration: 0.65, ease: 'back.out' }, '-=0.3')
    .to(el.querySelector('.viz-ring'), { opacity: 1, scale: 1.4, duration: 0.6, ease: 'power2.out' });
}, () => (
  <div className="viz-bars" style={{ position: 'relative', width: '100%', maxWidth: 480 }}>
    <ProbabilityBars items={SOFTMAX_OUTPUT.map((x) => ({ ...x }))} />
    <YellowBadge className="viz-yellow-badge">Yellow 72%</YellowBadge>
    <div className="viz-ring" style={{
      position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%) scale(0.5)',
      width: 200, height: 200, borderRadius: '50%', border: '3px solid #fde047', opacity: 0, pointerEvents: 'none',
    }} />
  </div>
));

export const VizScene18 = makeScene(18, (tl, el) => {
  tl.from(el.querySelector('.viz-loss-compare'), { opacity: 0, duration: 0.4 });
  fillBar(tl, el, '.viz-loss-left', 25, { duration: 0.7 });
  fillBar(tl, el, '.viz-loss-right', 90, { duration: 0.9, position: '-=0.4' });
  animateCounter(tl, el, '.viz-loss-final', CROSS_ENTROPY_EXAMPLE.loss, { duration: 1, decimals: 1 });
}, () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
    <LossCompare
      className="viz-loss-compare"
      leftLabel={`Nurse: ${CROSS_ENTROPY_EXAMPLE.trueLabel}`}
      rightLabel={`Model: ${CROSS_ENTROPY_EXAMPLE.wrongPred} ${CROSS_ENTROPY_EXAMPLE.wrongProb * 100}%`}
      leftValue="low"
      rightValue="high"
      leftPct={25}
      rightPct={90}
      leftColor="#22c55e"
      rightColor="#ef4444"
    />
    <p style={{ fontWeight: 800, fontSize: '1.2rem', color: '#166534' }}>
      Loss ≈ <AnimatedCounter className="viz-loss-final" initial="0.0" dataTarget={CROSS_ENTROPY_EXAMPLE.loss} />
    </p>
  </div>
));

export const VizScene19 = makeScene(19, (tl, el) => {
  tl.from(el.querySelector('.viz-enc'), { opacity: 0, duration: 0.5 })
    .fromTo(el.querySelector('.viz-pulse'), { top: '12%', opacity: 1 }, { top: '78%', duration: 2.2, ease: 'power1.inOut' })
    .to(el.querySelectorAll('.viz-weight-flash'), { opacity: 1, duration: 0.15, stagger: 0.12, yoyo: true, repeat: 1 }, '-=1.8');
}, () => (
  <EncoderWrap className="viz-enc">
    <img src="/assets/bert_encoder.png" alt="Backprop" />
    <LayerPulse className="viz-pulse" style={{ top: '12%', background: '#dc2626', boxShadow: '0 0 14px #dc2626' }} />
    {[0, 1, 2, 3].map((i) => (
      <div key={i} className="viz-weight-flash" style={{
        position: 'absolute', left: `${20 + i * 18}%`, top: `${25 + i * 15}%`,
        width: 12, height: 12, borderRadius: '50%', background: '#fca5a5', opacity: 0,
      }} />
    ))}
    <CalloutLabel position="bottom" accent>Error ↓ layers 12 → 1</CalloutLabel>
  </EncoderWrap>
));

export const VizScene20 = makeScene(20, (tl, el) => {
  tl.from(el.querySelector('.viz-loss-curve'), { opacity: 0, duration: 0.4 })
    .to(el.querySelector('.viz-loss-path'), { strokeDashoffset: 0, duration: 2, ease: 'power2.inOut' })
    .to(el.querySelector('.viz-loss-dot'), { opacity: 1, duration: 0.3 }, '-=0.3');
  animateCounter(tl, el, '.viz-steps-counter .viz-counter-value', GRADIENT_DESCENT_STATS.steps, { duration: 1.5 });
  animateCounter(tl, el, '.viz-loss-counter .viz-counter-value', GRADIENT_DESCENT_STATS.evalLoss, { duration: 1, decimals: 6, position: '-=0.8' });
}, () => (
  <LossCurve className="viz-loss-curve" />
));

export const VizScene21 = makeScene(21, (tl, el) => {
  tl.from(el.querySelector('.viz-e2e-1'), { opacity: 0, y: 20, duration: 0.5 })
    .to(el.querySelector('.viz-e2e-1'), { opacity: 0, y: -10, duration: 0.35 })
    .from(el.querySelector('.viz-e2e-2'), { opacity: 0, y: 20, duration: 0.45 })
    .to(el.querySelector('.viz-e2e-2'), { opacity: 0, duration: 0.3 })
    .from(el.querySelector('.viz-e2e-3'), { opacity: 0, scale: 0.9, duration: 0.6 })
    .to(el.querySelector('.viz-e2e-3'), { opacity: 0, duration: 0.35 })
    .from(el.querySelector('.viz-e2e-4'), { opacity: 0, y: 20, duration: 0.5 })
    .to(el.querySelector('.viz-final'), { scale: 1, duration: 0.7, ease: 'back.out' }, '-=0.2');
}, () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
    <E2EStage className="viz-e2e-1">
      <PatientRow style={{ justifyContent: 'center' }}>
        <PatientAvatar style={{ width: 48, height: 48 }}><User size={24} /></PatientAvatar>
        <SpeechBubble style={{ fontSize: '0.95rem', minHeight: 'auto' }}>{COMPLAINT_TEXT}</SpeechBubble>
      </PatientRow>
    </E2EStage>
    <E2EStage className="viz-e2e-2">
      <TokenRow>
        {['[CLS]', 'head', 'fever', 'weak', '[SEP]'].map((t) => <TokenChip key={t}>{t}</TokenChip>)}
      </TokenRow>
    </E2EStage>
    <E2EStage className="viz-e2e-3">
      <img src="/assets/bert_encoder.png" alt="Encoder" style={{ maxHeight: 180, objectFit: 'contain' }} />
    </E2EStage>
    <E2EStage className="viz-e2e-4">
      <ProbabilityBars items={SOFTMAX_OUTPUT.filter((x) => x.label === 'Yellow' || x.level <= 2)} />
    </E2EStage>
    <FinalBadge className="viz-final">Yellow 72%</FinalBadge>
  </div>
));

export const VISUALIZATION_SCENES = {
  1: VizScene01, 2: VizScene02, 3: VizScene03, 4: VizScene04, 5: VizScene05,
  6: VizScene06, 7: VizScene07, 8: VizScene08, 9: VizScene09, 10: VizScene10,
  11: VizScene11, 12: VizScene12, 13: VizScene13, 14: VizScene14, 15: VizScene15,
  16: VizScene16, 17: VizScene17, 18: VizScene18, 19: VizScene19, 20: VizScene20,
  21: VizScene21,
};

export const getVisualizationScene = (step) => VISUALIZATION_SCENES[step] ?? VizScene01;
