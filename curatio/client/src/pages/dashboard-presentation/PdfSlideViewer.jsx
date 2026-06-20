import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

const PDF_URL = '/nlp_patient_to_acuity.pdf';
const ASPECT = 16 / 9;

const Viewport = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #0f172a;
  border-radius: inherit;
`;

const PageFrame = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${(props) => props.$width}px;
  height: ${(props) => props.$height}px;
  max-width: 100%;
  max-height: 100%;

  .react-pdf__Page {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .react-pdf__Page__canvas {
    display: block;
    border-radius: 4px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);
  }
`;

const StatusMessage = styled.p`
  color: #94a3b8;
  font-size: 0.95rem;
  margin: 0;
`;

const PdfSlideViewer = ({ pageNumber }) => {
  const viewportRef = useRef(null);
  const [dims, setDims] = useState({ width: 640, height: 360 });
  const [numPages, setNumPages] = useState(null);
  const [loadError, setLoadError] = useState(null);

  const updateDims = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    const { clientWidth, clientHeight } = el;
    if (clientWidth <= 0 || clientHeight <= 0) return;

    let width = clientWidth;
    let height = width / ASPECT;
    if (height > clientHeight) {
      height = clientHeight;
      width = height * ASPECT;
    }
    setDims({ width: Math.floor(width), height: Math.floor(height) });
  }, []);

  useEffect(() => {
    updateDims();
    const el = viewportRef.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(updateDims);
    ro.observe(el);
    return () => ro.disconnect();
  }, [updateDims]);

  const onLoadSuccess = ({ numPages: total }) => {
    setNumPages(total);
    setLoadError(null);
  };

  const onLoadError = (err) => {
    setLoadError(err?.message || 'Failed to load PDF');
  };

  const page = Math.min(Math.max(1, pageNumber), numPages || pageNumber);

  return (
    <Viewport ref={viewportRef}>
      {loadError ? (
        <StatusMessage>{loadError}</StatusMessage>
      ) : (
        <Document
          file={PDF_URL}
          onLoadSuccess={onLoadSuccess}
          onLoadError={onLoadError}
          loading={<StatusMessage>Loading presentation…</StatusMessage>}
          error={<StatusMessage>Could not load presentation PDF.</StatusMessage>}
        >
          <PageFrame $width={dims.width} $height={dims.height}>
            <Page
              pageNumber={page}
              width={dims.width}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              loading={<StatusMessage>Rendering slide…</StatusMessage>}
            />
          </PageFrame>
        </Document>
      )}
    </Viewport>
  );
};

export default PdfSlideViewer;
