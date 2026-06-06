import React from 'react';
import styled from 'styled-components';
import { AlertTriangle, HeartPulse, Activity } from 'lucide-react';

const SlideContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const AlertBanner = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
`;

const StepList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
`;

const Step = styled.div`
  display: flex;
  gap: 1.5rem;
  background: white;
  border: 1px solid #e2e8f0;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.02);

  .number {
    width: 40px;
    height: 40px;
    background: #ff4d4f;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 1.2rem;
    flex-shrink: 0;
  }

  .content h4 {
    margin: 0 0 8px 0;
    color: #1e293b;
    font-size: 1.1rem;
  }

  .content p {
    margin: 0;
    color: #64748b;
    line-height: 1.5;
  }
`;

const ResusSlide = () => {
  return (
    <SlideContainer>
      <AlertBanner>
        <AlertTriangle size={24} />
        TARGET RESPONSE TIME: 0 MINUTES (IMMEDIATE)
      </AlertBanner>

      <StepList>
        <Step>
          <div className="number">1</div>
          <div className="content">
            <h4>Secure Airway & Vitals</h4>
            <p>Immediate assessment of airway patency. Attach continuous cardiac, SpO2, and NIBP monitoring.</p>
          </div>
        </Step>
        <Step>
          <div className="number">2</div>
          <div className="content">
            <h4>Establish Access</h4>
            <p>Obtain two large-bore IVs or IO access. Draw stat labs including VBG, lactate, and cardiac enzymes.</p>
          </div>
        </Step>
        <Step>
          <div className="number">3</div>
          <div className="content">
            <h4>Targeted Intervention</h4>
            <p>Initiate ACLS/ATLS protocols based on primary etiology (e.g., Defibrillation, Epinephrine, Massive Transfusion).</p>
          </div>
        </Step>
      </StepList>
    </SlideContainer>
  );
};

export default ResusSlide;