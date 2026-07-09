import { useCallback, useEffect, useRef, useState } from 'react';

function pickMimeType() {
  const types = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg'];
  return types.find((type) => MediaRecorder.isTypeSupported(type)) || '';
}

export function useAudioRecorder() {
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);

  const [recording, setRecording] = useState(false);
  const [error, setError] = useState(null);
  const [durationMs, setDurationMs] = useState(0);
  const startedAtRef = useRef(0);

  const cleanupStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  const start = useCallback(async () => {
    setError(null);
    chunksRef.current = [];

    if (!navigator.mediaDevices?.getUserMedia) {
      setError('Audio recording is not supported in this browser.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mimeType = pickMimeType();
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onerror = () => setError('Recording failed.');
      mediaRecorderRef.current = recorder;
      startedAtRef.current = Date.now();
      recorder.start();
      setRecording(true);
    } catch (err) {
      setError(err.name === 'NotAllowedError'
        ? 'Microphone permission denied.'
        : err.message || 'Could not start recording.');
      cleanupStream();
    }
  }, [cleanupStream]);

  const stop = useCallback(() => new Promise((resolve, reject) => {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state === 'inactive') {
      reject(new Error('No active recording.'));
      return;
    }

    recorder.onstop = () => {
      const mimeType = recorder.mimeType || 'audio/webm';
      const blob = new Blob(chunksRef.current, { type: mimeType });
      const duration = Date.now() - startedAtRef.current;
      setDurationMs(duration);
      setRecording(false);
      cleanupStream();
      resolve({ blob, mimeType, durationMs: duration });
    };
    recorder.stop();
  }), [cleanupStream]);

  const cancel = useCallback(() => {
    mediaRecorderRef.current?.stop();
    chunksRef.current = [];
    setRecording(false);
    cleanupStream();
  }, [cleanupStream]);

  useEffect(() => () => cleanupStream(), [cleanupStream]);

  return { recording, error, durationMs, start, stop, cancel };
}
