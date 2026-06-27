import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const Viewport = styled.div`
  flex: 1;
  min-height: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const Frame = styled.div`
  width: 100%;
  max-width: min(1400px, 96vw);
  max-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const ScaleInner = styled.div`
  width: 100%;
  transform-origin: center center;
  transform: scale(var(--viz-scale, 1));
  box-sizing: border-box;
`;

const VizScaleWrapper = ({ children, contentKey }) => {
  const frameRef = useRef(null);
  const innerRef = useRef(null);
  const [scale, setScale] = useState(1.15);

  const updateScale = useCallback(() => {
    const frame = frameRef.current;
    const inner = innerRef.current;
    if (!frame || !inner) return;

    const frameH = frame.clientHeight;
    const frameW = frame.clientWidth;
    const contentH = inner.scrollHeight;
    const contentW = inner.scrollWidth;
    if (frameH <= 0 || contentH <= 0) return;

    const baseScale = window.innerWidth >= 1280 ? 1.15 : 1.05;
    const pad = 12;
    const scaleH = (frameH - pad) / contentH;
    const scaleW = (frameW - pad) / contentW;
    const fit = Math.min(scaleH, scaleW);
    const next = contentH > frameH - pad || contentW > frameW - pad
      ? Math.max(0.85, Math.min(baseScale, fit))
      : baseScale;
    setScale(next);
  }, []);

  useEffect(() => {
    updateScale();
    const frame = frameRef.current;
    const inner = innerRef.current;
    if (!frame || !inner) return undefined;

    const ro = new ResizeObserver(updateScale);
    ro.observe(frame);
    ro.observe(inner);
    window.addEventListener('resize', updateScale);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateScale);
    };
  }, [contentKey, updateScale, children]);

  return (
    <Viewport>
      <Frame ref={frameRef}>
        <ScaleInner ref={innerRef} style={{ '--viz-scale': scale }}>
          {children}
        </ScaleInner>
      </Frame>
    </Viewport>
  );
};

export default VizScaleWrapper;
