import React, { useRef, useLayoutEffect } from 'react';
import styled from 'styled-components';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star } from 'lucide-react';

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// ==========================================
// 1. STYLED COMPONENTS
// ==========================================

const RatingsWrapper = styled.section`
  padding: 120px 8%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f4f7f5; /* Curatio theme background */
  overflow: hidden;
  box-sizing: border-box;

  /* Tablet Breakpoint */
  @media (max-width: 1024px) {
    padding: 100px 5%;
  }

  /* Mobile Breakpoint */
  @media (max-width: 768px) {
    padding: 80px 5%;
  }
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 80px;
  z-index: 10;

  @media (max-width: 768px) {
    margin-bottom: 40px;
  }
`;

const Subtitle = styled.p`
  font-size: 1rem;
  font-weight: 700;
  color: #22c55e; /* Vibrant green accent */
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 12px;
`;

const Title = styled.h2`
  font-size: 3.5rem;
  font-weight: 800;
  color: #166534; /* Dark forest green */
  letter-spacing: -1px;
  margin: 0;

  @media (max-width: 1024px) {
    font-size: 3rem;
  }

  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const CardsContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 800px;
  height: 450px;
  display: flex;
  justify-content: center;
  align-items: center;

  /* Scale down slightly on tablet to prevent horizontal overflow */
  @media (max-width: 1024px) {
    transform: scale(0.9);
  }

  /* Stack cleanly on mobile */
  @media (max-width: 768px) {
    height: auto;
    transform: none;
    flex-direction: column;
    gap: 24px;
  }
`;

const Card = styled.div`
  position: absolute;
  width: 300px;
  padding: 28px;
  border-radius: 24px;
  background-color: ${(props) => props.bg || '#fff'};
  color: ${(props) => props.color || '#333'};
  box-shadow: 0 20px 40px rgba(22, 101, 52, 0.08); /* Green-tinted shadow */
  display: flex;
  flex-direction: column;
  gap: 16px;
  cursor: grab;
  will-change: transform;
  box-sizing: border-box;

  @media (max-width: 768px) {
    position: relative;
    transform: none !important; 
    width: 100%;
    max-width: 400px;
  }
`;

const StarContainer = styled.div`
  display: flex;
  gap: 4px;
`;

const ReviewText = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  font-weight: 500;
  opacity: 0.95;
  margin: 0;
`;

const Author = styled.div`
  margin-top: 8px;
  padding-top: 16px;
  border-top: 1px solid ${(props) => (props.darkTheme ? 'rgba(255,255,255,0.15)' : 'rgba(22, 101, 52, 0.1)')};
  font-weight: 700;
  font-size: 0.95rem;
`;

// ==========================================
// 2. COMPONENT LOGIC & DATA
// ==========================================

// Curatio Themed Data
const reviewsData = [
  {
    id: 1,
    name: "Dr. Stephen A.",
    text: "Within minutes the system categorised the emergency queue perfectly. Spectacular triage accuracy.",
    bg: "#166534", // Dark Forest Green
    color: "#ffffff",
    targetX: -220,
    targetY: 40,
    targetRotate: -12,
    zIndex: 2,
    starColor: "#4ade80" // Light green stars
  },
  {
    id: 2,
    name: "Nurse Barry W.",
    text: "Really useful system. We got an amazing response time for our clinical pathways during the busiest shift.",
    bg: "#ffffff",
    color: "#1e293b", // Slate text
    targetX: -80,
    targetY: 110,
    targetRotate: -4,
    zIndex: 4,
    starColor: "#22c55e" // Vibrant green stars
  },
  {
    id: 3,
    name: "Head of ER",
    text: "Super professional, organised and great to work with. Curatio was invaluable on our last major influx.",
    bg: "#22c55e", // Vibrant Green
    color: "#ffffff",
    targetX: -20,
    targetY: -40,
    targetRotate: -6,
    zIndex: 1,
    starColor: "#ffffff"
  },
  {
    id: 4,
    name: "Dr. Simon F.",
    text: "Sorted clinical pathways in real-time. Very timely and professional tool for our staff. Excellent interface :)",
    bg: "#dcfce7", // Mint / Soft Green
    color: "#166534",
    targetX: 120,
    targetY: 60,
    targetRotate: 6,
    zIndex: 5,
    starColor: "#16a34a"
  },
  {
    id: 5,
    name: "Admin Sarah T.",
    text: "I recently used this for our hospital conference. Excellent rates of accuracy. Highly recommend.",
    bg: "#ffffff",
    color: "#475569",
    targetX: 190,
    targetY: -20,
    targetRotate: 12,
    zIndex: 0,
    starColor: "#22c55e"
  }
];

const Ratings = () => {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    // Only run the scatter animation on screens larger than mobile
    const isNotMobile = window.innerWidth > 768;

    if (isNotMobile) {
      let ctx = gsap.context(() => {
        // Start all cards in the dead center, invisible
        gsap.set('.review-card', {
          x: 0,
          y: 0,
          rotation: 0,
          scale: 0.5,
          opacity: 0,
        });

        // Fan them out to their target positions
        gsap.to('.review-card', {
          x: (index) => reviewsData[index].targetX,
          y: (index) => reviewsData[index].targetY,
          rotation: (index) => reviewsData[index].targetRotate,
          scale: 1,
          opacity: 1,
          duration: 1.5,
          ease: 'back.out(1.2)',
          stagger: 0.1, 
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 75%', 
          }
        });

      }, containerRef);

      return () => ctx.revert();
    }
  }, []);

  // Hover effect to bring a card to the front on desktop/tablet
  const handleMouseEnter = (e) => {
    if (window.innerWidth > 768) {
      gsap.to(e.currentTarget, { scale: 1.05, zIndex: 10, duration: 0.3 });
    }
  };

  const handleMouseLeave = (e, originalZIndex) => {
    if (window.innerWidth > 768) {
      gsap.to(e.currentTarget, { scale: 1, zIndex: originalZIndex, duration: 0.3 });
    }
  };

  return (
    <RatingsWrapper>
      <SectionHeader>
        <Subtitle>Rating & Reviews</Subtitle>
        <Title>Trusted by professionals</Title>
      </SectionHeader>

      <CardsContainer ref={containerRef}>
        {reviewsData.map((review, index) => (
          <Card
            key={review.id}
            className="review-card"
            bg={review.bg}
            color={review.color}
            style={{ zIndex: review.zIndex }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={(e) => handleMouseLeave(e, review.zIndex)}
          >
            <StarContainer>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} fill={review.starColor} color={review.starColor} strokeWidth={1} />
              ))}
            </StarContainer>
            
            <ReviewText>{review.text}</ReviewText>
            
            <Author darkTheme={review.bg === '#166534' || review.bg === '#22c55e'}>
              {review.name}
            </Author>
          </Card>
        ))}
      </CardsContainer>
    </RatingsWrapper>
  );
};

// ==========================================
// 3. EXPORT
// ==========================================

export default Ratings;