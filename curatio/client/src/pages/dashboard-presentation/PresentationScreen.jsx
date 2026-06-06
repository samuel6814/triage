import React, { useRef, useLayoutEffect, useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { gsap } from 'gsap';
import { Maximize2, Minimize2, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useSidebar } from '../../context/SidebarContext';

const SIDEBAR_WIDTH = 280;
const SCROLL_STEP = 100;

const ScreenWrapper = styled.div`
  flex: 1;
  height: 100vh;
  background-color: #f4f7f5;
  margin-left: ${props => (props.$sidebarOpen ? `${SIDEBAR_WIDTH}px` : '0')};
  padding: 2rem 3rem;
  display: flex;
  flex-direction: column;
  transition: margin-left 0.3s ease;
  box-sizing: border-box;
  overflow: hidden;

  @media (max-width: 1024px) {
    margin-left: 0;
    padding: 5rem 2rem 2rem;
  }

  @media (max-width: 768px) {
    padding: 4.5rem 1rem 1rem;
  }

  &:fullscreen {
    margin-left: 0;
    width: 100vw;
    height: 100vh;
    max-height: 100vh;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 2.5rem 4rem;
    background: #f4f7f5;
    --presentation-zoom: 1.18;
  }

  &:-webkit-full-screen {
    margin-left: 0;
    width: 100vw;
    height: 100vh;
    overflow-y: auto;
    padding: 2.5rem 4rem;
    --presentation-zoom: 1.18;
  }
`;

const PresentationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
  flex-shrink: 0;

  ${ScreenWrapper}:fullscreen & {
    margin-bottom: 2rem;

    h2 { font-size: calc(1.75rem * var(--presentation-zoom, 1)); }
    p { font-size: calc(0.95rem * var(--presentation-zoom, 1)); }
  }
`;

const SlideInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

const SlideTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 800;
  color: #166534;
  margin: 0;
  letter-spacing: -0.5px;

  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
`;

const SlideSubtitle = styled.p`
  font-size: 0.95rem;
  color: #64748b;
  margin: 0;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
`;

const ControlsGroup = styled.div`
  display: flex;
  gap: 12px;
  flex-shrink: 0;
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
  border-radius: 24px;
  border: 1px solid rgba(22, 101, 52, 0.08);
  box-shadow: 0 10px 40px rgba(22, 101, 52, 0.04);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;

  ${ScreenWrapper}:fullscreen & {
    min-height: auto;
    flex: none;
    border-radius: 28px;
    box-shadow: 0 16px 48px rgba(22, 101, 52, 0.08);
  }

  @media (max-width: 768px) {
    border-radius: 20px;
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

  ${ScreenWrapper}:fullscreen & {
    overflow: visible;
    flex: none;
    padding: 3.5rem 4rem;
    font-size: calc(1rem * var(--presentation-zoom, 1));
  }

  @media (max-width: 1024px) {
    padding: 2rem;
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
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
  display: ${props => (props.$visible ? 'flex' : 'none')};
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

const PresentationScreen = ({
  title,
  subtitle,
  children,
  slideKey,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}) => {
  const wrapperRef = useRef(null);
  const scrollRef = useRef(null);
  const { isOpen: sidebarOpen, toggle: toggleSidebar, open: openSidebar } = useSidebar();
  const [isFullscreen, setIsFullscreen] = useState(false);

  useLayoutEffect(() => {
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
  }, [slideKey]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'instant' });
    if (isFullscreen) {
      wrapperRef.current?.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [slideKey, isFullscreen]);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const getScrollElement = useCallback(() => {
    if (isFullscreen && wrapperRef.current) return wrapperRef.current;
    return scrollRef.current;
  }, [isFullscreen]);

  const canScrollUp = useCallback(() => {
    const el = getScrollElement();
    return el ? el.scrollTop > 2 : false;
  }, [getScrollElement]);

  const canScrollDown = useCallback(() => {
    const el = getScrollElement();
    if (!el) return false;
    return el.scrollTop + el.clientHeight < el.scrollHeight - 2;
  }, [getScrollElement]);

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
        case 'ArrowUp':
          if (canScrollUp()) {
            e.preventDefault();
            getScrollElement()?.scrollBy({ top: -SCROLL_STEP, behavior: 'smooth' });
          }
          break;
        case 'ArrowDown':
          if (canScrollDown()) {
            e.preventDefault();
            getScrollElement()?.scrollBy({ top: SCROLL_STEP, behavior: 'smooth' });
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasPrev, hasNext, onPrev, onNext, canScrollUp, canScrollDown, getScrollElement]);

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

      <ScreenWrapper ref={wrapperRef} $sidebarOpen={sidebarOpen}>
        <PresentationHeader>
          <SlideInfo>
            <SlideTitle>{title || 'Curatio Presentation'}</SlideTitle>
            <SlideSubtitle>{subtitle || 'View and interact with clinical data'}</SlideSubtitle>
          </SlideInfo>

          <ControlsGroup>
            <KeyboardHint>← → slides · ↑ ↓ scroll</KeyboardHint>
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

        <SlideCanvas>
          <SlideScrollArea ref={scrollRef}>
            {children}
          </SlideScrollArea>
        </SlideCanvas>
      </ScreenWrapper>
    </>
  );
};

export default PresentationScreen;
