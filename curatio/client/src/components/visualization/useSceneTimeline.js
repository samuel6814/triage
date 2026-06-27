import { useRef, useLayoutEffect, useCallback, useImperativeHandle } from 'react';
import { gsap } from 'gsap';

/**
 * GSAP timeline hook for visualization scenes.
 * @param {function(import('gsap').Timeline, HTMLElement): void} buildTimeline
 * @param {unknown} deps - re-run when step changes
 */
export function useSceneTimeline(buildTimeline, deps = [], { onComplete, autoPlay = true } = {}) {
  const rootRef = useRef(null);
  const timelineRef = useRef(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return undefined;

    const ctx = gsap.context(() => {
      timelineRef.current?.kill();
      const tl = gsap.timeline({
        paused: true,
        onComplete: () => onCompleteRef.current?.(),
      });
      buildTimeline(tl, el);
      timelineRef.current = tl;
      if (autoPlay) tl.play(0);
    }, el);

    return () => {
      timelineRef.current?.kill();
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  const play = useCallback(() => {
    timelineRef.current?.play();
  }, []);

  const pause = useCallback(() => {
    timelineRef.current?.pause();
  }, []);

  const restart = useCallback(() => {
    timelineRef.current?.restart(true);
  }, []);

  const getDuration = useCallback(() => timelineRef.current?.duration() ?? 0, []);

  return { rootRef, play, pause, restart, getDuration, timelineRef };
}

export function useSceneTimelineRef(ref, buildTimeline, deps = []) {
  const api = useSceneTimeline(buildTimeline, deps);

  useImperativeHandle(ref, () => ({
    play: api.play,
    pause: api.pause,
    restart: api.restart,
    getDuration: api.getDuration,
  }), [api.play, api.pause, api.restart, api.getDuration]);

  return api;
}
