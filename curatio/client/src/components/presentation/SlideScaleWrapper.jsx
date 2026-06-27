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
  background: #ffffff;
`;

const AspectFrame = styled.div`
  width: 100%;
  max-height: 100%;
  aspect-ratio: 16 / 9;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  overflow: hidden;
  --slide-font-scale: 1;
`;

const ScaleInner = styled.div`
  width: 100%;
  padding: 1.25rem 1.5rem;
  transform-origin: top center;
  transform: scale(var(--slide-scale, 1));
  box-sizing: border-box;
`;

const SlideScaleWrapper = ({ children, slideKey }) => {
  const frameRef = useRef(null);
  const innerRef = useRef(null);
  const [scale, setScale] = useState(1);

  const updateScale = useCallback(() => {
    const frame = frameRef.current;
    const inner = innerRef.current;
    if (!frame || !inner) return;

    const frameH = frame.clientHeight;
    const contentH = inner.scrollHeight;
    if (frameH <= 0 || contentH <= 0) return;

    const padding = 8;
    const next = contentH > frameH - padding
      ? Math.max(0.72, (frameH - padding) / contentH)
      : 1;
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
    return () => ro.disconnect();
  }, [slideKey, updateScale, children]);

  return (
    <Viewport>
      <AspectFrame ref={frameRef}>
        <ScaleInner ref={innerRef} style={{ '--slide-scale': scale }}>
          {children}
        </ScaleInner>
      </AspectFrame>
    </Viewport>
  );
};

export default SlideScaleWrapper;
