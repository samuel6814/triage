import React, { useMemo, useRef, useState, useCallback } from 'react';
import styled from 'styled-components';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, Play, Pause, RotateCcw, Maximize2, Minimize2,
} from 'lucide-react';

import {
  VIZ_TOTAL_STEPS,
  visualizationOrder,
  getVisualizationStep,
  getVisualizationByPath,
  visualizationSections,
} from './visualizationSteps';
import { getVisualizationScene } from './visualizationScenes';
import { useCinematicPlayback } from '../../components/visualization/useCinematicPlayback';

const PageWrap = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  opacity: ${(p) => (p.$visible ? 1 : 0)};
  transition: opacity 0.4s ease;
`;

const SceneArea = styled.div`
  flex: 1;
  min-height: 0;
  position: relative;
`;

const BottomBar = styled.div`
  flex-shrink: 0;
  padding: 0.65rem 0 0.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ProgressTrack = styled.div`
  display: flex;
  gap: 3px;
  height: 4px;
`;

const ProgressSeg = styled.button`
  flex: 1;
  border: none;
  border-radius: 2px;
  padding: 0;
  cursor: pointer;
  background: ${(p) => {
    if (p.$active) return '#166534';
    if (p.$done) return '#86efac';
    return '#e2e8f0';
  }};
  transition: background 0.2s ease;

  &:hover {
    opacity: 0.85;
  }
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const CtrlBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  color: #475569;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #f0fdf4;
    border-color: #bbf7d0;
    color: #166534;
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`;

const StepCounter = styled.span`
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 600;
  min-width: 64px;
  text-align: center;
`;

const VisualExplainerPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const sceneRef = useRef(null);
  const [playing, setPlaying] = useState(true);
  const [visible, setVisible] = useState(true);
  const [fs, setFs] = useState(false);
  const wrapRef = useRef(null);

  const current = useMemo(() => {
    const match = getVisualizationByPath(location.pathname);
    if (match) return match;
    const m = location.pathname.match(/\/visualization\/(\d+)/);
    if (m) return getVisualizationStep(m[1]);
    return visualizationOrder[0];
  }, [location.pathname]);

  if (location.pathname === '/visualization' || location.pathname === '/visualization/') {
    return <Navigate to="/visualization/1" replace />;
  }

  const idx = visualizationOrder.findIndex((s) => s.step === current.step);
  const prev = idx > 0 ? visualizationOrder[idx - 1] : null;
  const next = idx < visualizationOrder.length - 1 ? visualizationOrder[idx + 1] : null;

  const SceneComponent = getVisualizationScene(current.step);

  const navigateWithFade = useCallback((path) => {
    setVisible(false);
    setTimeout(() => {
      navigate(path);
      setVisible(true);
    }, 400);
  }, [navigate]);

  const { onTimelineComplete } = useCinematicPlayback({
    step: current.step,
    durationMs: current.durationMs ?? 12000,
    nextPath: next?.path,
    playing,
    setPlaying,
    sceneRef,
    onStepEnter: () => {
      setVisible(true);
      requestAnimationFrame(() => sceneRef.current?.restart?.());
    },
  });

  const handleTimelineComplete = useCallback(() => {
    if (playing) onTimelineComplete();
  }, [playing, onTimelineComplete]);

  const togglePlay = () => setPlaying((p) => !p);

  const handleRestart = () => {
    sceneRef.current?.restart?.();
  };

  const goPrev = () => prev && navigateWithFade(prev.path);
  const goNext = () => next && navigateWithFade(next.path);

  const toggleFs = async () => {
    if (!document.fullscreenElement) {
      await wrapRef.current?.requestFullscreen?.();
      setFs(true);
    } else {
      await document.exitFullscreen?.();
      setFs(false);
    }
  };

  React.useEffect(() => {
    const onKey = (e) => {
      if (e.code === 'ArrowLeft' && prev) navigateWithFade(prev.path);
      if (e.code === 'ArrowRight' && next) navigateWithFade(next.path);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [prev, next, navigateWithFade]);

  return (
    <PageWrap ref={wrapRef} $visible={visible}>
      <SceneArea>
        <SceneComponent
          ref={sceneRef}
          onTimelineComplete={handleTimelineComplete}
        />
      </SceneArea>

      <BottomBar>
        <ProgressTrack>
          {visualizationOrder.map((s) => {
            const section = visualizationSections.find((sec) => sec.steps.includes(s.step));
            const isActive = s.step === current.step;
            const isDone = s.step < current.step;
            return (
              <ProgressSeg
                key={s.step}
                type="button"
                title={`${section?.title ?? ''} · ${s.title}`}
                $active={isActive}
                $done={isDone}
                onClick={() => navigateWithFade(s.path)}
              />
            );
          })}
        </ProgressTrack>

        <Controls>
          <CtrlBtn type="button" onClick={goPrev} disabled={!prev}>
            <ChevronLeft size={18} />
          </CtrlBtn>
          <CtrlBtn type="button" onClick={togglePlay}>
            {playing ? <Pause size={16} /> : <Play size={16} />}
            {playing ? 'Pause' : 'Play'}
          </CtrlBtn>
          <CtrlBtn type="button" onClick={handleRestart}>
            <RotateCcw size={16} />
            Restart
          </CtrlBtn>
          <StepCounter>{current.step} / {VIZ_TOTAL_STEPS}</StepCounter>
          <CtrlBtn type="button" onClick={goNext} disabled={!next}>
            <ChevronRight size={18} />
          </CtrlBtn>
          <CtrlBtn type="button" onClick={toggleFs}>
            {fs ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </CtrlBtn>
        </Controls>
      </BottomBar>
    </PageWrap>
  );
};

export default VisualExplainerPage;
