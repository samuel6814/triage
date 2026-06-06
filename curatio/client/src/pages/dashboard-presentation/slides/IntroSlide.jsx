import React from 'react';
import styled from 'styled-components';
import { Activity, Clock, ShieldCheck } from 'lucide-react';

const SlideContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  animation: fadeIn 0.5s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const LeadText = styled.p`
  font-size: 1.25rem;
  color: #475569;
  line-height: 1.6;
  max-width: 800px;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
`;

const FeatureBox = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 12px;

  h4 { margin: 0; color: #1e293b; font-size: 1.1rem; }
  p { margin: 0; color: #64748b; font-size: 0.9rem; line-height: 1.5; }
`;

const IntroSlide = () => {
  return (
    <SlideContainer>
      <LeadText>
        Curatio AI drastically reduces patient wait times by dynamically categorizing 
        intake severity. By replacing manual sorting with predictive algorithms, 
        hospitals can operate at peak efficiency.
      </LeadText>

      <FeatureGrid>
        <FeatureBox>
          <Activity color="#22c55e" size={28} />
          <h4>Dynamic Allocation</h4>
          <p>Real-time symptom analysis maps patients to available ward beds instantly.</p>
        </FeatureBox>
        <FeatureBox>
          <Clock color="#f59e0b" size={28} />
          <h4>Time Optimization</h4>
          <p>Average triage time reduced from 12 minutes to under 45 seconds.</p>
        </FeatureBox>
        <FeatureBox>
          <ShieldCheck color="#3b82f6" size={28} />
          <h4>Clinical Safety</h4>
          <p>Built-in fail-safes flag high-risk anomalies for immediate human review.</p>
        </FeatureBox>
      </FeatureGrid>
    </SlideContainer>
  );
};

export default IntroSlide;