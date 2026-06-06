import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { GripVertical, Compass } from 'lucide-react';

// ==========================================
// 1. STYLED COMPONENTS
// ==========================================

const NavWrapper = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 1.5rem 5%; /* Unified padding for better centering */
  box-sizing: border-box; /* CRITICAL FIX: Keeps padding inside the 100% width */
  z-index: 100;
  display: flex;
  justify-content: center;
  /* Allows clicks to pass through the empty space around the pill */
  pointer-events: none; 

  /* Tablet Breakpoint */
  @media (max-width: 1024px) {
    padding: 1.5rem 5%;
  }

  /* Mobile Breakpoint */
  @media (max-width: 768px) {
    padding: 1rem 4%;
  }
`;

const NavInner = styled.nav`
  /* Re-enables clicks specifically for the navbar content */
  pointer-events: auto; 
  width: 100%;
  max-width: 1000px;
  box-sizing: border-box;
  
  /* Glassmorphic floating pill matching the Hero theme */
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(34, 197, 94, 0.15); /* Soft green-tinted border */
  border-radius: 100px; 
  padding: 0.5rem 0.5rem 0.5rem 2rem;
  
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 10px 40px -10px rgba(22, 101, 52, 0.1); /* Forest green shadow */
  transition: all 0.3s ease;

  /* Mobile Breakpoint */
  @media (max-width: 768px) {
    padding: 0.4rem 0.4rem 0.4rem 1.2rem;
  }
`;

const LogoText = styled(Link)`
  font-size: 1.5rem;
  font-weight: 800;
  color: #166534; /* Dark forest green from the Hero */
  text-decoration: none;
  letter-spacing: -0.5px;
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const ActionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 768px) {
    gap: 0.25rem;
  }
`;

const ExploreLink = styled(Link)`
  background: #22c55e; /* Vibrant green CTA */
  color: #ffffff;
  padding: 12px 24px;
  border-radius: 100px;
  font-size: 0.95rem;
  font-weight: 600;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background 0.2s ease, transform 0.2s ease;

  &:hover {
    background: #16a34a; /* Slightly darker green on hover */
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    padding: 10px 16px;
    font-size: 0.85rem;
    
    /* Hide text on very small screens, keep icon */
    .link-text {
      display: none;
    }
  }
`;

const DashboardLink = styled(Link)`
  background: #f4f7f5; /* Hero background color */
  color: #166534; /* Dark forest green */
  padding: 12px 16px 12px 20px;
  border-radius: 100px;
  border: 1px solid rgba(22, 101, 52, 0.1);
  font-size: 0.95rem;
  font-weight: 600;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background 0.2s ease, border-color 0.2s ease;

  &:hover {
    background: #e2e8f0;
    border-color: rgba(22, 101, 52, 0.2);
  }

  @media (max-width: 768px) {
    padding: 10px 12px 10px 16px;
    font-size: 0.85rem;
    
    /* Hide text on very small screens, keep icon */
    .link-text {
      display: none;
    }
  }
`;

// ==========================================
// 2. COMPONENT LOGIC
// ==========================================

const Navbar = () => {
  return (
    <NavWrapper>
      <NavInner>
        <LogoText to="/">
          curatio
        </LogoText>

        <ActionGroup>
          <ExploreLink to="/explore">
            <Compass size={18} />
            <span className="link-text">Explore</span>
          </ExploreLink>
          
          <DashboardLink to="/dashboard">
            <span className="link-text">Dashboard</span>
            <GripVertical size={16} color="#166534" strokeWidth={2.5} />
          </DashboardLink>
        </ActionGroup>
      </NavInner>
    </NavWrapper>
  );
};

// ==========================================
// 3. EXPORT
// ==========================================

export default Navbar;