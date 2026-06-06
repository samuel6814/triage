import React, { useRef, useLayoutEffect } from 'react';
import styled from 'styled-components';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ActivitySquare, ShieldPlus } from 'lucide-react';

// Register ScrollTrigger if you haven't already globally
gsap.registerPlugin(ScrollTrigger);

// ==========================================
// 1. STYLED COMPONENTS
// ==========================================

const FeaturesWrapper = styled.section`
  padding: 120px 8%;
  background-color: #f4f7f5; /* Matches Hero background */
  display: flex;
  flex-direction: column;
  gap: 40px;
  box-sizing: border-box;

  /* Tablet */
  @media (max-width: 1024px) {
    padding: 100px 5%;
  }

  /* Mobile */
  @media (max-width: 768px) {
    padding: 80px 5%;
    gap: 32px;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`;

const Title = styled.h2`
  font-size: 3.2rem;
  font-weight: 800;
  color: #166534; /* Dark forest green */
  line-height: 1.1;
  max-width: 600px;
  letter-spacing: -1px;
  margin: 0;

  @media (max-width: 1024px) {
    font-size: 2.8rem;
  }

  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const ViewAllLink = styled.a`
  font-size: 1rem;
  font-weight: 700;
  color: #22c55e; /* Vibrant green */
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 4px;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    color: #16a34a;
    border-bottom: 2px solid #16a34a;
  }
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;
  width: 100%;

  @media (max-width: 1024px) {
    gap: 24px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.div`
  background: #ffffff;
  border-radius: 32px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 40px rgba(22, 101, 52, 0.05); /* Tinted shadow */
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 50px rgba(22, 101, 52, 0.08);
  }

  @media (max-width: 1024px) {
    padding: 32px;
  }

  @media (max-width: 768px) {
    padding: 28px;
    border-radius: 24px;
  }
`;

const Tag = styled.div`
  align-self: flex-start;
  padding: 8px 16px;
  background: #dcfce7; /* Light green pill */
  border-radius: 100px;
  font-size: 0.85rem;
  font-weight: 700;
  color: #166534;
  z-index: 2;
`;

const ImagePlaceholderArea = styled.div`
  flex: 1;
  min-height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0 40px 0;
  position: relative;

  @media (max-width: 768px) {
    min-height: 250px;
    margin: 10px 0 30px 0;
  }
`;

// Updated gradients to match the premium health/triage aesthetic
const AbstractShape = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 40px;
  background: ${(props) => props.bg || 'linear-gradient(135deg, #4ade80 0%, #16a34a 100%)'};
  transform: rotate(${(props) => props.rotation || '0deg'});
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1), inset 0 0 0 10px rgba(255,255,255,0.2);
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease;

  ${FeatureCard}:hover & {
    transform: rotate(0deg) scale(1.05);
  }

  @media (max-width: 480px) {
    width: 160px;
    height: 160px;
    border-radius: 30px;
  }
`;

const TextContainer = styled.div`
  margin-top: auto;
`;

const CardDescription = styled.p`
  font-size: 1.1rem;
  color: #475569; /* Slate text */
  line-height: 1.6;
  margin: 0;

  strong {
    color: #1e293b; /* Darker slate for emphasis */
    font-weight: 700;
    display: block;
    font-size: 1.3rem;
    margin-bottom: 8px;
    letter-spacing: -0.5px;
  }

  @media (max-width: 768px) {
    font-size: 1.05rem;
    
    strong {
      font-size: 1.2rem;
    }
  }
`;

// ==========================================
// 2. COMPONENT LOGIC
// ==========================================

const Features = () => {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // Animate the header text
      gsap.from('.feature-header-el', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        }
      });

      // Animate the cards floating up
      gsap.from('.feature-card', {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: '.cards-grid',
          start: 'top 85%',
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <FeaturesWrapper ref={sectionRef}>
      <SectionHeader>
        <Title className="feature-header-el">
          Curatio provides the full picture of patient flow.
        </Title>
        <ViewAllLink className="feature-header-el" href="#features">
          View all features <ArrowRight size={18} strokeWidth={2.5} />
        </ViewAllLink>
      </SectionHeader>

      <CardsGrid className="cards-grid">
        {/* Card 1: Triaging */}
        <FeatureCard className="feature-card">
          <Tag>Triaging</Tag>
          
          <ImagePlaceholderArea>
            {/* Triage Green Gradient */}
            <AbstractShape bg="linear-gradient(135deg, #4ade80 0%, #16a34a 100%)" rotation="-10deg">
              <ShieldPlus size={72} color="white" opacity={0.9} strokeWidth={1.5} />
            </AbstractShape>
          </ImagePlaceholderArea>

          <TextContainer>
            <CardDescription>
              <strong>Pathways are your guiding line.</strong> 
              Categorize patient urgency instantly with AI-driven precision and color-coded accuracy.
            </CardDescription>
          </TextContainer>
        </FeatureCard>

        {/* Card 2: Analytics */}
        <FeatureCard className="feature-card">
          <Tag>Analytics</Tag>
          
          <ImagePlaceholderArea>
            {/* Data/Analytics Teal Gradient */}
            <AbstractShape bg="linear-gradient(135deg, #2dd4bf 0%, #0d9488 100%)" rotation="10deg">
              <ActivitySquare size={72} color="white" opacity={0.9} strokeWidth={1.5} />
            </AbstractShape>
          </ImagePlaceholderArea>

          <TextContainer>
            <CardDescription>
              <strong>Break in new metrics with ease.</strong> 
              Monitor energy output from hospital departments and compare load levels over time.
            </CardDescription>
          </TextContainer>
        </FeatureCard>
      </CardsGrid>
    </FeaturesWrapper>
  );
};

// ==========================================
// 3. EXPORT
// ==========================================

export default Features;