import React, { useRef, useLayoutEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { Activity, Clock, Users, ArrowRight, ShieldCheck, Home, Plus, Menu, Sparkles } from 'lucide-react';

// ==========================================
// 1. STYLED COMPONENTS & ANIMATIONS
// ==========================================

const gradientShine = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
`;

const HeroWrapper = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 95vh;
  background-color: #f4f7f5;
  overflow: hidden;
  box-sizing: border-box;

  /* Desktop */
  padding: 120px 8% 60px;
  gap: 2rem;

  /* Tablet Breakpoint */
  @media (max-width: 1024px) {
    padding: 120px 5% 50px;
    gap: 1rem;
  }

  /* Mobile Breakpoint */
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    padding: 100px 5% 40px;
    gap: 3rem;
  }
`;

const TextColumn = styled.div`
  flex: 1;
  max-width: 600px;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    align-items: center;
    max-width: 100%;
  }
`;

const Title = styled.h1`
  font-size: 4.2rem;
  line-height: 1.1;
  font-weight: 800;
  color: #166534; 
  margin: 0;
  letter-spacing: -1px;

  @media (max-width: 1024px) {
    font-size: 3.5rem;
  }

  @media (max-width: 768px) {
    font-size: 2.8rem;
  }
`;

const Highlight = styled.span`
  display: inline-block;
  /* Premium serif contrast font */
  font-family: 'Playfair Display', Georgia, serif; 
  font-style: italic;
  font-weight: 700;
  
  /* Dark animated gradient */
  background: linear-gradient(90deg, #0f172a, #334155, #000000, #0f172a);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${gradientShine} 5s linear infinite;
`;

const Paragraph = styled.p`
  font-size: 1.2rem;
  color: #1e293b; /* Darkened text */
  line-height: 1.6;
  margin: 0;
  max-width: 90%;

  @media (max-width: 768px) {
    font-size: 1.1rem;
    max-width: 100%;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-self: flex-start;

  @media (max-width: 768px) {
    align-self: center;
    justify-content: center;
  }
`;

const Button = styled(Link)`
  padding: 16px 32px;
  background: #22c55e; 
  color: white;
  border: none;
  border-radius: 100px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  align-self: flex-start;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 10px 25px rgba(34, 197, 94, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 35px rgba(34, 197, 94, 0.4);
  }

  @media (max-width: 768px) {
    align-self: center;
  }
`;

const OutlineButton = styled(Link)`
  padding: 16px 32px;
  background: transparent;
  color: #166534;
  border: 2px solid #22c55e;
  border-radius: 100px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  transition: transform 0.2s, background 0.2s;

  &:hover {
    transform: translateY(-2px);
    background: #f0fdf4;
  }

  @media (max-width: 768px) {
    align-self: center;
  }
`;

const VisualColumn = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 1000px;
  width: 100%;

  /* Scale down the phone on very small devices so it never breaks layout */
  @media (max-width: 400px) {
    transform: scale(0.85);
  }
`;

// --- PHONE UI STYLES ---

const PhoneFrame = styled.div`
  width: 340px;
  height: 680px;
  background: #f8f9fa;
  border-radius: 48px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), inset 0 0 0 12px #e5e7eb, inset 0 0 0 14px #ffffff;
  position: relative;
  overflow: hidden;
  border: 4px solid #d1d5db;
  box-sizing: border-box; 
`;

const DynamicIsland = styled.div`
  position: absolute;
  top: 18px;
  left: 50%;
  transform: translateX(-50%);
  width: 110px;
  height: 30px;
  background: #000;
  border-radius: 20px;
  z-index: 20;
`;

const ScreenContent = styled.div`
  padding: 65px 20px 100px; 
  height: 100%;
  width: 100%;
  box-sizing: border-box; 
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  gap: 14px;
  
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
`;

const TopNav = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 5px;
  
  span {
    font-size: 0.9rem;
    color: #a1a1aa;
    font-weight: 500;
    
    &.active {
      color: #166534;
      font-weight: 700;
      border-bottom: 2px solid #22c55e;
      padding-bottom: 4px;
    }
  }
`;

const Row = styled.div`
  display: flex;
  gap: 14px;
  width: 100%;
  box-sizing: border-box;
`;

const Card = styled.div`
  background: white;
  border-radius: 20px;
  padding: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.03);
  flex: ${props => props.flex || 1};
  min-width: 0; 
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const CardTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  color: ${props => props.color || '#64748b'};
  font-weight: 600;
`;

