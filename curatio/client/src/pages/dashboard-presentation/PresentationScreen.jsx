import React, { useRef, useLayoutEffect, useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { gsap } from 'gsap';
import { Maximize2, Minimize2, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useSidebar } from '../../context/SidebarContext';
import QaTooltip from '../../components/presentation/QaTooltip';

const SIDEBAR_WIDTH = 280;

const ScreenWrapper = styled.div`
  flex: 1;
  height: 100vh;
  background-color: #f4f7f5;
  margin-left: ${(props) => (props.$sidebarOpen ? `${SIDEBAR_WIDTH}px` : '0')};
  padding: ${(props) => (props.$fixedAspect ? '1rem 1.5rem' : '2rem 3rem')};
  display: flex;
  flex-direction: column;
  transition: margin-left 0.3s ease;
  box-sizing: border-box;
  overflow: hidden;

  @media (max-width: 1024px) {
    margin-left: 0;
    padding: ${(props) => (props.$fixedAspect ? '4.5rem 0.75rem 0.75rem' : '5rem 2rem 2rem')};
  }

  @media (max-width: 768px) {
    padding: ${(props) => (props.$fixedAspect ? '4rem 0.5rem 0.5rem' : '4.5rem 1rem 1rem')};
  }

  &:fullscreen {
    margin-left: 0;
    width: 100vw;
    height: 100vh;
    max-height: 100vh;
    overflow: hidden;
    padding: ${(props) => (props.$fixedAspect ? '0.75rem 1.25rem' : '2.5rem 4rem')};
    background: #f4f7f5;
  }

  &:-webkit-full-screen {
    margin-left: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    padding: ${(props) => (props.$fixedAspect ? '0.75rem 1.25rem' : '2.5rem 4rem')};
  }
`;

const PresentationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${(props) => (props.$fixedAspect ? '0.6rem' : '1.5rem')};
  gap: 1rem;
  flex-shrink: 0;

  ${ScreenWrapper}:fullscreen & {
    margin-bottom: ${(props) => (props.$fixedAspect ? '0.5rem' : '2rem')};
    h2 { font-size: calc(1.75rem * var(--presentation-zoom, 1)); }
    p { font-size: calc(0.95rem * var(--presentation-zoom, 1)); }
  }
`;

const SlideInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

const SlideTitle = styled.h2`
  font-size: ${(props) => (props.$fixedAspect ? '1.25rem' : '1.75rem')};
  font-weight: 800;
  color: #166534;
  margin: 0;
  letter-spacing: -0.5px;

  @media (max-width: 768px) {
    font-size: ${(props) => (props.$fixedAspect ? '1.05rem' : '1.4rem')};
  }
`;

const SlideSubtitle = styled.p`
  font-size: ${(props) => (props.$fixedAspect ? '0.82rem' : '0.95rem')};
  color: #64748b;
  margin: 0;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 0.78rem;
  }
`;

const PageBadge = styled.span`
  display: inline-block;
  margin-left: 0.5rem;
  padding: 2px 8px;
  border-radius: 6px;
  background: #dcfce7;
  color: #166534;
  font-size: 0.72rem;
  font-weight: 700;
  vertical-align: middle;
`;

const ControlsGroup = styled.div`
  display: flex;
  gap: 10px;
  flex-shrink: 0;
  align-items: center;
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f0fdf4;
    border-color: #bbf7d0;
    color: #166534;
  }
`;

const SlideCanvas = styled.div`
  flex: 1;
  min-height: 0;
  background: #ffffff;
  border-radius: ${(props) => (props.$fixedAspect ? '16px' : '24px')};
  border: 1px solid rgba(22, 101, 52, 0.08);
  box-shadow: 0 10px 40px rgba(22, 101, 52, 0.04);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;

  ${ScreenWrapper}:fullscreen & {
    min-height: 0;
    flex: 1;
    border-radius: 20px;
    box-shadow: 0 16px 48px rgba(22, 101, 52, 0.08);
  }

  @media (max-width: 768px) {
    border-radius: 12px;
  }
`;

const SlideScrollArea = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 3rem;
  font-size: calc(1rem * var(--presentation-zoom, 1));
  line-height: 1.6;
  scroll-behavior: smooth;

  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 6px;
  }

  @media (max-width: 1024px) {
    padding: 2rem;
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const AspectViewport = styled.div`
  flex: 1;
  min-height: 0;
  width: 100%;
  max-height: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  overflow: hidden;
  --slide-font-scale: 0.92;
`;

const SlideScaleWrapper = styled.div`
  width: 100%;
  max-width: 100%;
  transform-origin: top center;
  overflow: hidden;
  padding: 1.25rem 1.75rem;
  box-sizing: border-box;
`;

const KeyboardHint = styled.span`
  font-size: 0.72rem;
  color: #94a3b8;
  font-weight: 500;
  white-space: nowrap;

  @media (max-width: 640px) {
    display: none;
  }
