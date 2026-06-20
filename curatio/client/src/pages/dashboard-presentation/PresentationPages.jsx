import React, { useMemo } from 'react';
import styled from 'styled-components';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import PresentationScreen from './PresentationScreen';
import PdfSlideViewer from './PdfSlideViewer';
import {
  NLP_TOTAL_PAGES,
  nlpPresentationOrder,
  getSlideByPath,
} from './nlpPresentationSlides';

const NavigationFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${(props) => (props.$pdfMode ? '0.65rem' : '2rem')};
  padding-top: ${(props) => (props.$pdfMode ? '0.5rem' : '1.5rem')};
  border-top: 1px solid #f1f5f9;
  flex-shrink: 0;
`;

const NavButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: ${(props) => (props.$pdfMode ? '8px 16px' : '10px 20px')};
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  color: #1e293b;
  font-weight: 600;
  font-size: ${(props) => (props.$pdfMode ? '0.88rem' : '0.95rem')};
  cursor: pointer;
  transition: all 0.2s ease;
  visibility: ${(props) => (props.hidden ? 'hidden' : 'visible')};

  &:hover {
    background: #f0fdf4;
    border-color: #bbf7d0;
    color: #166534;
    transform: ${(props) => (props.direction === 'prev' ? 'translateX(-2px)' : 'translateX(2px)')};
  }

  span.sub-text {
    display: block;
    font-size: 0.72rem;
    color: #94a3b8;
    font-weight: 500;
    text-align: ${(props) => (props.direction === 'prev' ? 'left' : 'right')};
  }
`;

const PresentationPages = () => {
  const location = useLocation();
  const navigate = useNavigate();

  if (location.pathname === '/dashboard' || location.pathname === '/dashboard/') {
    return <Navigate to="/dashboard/nlp/1" replace />;
  }

  const currentSlide = useMemo(() => {
    const match = getSlideByPath(location.pathname);
    if (match) return match;
    const pageMatch = location.pathname.match(/\/dashboard\/nlp\/(\d+)/);
    if (pageMatch) {
      const page = Math.min(Math.max(1, Number(pageMatch[1])), NLP_TOTAL_PAGES);
      return nlpPresentationOrder.find((s) => s.page === page) ?? nlpPresentationOrder[0];
    }
    return nlpPresentationOrder[0];
  }, [location.pathname]);

  const currentIndex = nlpPresentationOrder.findIndex((s) => s.page === currentSlide.page);
  const prevSlide = currentIndex > 0 ? nlpPresentationOrder[currentIndex - 1] : null;
  const nextSlide =
    currentIndex < nlpPresentationOrder.length - 1
      ? nlpPresentationOrder[currentIndex + 1]
      : null;

  const footer = (
    <NavigationFooter $pdfMode>
      <NavButton
        direction="prev"
        hidden={!prevSlide}
        onClick={() => prevSlide && navigate(prevSlide.path)}
      >
        <ChevronLeft size={20} />
        <div>
          <span className="sub-text">Previous</span>
          {prevSlide ? `Page ${prevSlide.page}: ${prevSlide.title}` : ''}
        </div>
      </NavButton>

      <NavButton
        direction="next"
        hidden={!nextSlide}
        onClick={() => nextSlide && navigate(nextSlide.path)}
      >
        <div style={{ textAlign: 'right' }}>
          <span className="sub-text">Next</span>
          {nextSlide ? `Page ${nextSlide.page}: ${nextSlide.title}` : ''}
        </div>
        <ChevronRight size={20} />
      </NavButton>
    </NavigationFooter>
  );

  return (
    <PresentationScreen
      mode="pdf"
      title={currentSlide.title}
      subtitle={currentSlide.subtitle}
      slideKey={currentSlide.id}
      pageNumber={currentSlide.page}
      totalPages={NLP_TOTAL_PAGES}
      guideTopic={currentSlide.guideTopic}
      hasPrev={Boolean(prevSlide)}
      hasNext={Boolean(nextSlide)}
      onPrev={() => prevSlide && navigate(prevSlide.path)}
      onNext={() => nextSlide && navigate(nextSlide.path)}
      footer={footer}
    >
      <PdfSlideViewer pageNumber={currentSlide.page} />
    </PresentationScreen>
  );
};

export { nlpPresentationOrder as presentationOrder };

export default PresentationPages;