const CardValue = styled.div`
  font-size: ${props => props.large ? '2.2rem' : '1.5rem'};
  font-weight: 700;
  color: #1a1a2e;
  margin: 8px 0 4px;
  line-height: 1;
  display: flex;
  align-items:baseline;
  
  span.unit {
    font-size: 0.8rem;
    color: #94a3b8;
    font-weight: 500;
    margin-left: 2px;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: #f1f5f9;
  border-radius: 10px;
  overflow: hidden;
  margin-top: 8px;
  display: flex;
  
  div {
    height: 100%;
  }
  .red { background: #ff4d4f; }
  .yellow { background: #faad14; }
  .green { background: #52c41a; }
`;

const DonutContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  width: 100%;
`;

const DonutItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  .circle {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    border: 5px solid ${props => props.color};
    border-top-color: #f1f5f9; 
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
  }

  span {
    font-size: 0.7rem;
    color: #64748b;
    font-weight: 600;
  }
`;

const TimelineBar = styled.div`
  display: flex;
  height: 24px;
  border-radius: 4px;
  overflow: hidden;
  gap: 2px;
  margin: 12px 0;

  div {
    flex: 1;
  }
`;

const BottomNav = styled.div`
  position: absolute;
  bottom: 12px;
  left: 20px;
  width: calc(100% - 40px);
  height: 60px;
  background: rgba(255, 255, 255, 0.95); 
  backdrop-filter: blur(10px);
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  box-shadow: 0 10px 20px rgba(0,0,0,0.05);
  z-index: 10;
  box-sizing: border-box;
`;

const NavItem = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.primary ? '#166534' : 'transparent'};
  color: ${props => props.primary ? 'white' : '#64748b'};
