import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { MessageCircle, X } from 'lucide-react';

import { SLIDE_GUIDE } from './slideGuideContent';

const Trigger = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #ffffff;
  color: #166534;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  flex-shrink: 0;

  &:hover {
    background: #eff6ff;
    border-color: #93c5fd;
    color: #1d4ed8;
  }

  &:focus-visible {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }
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
  animation: qaFade 0.18s ease-out;

  @keyframes qaFade {
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
  border: 1px solid rgba(59, 130, 246, 0.15);
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.28);
  overflow: hidden;
  animation: qaPop 0.2s cubic-bezier(0.4, 0.2, 0.2, 1);

  @keyframes qaPop {
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
  background: #eff6ff;
  border-bottom: 1px solid #dbeafe;
  flex-shrink: 0;
`;

const HeaderTitle = styled.h3`
  margin: 0;
  font-size: 1.15rem;
  font-weight: 800;
  color: #1e40af;
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
  strong { color: #1e40af; }

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

  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 6px; }
`;

const QaTooltip = ({ topic, label = 'Q&A' }) => {
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const entry = topic ? SLIDE_GUIDE[topic] : null;

  useEffect(() => {
    if (!open) return undefined;

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

  if (!entry) return null;

  return (
    <>
      <Trigger
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`${label}: ${entry.title}`}
        title={label}
      >
        <MessageCircle size={16} strokeWidth={2.5} />
        {label}
      </Trigger>

      {open && (
        <Overlay onClick={() => setOpen(false)} role="presentation">
          <Panel
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={entry.title}
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
          >
            <Header>
              <HeaderTitle>
                <MessageCircle size={20} strokeWidth={2.5} />
                {entry.title}
              </HeaderTitle>
              <CloseButton type="button" onClick={() => setOpen(false)} aria-label="Close">
                <X size={18} />
              </CloseButton>
            </Header>
            <Body>{entry.body}</Body>
          </Panel>
        </Overlay>
      )}
    </>
  );
};

export default QaTooltip;