`;

const SidebarReopenTab = styled.button`
  display: ${(props) => (props.$visible ? 'flex' : 'none')};
  position: fixed;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 900;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 56px;
  border: 1px solid #e2e8f0;
  border-left: none;
  border-radius: 0 10px 10px 0;
  background: #ffffff;
  color: #166534;
  cursor: pointer;
  box-shadow: 4px 0 12px rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease;

  &:hover {
    width: 32px;
    background: #f0fdf4;
  }

  @media (max-width: 1024px) {
    display: none;
  }
`;

const useSlideAutoScale = (slideKey, enabled) => {
  const viewportRef = useRef(null);
  const contentRef = useRef(null);
  const [scale, setScale] = useState(1);

  const measure = useCallback(() => {
    const viewport = viewportRef.current;
    const content = contentRef.current;
    if (!viewport || !content) return;

    const vh = viewport.clientHeight;
    const ch = content.scrollHeight;
    const vw = viewport.clientWidth;
    const cw = content.scrollWidth;
    if (vh === 0 || vw === 0) return;

    const scaleY = ch > vh ? vh / ch : 1;
    const scaleX = cw > vw ? vw / cw : 1;
    setScale(Math.min(1, scaleY, scaleX));
  }, []);

  useLayoutEffect(() => {
    if (!enabled) return undefined;

    measure();
    const viewport = viewportRef.current;
    const content = contentRef.current;
    if (!viewport || !content) return undefined;

    const ro = new ResizeObserver(measure);
    ro.observe(viewport);
    ro.observe(content);
    return () => ro.disconnect();
  }, [slideKey, enabled, measure]);

  return { viewportRef, contentRef, scale };
};

const PresentationScreen = ({
  title,
  subtitle,
  children,
  slideKey,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  mode = 'default',
  pageNumber,
  totalPages,
  guideTopic,
  footer,
}) => {
  const fixedAspect = mode === 'fixedAspect';
  const wrapperRef = useRef(null);
  const scrollRef = useRef(null);
  const { isOpen: sidebarOpen, toggle: toggleSidebar, open: openSidebar } = useSidebar();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { viewportRef, contentRef, scale } = useSlideAutoScale(slideKey, fixedAspect);

  useLayoutEffect(() => {
    if (fixedAspect) return undefined;
    const ctx = gsap.context(() => {
      if (scrollRef.current) {
        gsap.from(scrollRef.current, {
          y: 16,
          opacity: 0,
          duration: 0.45,
          ease: 'power3.out',
        });
      }
    });
    return () => ctx.revert();
  }, [slideKey, fixedAspect]);

  useEffect(() => {
    if (!fixedAspect) {
      scrollRef.current?.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [slideKey, fixedAspect]);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.closest('input, textarea, select, [contenteditable="true"]')) return;

      switch (e.key) {
        case 'ArrowLeft':
          if (hasPrev) {
            e.preventDefault();
            onPrev?.();
          }
          break;
        case 'ArrowRight':
          if (hasNext) {
            e.preventDefault();
            onNext?.();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasPrev, hasNext, onPrev, onNext]);

  const handleFullscreen = async () => {
    const el = wrapperRef.current;
    if (!el) return;

    try {
      if (!document.fullscreenElement) {
        await el.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
    }
  };

  return (
    <>
      <SidebarReopenTab
        $visible={!sidebarOpen}
        type="button"
        title="Open sidebar"
        aria-label="Open sidebar"
        onClick={openSidebar}
      >
        <PanelLeftOpen size={18} />
      </SidebarReopenTab>

      <ScreenWrapper ref={wrapperRef} $sidebarOpen={sidebarOpen} $fixedAspect={fixedAspect}>
        <PresentationHeader $fixedAspect={fixedAspect}>
          <SlideInfo>
            <SlideTitle $fixedAspect={fixedAspect}>
              {title || 'Curatio Presentation'}
              {fixedAspect && pageNumber && totalPages && (
                <PageBadge>
                  {pageNumber} / {totalPages}
                </PageBadge>
              )}
            </SlideTitle>
            <SlideSubtitle $fixedAspect={fixedAspect}>
              {subtitle || 'View and interact with clinical data'}
            </SlideSubtitle>
          </SlideInfo>

          <ControlsGroup>
            <KeyboardHint>{fixedAspect ? '← → pages' : '← → slides'}</KeyboardHint>
            {fixedAspect && guideTopic && (
              <QaTooltip topic={guideTopic} label="Q&A" />
            )}
            <IconButton
              type="button"
              title={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
              aria-label={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
              onClick={toggleSidebar}
            >
              {sidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
            </IconButton>
            <IconButton
              type="button"
              title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen presentation'}
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              onClick={handleFullscreen}
            >
              {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </IconButton>
          </ControlsGroup>
        </PresentationHeader>

        <SlideCanvas $fixedAspect={fixedAspect}>
          {fixedAspect ? (
            <AspectViewport ref={viewportRef}>
              <SlideScaleWrapper
                ref={contentRef}
                style={{ transform: scale < 1 ? `scale(${scale})` : undefined }}
              >
                {children}
              </SlideScaleWrapper>
            </AspectViewport>
          ) : (
            <SlideScrollArea ref={scrollRef}>{children}</SlideScrollArea>
          )}
        </SlideCanvas>

        {footer}
      </ScreenWrapper>
    </>
  );
};

export default PresentationScreen;
