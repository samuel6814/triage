import React, { useState } from 'react';
import styled from 'styled-components';
import { Loader2, Mic, Square, Upload } from 'lucide-react';
import { useBrowserSpeech } from '../../hooks/useBrowserSpeech';
import { useAudioRecorder } from '../../hooks/useAudioRecorder';

const API_BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');

const Panel = styled.div`
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: 14px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
`;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
`;

const ModeBtn = styled.button`
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid ${(p) => (p.$active ? '#22c55e' : '#e2e8f0')};
  background: ${(p) => (p.$active ? '#f0fdf4' : '#fff')};
  color: ${(p) => (p.$active ? '#166534' : '#475569')};
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
`;

const ActionBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border-radius: 999px;
  border: none;
  background: ${(p) => (p.$danger ? '#ef4444' : '#166534')};
  color: white;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;

const Status = styled.p`
  margin: 0.75rem 0 0;
  font-size: 0.82rem;
  color: #64748b;
  line-height: 1.45;
`;

const ErrorText = styled.p`
  margin: 0.5rem 0 0;
  font-size: 0.82rem;
  color: #b91c1c;
`;

const PreviewCard = styled.div`
  margin-top: 0.75rem;
  padding: 0.85rem 1rem;
  border-radius: 12px;
  background: #fff;
  border: 1px solid #e2e8f0;
`;

const PreviewLabel = styled.div`
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #64748b;
  margin-bottom: 0.35rem;
`;

const PreviewText = styled.textarea`
  width: 100%;
  min-height: 56px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 0.65rem 0.75rem;
  font-family: inherit;
  font-size: 0.9rem;
  resize: vertical;
  box-sizing: border-box;
`;

export default function VoiceInput({ onEnglishText, onTwiResult }) {
  const [mode, setMode] = useState('en');
  const [uploading, setUploading] = useState(false);
  const [twiPreview, setTwiPreview] = useState(null);
  const [englishDraft, setEnglishDraft] = useState('');

  const speech = useBrowserSpeech({
    language: 'en-GH',
    onFinal: (transcript) => onEnglishText?.(transcript),
  });

  const recorder = useAudioRecorder();

  const handleTwiStop = async () => {
    try {
      setUploading(true);
      const { blob, mimeType, durationMs } = await recorder.stop();
      const ext = mimeType.includes('mp4') ? 'm4a' : mimeType.includes('ogg') ? 'ogg' : 'webm';
      const form = new FormData();
      form.append('audio', blob, `recording.${ext}`);
      form.append('language', 'tw');

      const res = await fetch(`${API_BASE}/api/voice/intake`, {
        method: 'POST',
        body: form,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail ?? data.message ?? 'Voice intake failed');
      }

      setTwiPreview(data);
      setEnglishDraft(data.transcript_english || '');
      onTwiResult?.(data);
    } catch (err) {
      setTwiPreview({ error: err.message });
    } finally {
      setUploading(false);
    }
  };

  const applyEnglish = () => {
    if (englishDraft.trim()) {
      onEnglishText?.(englishDraft.trim());
    }
  };

  return (
    <Panel>
      <Row>
        <ModeBtn type="button" $active={mode === 'en'} onClick={() => setMode('en')}>
          English (browser)
        </ModeBtn>
        <ModeBtn type="button" $active={mode === 'tw'} onClick={() => setMode('tw')}>
          Twi (record + translate)
        </ModeBtn>
      </Row>

      {mode === 'en' && (
        <>
          <Row style={{ marginTop: '0.75rem' }}>
            <ActionBtn
              type="button"
              onClick={speech.listening ? speech.stop : speech.start}
              disabled={!speech.supported}
            >
              {speech.listening ? <Square size={16} /> : <Mic size={16} />}
              {speech.listening ? 'Stop listening' : 'Speak in English'}
            </ActionBtn>
          </Row>
          {!speech.supported && (
            <ErrorText>Web Speech API unavailable — use Chrome/Edge or switch to Twi recording.</ErrorText>
          )}
          {speech.interim && <Status>Listening: {speech.interim}</Status>}
          {speech.error && <ErrorText>{speech.error}</ErrorText>}
          <Status>English speech fills the chief complaint field directly.</Status>
        </>
      )}

      {mode === 'tw' && (
        <>
          <Row style={{ marginTop: '0.75rem' }}>
            {!recorder.recording ? (
              <ActionBtn type="button" onClick={recorder.start} disabled={uploading}>
                <Mic size={16} /> Record Twi
              </ActionBtn>
            ) : (
              <>
                <ActionBtn type="button" $danger onClick={handleTwiStop} disabled={uploading}>
                  {uploading ? <Loader2 size={16} className="spin" /> : <Square size={16} />}
                  {uploading ? 'Processing…' : 'Stop & transcribe'}
                </ActionBtn>
                <ActionBtn type="button" onClick={recorder.cancel} disabled={uploading}>
                  Cancel
                </ActionBtn>
              </>
            )}
          </Row>
          {recorder.recording && <Status>Recording… speak your chief complaint in Twi.</Status>}
          {recorder.error && <ErrorText>{recorder.error}</ErrorText>}
          {twiPreview?.error && <ErrorText>{twiPreview.error}</ErrorText>}
          {twiPreview && !twiPreview.error && (
            <>
              <PreviewCard>
                <PreviewLabel>Twi transcript</PreviewLabel>
                <PreviewText readOnly value={twiPreview.transcript_original || ''} />
              </PreviewCard>
              <PreviewCard>
                <PreviewLabel>English (edit before triage)</PreviewLabel>
                <PreviewText
                  value={englishDraft}
                  onChange={(e) => setEnglishDraft(e.target.value)}
                />
              </PreviewCard>
              <Row style={{ marginTop: '0.75rem' }}>
                <ActionBtn type="button" onClick={applyEnglish}>
                  <Upload size={16} /> Use for triage
                </ActionBtn>
              </Row>
            </>
          )}
        </>
      )}
    </Panel>
  );
}
