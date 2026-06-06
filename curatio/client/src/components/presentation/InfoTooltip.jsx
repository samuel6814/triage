import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { HelpCircle, X } from 'lucide-react';

import { INFO } from './infoContent';

const Trigger = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  margin-left: 4px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: #16a34a;
  cursor: pointer;
  vertical-align: middle;
  transition: color 0.15s ease, transform 0.15s ease;
  flex-shrink: 0;

  &:hover {
    color: #166534;
    transform: scale(1.12);
  }

  &:focus-visible {
    outline: 2px solid #22c55e;
    outline-offset: 2px;
    border-radius: 50%;
  }

  svg { display: block; }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  animation: infoFade 0.18s ease-out;

  @keyframes infoFade {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const Panel = styled.div`
  width: 100%;
  max-width: 640px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid rgba(22, 101, 52, 0.12);
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.28);
  overflow: hidden;
  animation: infoPop 0.2s cubic-bezier(0.4, 0.2, 0.2, 1);

  @keyframes infoPop {
    from { opacity: 0; transform: translateY(12px) scale(0.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.1rem 1.5rem;
  background: #f0fdf4;
  border-bottom: 1px solid #dcfce7;
  flex-shrink: 0;
`;

const HeaderTitle = styled.h3`
  margin: 0;
  font-size: 1.15rem;
  font-weight: 800;
  color: #166534;
  letter-spacing: -0.3px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  color: #475569;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.15s ease;

  &:hover {
    background: #fee2e2;
    border-color: #fecaca;
    color: #dc2626;
  }
`;

const Body = styled.div`
  padding: 1.5rem;
  overflow-y: auto;
  color: #334155;
  font-size: 1rem;
  line-height: 1.7;

  p { margin: 0 0 0.9rem; }
  p:last-child { margin-bottom: 0; }

  ul {
    margin: 0 0 0.9rem;
    padding-left: 1.25rem;
    line-height: 1.7;
  }
  li { margin-bottom: 0.35rem; }

  strong { color: #166534; }

  code {
    font-family: 'KaTeX_Main', 'Courier New', monospace;
    background: #f1f5f9;
    padding: 1px 6px;
    border-radius: 6px;
    font-size: 0.92em;
    color: #1e293b;
  }

  .formula {
    margin: 0.75rem 0;
    padding: 0.75rem 1rem;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 0.95rem;
    line-height: 1.6;
  }

  .symbols {
    margin-top: 0.5rem;
    font-size: 0.92rem;
    color: #475569;
  }

  .why {
    margin-top: 1rem;
    padding: 0.85rem 1.1rem;
    background: #f0fdf4;
    border-left: 4px solid #22c55e;
    border-radius: 0 10px 10px 0;
    color: #166534;
  }
  .why strong { color: #166534; }

  .sayLive {
    margin-top: 1rem;
    padding: 0.85rem 1.1rem;
    background: #eff6ff;
    border-left: 4px solid #3b82f6;
    border-radius: 0 10px 10px 0;
    color: #1e3a5f;
    font-size: 0.95rem;
  }
  .sayLive strong { color: #1d4ed8; }

  .phase {
    display: block;
    font-size: 0.78rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #166534;
    margin-bottom: 0.5rem;
  }

  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 6px; }
`;

/**
 * Clickable "?" help icon that opens an inline, fullscreen-safe modal.
 *
 * Pass either a `topic` key (resolved from infoContent.INFO) or an ad-hoc
 * `title` + children. Rendered inline (no body portal) so it remains visible
 * when the presentation is in fullscreen.
 */
const InfoTooltip = ({ topic, title, children, label }) => {
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

  const entry = topic ? INFO[topic] : null;
  const resolvedTitle = title || entry?.title || 'More info';
  const resolvedBody = children || entry?.body || null;
  const accessibleLabel = label || `Explain: ${resolvedTitle}`;

  useEffect(() => {
    if (!open) return undefined;

    // Capture-phase handler so Esc closes the modal and Arrow keys do not
    // leak to the slide-navigation listener in PresentationScreen.
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        setOpen(false);
        return;
      }
      if (e.key.startsWith('Arrow')) {
        e.stopPropagation();
      }
    };

    document.addEventListener('keydown', onKeyDown, true);
    panelRef.current?.focus();
    return () => document.removeEventListener('keydown', onKeyDown, true);
  }, [open]);

  return (
    <>
      <Trigger
        type="button"
        onClick={() => setOpen(true)}
        aria-label={accessibleLabel}
        title={accessibleLabel}
      >
        <HelpCircle size={16} strokeWidth={2.5} />
      </Trigger>

      {open && (
        <Overlay
          onClick={() => setOpen(false)}
          role="presentation"
        >
          <Panel
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={resolvedTitle}
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
          >
            <Header>
              <HeaderTitle>
                <HelpCircle size={20} strokeWidth={2.5} />
                {resolvedTitle}
              </HeaderTitle>
              <CloseButton
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                title="Close"
              >
                <X size={18} />
              </CloseButton>
            </Header>
            <Body>{resolvedBody}</Body>
          </Panel>
        </Overlay>
      )}
    </>
  );
};

export default InfoTooltip;