`;

// ==========================================
// 2. COMPONENT LOGIC
// ==========================================

const Hero = () => {
  const heroRef = useRef(null);
  const intakeCounterRef = useRef(null);
  const waitCounterRef = useRef(null);
  const sparklineRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // 1. Initial Entry Animations
      gsap.from('.animate-text', {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
      });

      gsap.from('.animate-phone', {
        x: 100,
        opacity: 0,
        rotationY: -15, 
        duration: 1.2,
        ease: 'power4.out',
        delay: 0.4,
      });

      gsap.from('.phone-card', {
        y: 30,
        opacity: 0,
        scale: 0.95,
        duration: 0.6,
        stagger: 0.1,
        ease: 'back.out(1.2)',
        delay: 0.8,
      });
      
      // 2. Data Population Animations (Counters)
      gsap.to(intakeCounterRef.current, {
        innerHTML: 142,
        duration: 2,
        snap: { innerHTML: 1 },
        ease: "power2.out",
        delay: 1.2
      });

      gsap.to(waitCounterRef.current, {
        innerHTML: 14,
        duration: 2.5,
        snap: { innerHTML: 1 },
        ease: "power2.out",
        delay: 1.2
      });

      // 3. Progress Bar Fill
      gsap.fromTo('.progress-fill', 
        { width: "0%" },
        { width: (i, target) => target.dataset.width, duration: 1.5, stagger: 0.1, ease: "power2.out", delay: 1.4 }
      );

      // 4. Timeline Segments Rise
      gsap.from('.timeline-segment', {
        scaleY: 0,
        transformOrigin: 'bottom',
        duration: 0.4,
        stagger: 0.02,
        ease: 'power2.out',
        delay: 1.6,
      });

      // 5. SVG Sparkline Draw
      gsap.fromTo(sparklineRef.current, 
        { strokeDasharray: 300, strokeDashoffset: 300 },
        { strokeDashoffset: 0, duration: 2, ease: "power2.inOut", delay: 1.5 }
      );

      // 6. Continuous Heartbeat Pulse on Icons
      gsap.to('.pulse-icon', {
        scale: 1.15,
        duration: 0.8,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        stagger: 0.2
      });

    }, heroRef);

    return () => ctx.revert();
  }, []);

  const timelineSegments = Array.from({ length: 30 }).map((_, i) => {
    const colors = ['#3b82f6', '#ff4d4f', '#faad14', '#52c41a'];
    const color = colors[Math.floor(Math.random() * colors.length)] || '#3b82f6';
    return <div key={i} className="timeline-segment" style={{ background: color }} />;
  });

  return (
    <HeroWrapper ref={heroRef}>
      
      <TextColumn>
        <Title className="animate-text">
          Hospital Chatbot for <Highlight>Color Coded</Highlight> Clinical Pathways
        </Title>
        <Paragraph className="animate-text">
          Instantly triage incoming patients with our intelligent AI system. 
          Curatio analyzes symptoms in real-time and maps them directly to 
          your hospital's operational capacity.
        </Paragraph>
        <ButtonRow className="animate-text">
          <Button to="/dashboard">
            Presentation <ArrowRight size={18} />
          </Button>
          <OutlineButton to="/test">
            Test Model <Sparkles size={18} />
          </OutlineButton>
        </ButtonRow>
      </TextColumn>

      <VisualColumn>
        <PhoneFrame className="animate-phone">
          <DynamicIsland />
          
          <ScreenContent>
            <TopNav>
              <span className="active">Triage</span>
              <span>Insights</span>
              <span>Logs</span>
            </TopNav>

            <Row>
              <Card className="phone-card">
                <CardTitle color="#10b981"><Users size={16} /> Intake</CardTitle>
                <CardValue large><span ref={intakeCounterRef} style={{ color: '#1a1a2e', fontSize: 'inherit' }}>0</span></CardValue>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Patients today</span>
                <ProgressBar>
                  <div className="progress-fill red" data-width="20%" />
                  <div className="progress-fill yellow" data-width="30%" />
                  <div className="progress-fill green" data-width="50%" />
                </ProgressBar>
              </Card>
              
              <Card className="phone-card">
                <CardTitle color="#f59e0b"><Clock size={16} /> Avg Wait</CardTitle>
                <CardValue large><span ref={waitCounterRef} style={{ color: '#1a1a2e', fontSize: 'inherit' }}>0</span><span className="unit">m</span></CardValue>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>&darr; 2m from yesterday</span>
              </Card>
            </Row>

            <Card className="phone-card">
               <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e293b' }}>Active Pathways</span>
               <DonutContainer>
                  <DonutItem color="#ff4d4f">
                    <div className="circle"><ShieldCheck className="pulse-icon" size={20} color="#ff4d4f" /></div>
                    <span>Resus</span>
                  </DonutItem>
                  <DonutItem color="#faad14">
                    <div className="circle"><Activity className="pulse-icon" size={20} color="#faad14" /></div>
                    <span>Urgent</span>
                  </DonutItem>
                  <DonutItem color="#52c41a">
                    <div className="circle"><Users className="pulse-icon" size={20} color="#52c41a" /></div>
                    <span>Standard</span>
                  </DonutItem>
               </DonutContainer>
            </Card>

            <Card className="phone-card">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>08:00 - 16:00</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#22c55e', background: '#dcfce7', padding: '2px 8px', borderRadius: '10px' }}>Load 85%</span>
              </div>
              
              <TimelineBar>
                {timelineSegments}
              </TimelineBar>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ef4444', fontSize: '0.75rem', fontWeight: 600 }}>
                <span>8H 00MIN</span>
                <span>12 CRITICAL</span>
              </div>
            </Card>

            <Row>
              <Card className="phone-card">
                <CardTitle color="#ff4d4f"><Activity size={14} /> AI Accuracy</CardTitle>
                <svg width="100%" height="40" style={{ marginTop: '10px' }}>
                  <path 
                    ref={sparklineRef}
                    d="M0,30 L20,30 L30,10 L40,35 L50,20 L120,20" 
                    fill="none" stroke="#ff4d4f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
                  />
                  <path d="M0,30 L20,30 L30,10 L40,35 L50,20 L120,20 L120,40 L0,40 Z" fill="rgba(255, 77, 79, 0.1)" stroke="none" />
                </svg>
              </Card>
              
              <Card className="phone-card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                 <div style={{ width: '100%', aspectRatio: '1', borderRadius: '50%', border: '4px solid #3b82f6', boxSizing: 'border-box' }} />
                 <div style={{ width: '100%', aspectRatio: '1', borderRadius: '50%', border: '4px solid #8b5cf6', boxSizing: 'border-box' }} />
                 <div style={{ width: '100%', aspectRatio: '1', borderRadius: '50%', border: '4px solid #eab308', boxSizing: 'border-box' }} />
                 <div style={{ width: '100%', aspectRatio: '1', borderRadius: '50%', border: '4px solid #14b8a6', boxSizing: 'border-box' }} />
              </Card>
            </Row>

          </ScreenContent>

          <BottomNav>
            <NavItem><Home size={22} /></NavItem>
            <NavItem primary><Plus size={24} /></NavItem>
            <NavItem><Menu size={22} /></NavItem>
          </BottomNav>

        </PhoneFrame>
      </VisualColumn>

    </HeroWrapper>
  );
};

export default Hero;