import { useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { VIZ_DWELL_MS } from '../../pages/visualization/vizAnimationConfig';

const DWELL_MS = VIZ_DWELL_MS;

/**
 * Cinematic auto-advance: plays scene on mount, advances after timeline + dwell.
 * Fallback cap timer only fires if timeline onComplete never arrives.
 */
export function useCinematicPlayback({
  step,
  durationMs = 12000,
  nextPath,
  playing,
  setPlaying,
  sceneRef,
  onStepEnter,
}) {
  const navigate = useNavigate();
  const timerRef = useRef(null);
  const advancedRef = useRef(false);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const goNext = useCallback(() => {
    if (advancedRef.current) return;
    advancedRef.current = true;
    clearTimer();
    if (nextPath) navigate(nextPath);
    else setPlaying(false);
  }, [nextPath, navigate, setPlaying, clearTimer]);

  const scheduleFallbackCap = useCallback(() => {
    clearTimer();
    if (!playing) return;
    const timelineDur = (sceneRef.current?.getDuration?.() ?? 0) * 1000;
    const cap = Math.max(durationMs, timelineDur + DWELL_MS + 500);
    timerRef.current = setTimeout(goNext, cap);
  }, [playing, durationMs, goNext, clearTimer, sceneRef]);

  const onTimelineComplete = useCallback(() => {
    if (!playing || advancedRef.current) return;
    clearTimer();
    timerRef.current = setTimeout(goNext, DWELL_MS);
  }, [playing, goNext, clearTimer]);

  useEffect(() => {
    advancedRef.current = false;
    clearTimer();
    onStepEnter?.();
    const id = requestAnimationFrame(() => {
      sceneRef.current?.restart?.();
      if (playing) sceneRef.current?.play?.();
      scheduleFallbackCap();
    });
    return () => {
      cancelAnimationFrame(id);
      clearTimer();
    };
  }, [step, clearTimer, scheduleFallbackCap, playing, sceneRef, onStepEnter]);

  useEffect(() => {
    if (playing) {
      sceneRef.current?.play?.();
    } else {
      sceneRef.current?.pause?.();
      clearTimer();
    }
  }, [playing, clearTimer, sceneRef]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setPlaying((p) => !p);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setPlaying]);

  return { goNext, clearTimer, onTimelineComplete };
}

export default useCinematicPlayback;
