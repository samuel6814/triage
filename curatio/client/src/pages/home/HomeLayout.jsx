import React from 'react';
import styled from 'styled-components';

// Import our previously created components
import Navbar from '../../components/Navbar';
import Hero from './Hero';
import Features from './Features';
import Ratings from './Ratings';
import Footer from '../../components/Footer';

// ==========================================
// 1. STYLED COMPONENTS
// ==========================================

const PageWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #fafafc; /* Matches the global light theme */
  overflow-x: hidden; /* Prevents horizontal scrolling issues */
`;

const MainContent = styled.main`
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  
  /* Optional: If your Hero feels too cramped against the fixed Navbar, 
    you can add a global padding-top here. 
    However, since your Hero has a 90vh min-height and centers its content, 
    letting it slide gracefully under the blurred Navbar looks very premium.
  */
`;

// ==========================================
// 2. COMPONENT LOGIC
// ==========================================

const HomeLayout = () => {
  return (
    <PageWrapper>
      {/* Top Navigation */}
      <Navbar />

      {/* Main Page Sections */}
      <MainContent>
        <Hero />
        <Features />
        <Ratings />
      </MainContent>

      {/* Bottom Footer */}
      <Footer />
    </PageWrapper>
  );
};

// ==========================================
// 3. EXPORT
// ==========================================

export default HomeLayout;