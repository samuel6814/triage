import React from 'react';
import styled from 'styled-components';
import { ArrowUpRight } from 'lucide-react';

// ==========================================
// 1. STYLED COMPONENTS
// ==========================================

const FooterWrapper = styled.footer`
  margin: 2rem 5% 2rem 5%;
  padding: 5rem 6% 14rem 6%; /* Extra bottom padding for the huge text */
  background-color: #064e3b; /* Deep forest green matching the theme */
  border-radius: 32px;
  position: relative;
  overflow: hidden;
  color: #ffffff;
  box-sizing: border-box;

  /* Tablet Breakpoint */
  @media (max-width: 1024px) {
    margin: 1.5rem 4%;
    padding: 4rem 5% 12rem 5%;
    border-radius: 28px;
  }

  /* Mobile Breakpoint */
  @media (max-width: 768px) {
    margin: 1rem 3%;
    padding: 3rem 6% 10rem 6%;
    border-radius: 24px;
  }
`;

// The four aesthetic dots in the corners
const CornerDot = styled.div`
  position: absolute;
  width: 8px;
  height: 8px;
  background-color: rgba(74, 222, 128, 0.3); /* Tinted with vibrant green */
  border-radius: 50%;

  &.top-left { top: 24px; left: 24px; }
  &.top-right { top: 24px; right: 24px; }
  &.bottom-left { bottom: 24px; left: 24px; }
  &.bottom-right { bottom: 24px; right: 24px; }

  @media (max-width: 768px) {
    width: 6px;
    height: 6px;
    &.top-left { top: 16px; left: 16px; }
    &.top-right { top: 16px; right: 16px; }
    &.bottom-left { bottom: 16px; left: 16px; }
    &.bottom-right { bottom: 16px; right: 16px; }
  }
`;

const ContentContainer = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
  z-index: 10; /* Keep above the huge background text */

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 3rem;
  }
`;

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const Heading = styled.h2`
  font-size: 2.5rem;
  font-weight: 600;
  margin: 0;
  color: #f4f7f5; /* Off-white theme background color */
  letter-spacing: -0.5px;

  @media (max-width: 1024px) {
    font-size: 2.2rem;
  }

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const EmailLink = styled.a`
  font-size: 1.2rem;
  font-weight: 500;
  color: #4ade80; /* Vibrant mint/green from the Hero */
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: opacity 0.2s ease, transform 0.2s ease;

  &:hover {
    opacity: 0.8;
    transform: translateX(4px);
  }

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2rem;

  @media (max-width: 768px) {
    align-items: flex-start;
    gap: 1.5rem;
  }
`;

const Copyright = styled.p`
  font-size: 0.95rem;
  color: #94a3b8;
  margin: 0;
  font-weight: 500;
`;

const LinkGroup = styled.div`
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    gap: 1rem;
    flex-direction: column;
  }
`;

const SocialLink = styled.a`
  font-size: 0.95rem;
  color: #d1d5db;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: color 0.2s ease;
  font-weight: 500;

  &:hover {
    color: #ffffff;
  }
`;

const HugeBackgroundText = styled.div`
  position: absolute;
  bottom: -6%;
  left: 50%;
  transform: translateX(-50%);
  font-size: 26vw;
  font-weight: 900;
  line-height: 0.75;
  color: rgba(255, 255, 255, 0.04); /* Barely visible watermark */
  pointer-events: none;
  white-space: nowrap;
  letter-spacing: -5px;
  z-index: 1;

  @media (max-width: 1024px) {
    font-size: 28vw;
    bottom: -3%;
  }

  @media (max-width: 768px) {
    font-size: 32vw;
    bottom: 0%;
    letter-spacing: -3px;
  }

  @media (max-width: 480px) {
    font-size: 38vw;
    bottom: 2%;
  }
`;

// ==========================================
// 2. COMPONENT LOGIC
// ==========================================

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <FooterWrapper>
      {/* Decorative Corner Dots */}
      <CornerDot className="top-left" />
      <CornerDot className="top-right" />
      <CornerDot className="bottom-left" />
      <CornerDot className="bottom-right" />

      <ContentContainer>
        <LeftSection>
          <Heading>Contacts</Heading>
          <EmailLink href="mailto:hello@curatio.ai">
            hello@curatio.ai <ArrowUpRight size={20} strokeWidth={2.5} />
          </EmailLink>
        </LeftSection>

        <RightSection>
          <Copyright>© {currentYear} Curatio AI</Copyright>
          <LinkGroup>
            <SocialLink href="#docs">
              Documentation <ArrowUpRight size={16} />
            </SocialLink>
            <SocialLink href="#github">
              GitHub <ArrowUpRight size={16} />
            </SocialLink>
            <SocialLink href="#linkedin">
              LinkedIn <ArrowUpRight size={16} />
            </SocialLink>
            <SocialLink href="#twitter">
              Twitter <ArrowUpRight size={16} />
            </SocialLink>
          </LinkGroup>
        </RightSection>
      </ContentContainer>

      {/* The massive branding text at the bottom */}
      <HugeBackgroundText>curatio</HugeBackgroundText>
    </FooterWrapper>
  );
};

// ==========================================
// 3. EXPORT
// ==========================================

export default Footer;