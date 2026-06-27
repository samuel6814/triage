import React from 'react';
import styled from 'styled-components';
import { Link, Outlet } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Shell = styled.div`
  min-height: 100vh;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(165deg, #f0fdf4 0%, #f4f7f5 45%, #ecfdf5 100%);
  font-family: 'Plus Jakarta Sans', sans-serif;
  overflow: hidden;
`;

const TopBar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  flex-shrink: 0;
`;

const Brand = styled(Link)`
  font-size: 1.15rem;
  font-weight: 800;
  color: #166534;
  text-decoration: none;
  letter-spacing: -0.02em;
`;

const HomeLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 999px;
  border: 1px solid #bbf7d0;
  background: rgba(255, 255, 255, 0.85);
  color: #166534;
  font-size: 0.85rem;
  font-weight: 600;
  text-decoration: none;

  &:hover {
    background: #ffffff;
    box-shadow: 0 2px 8px rgba(22, 101, 52, 0.1);
  }
`;

const Main = styled.main`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding: 0 0.75rem 0.4rem;
`;

const VisualExplainerLayout = () => (
  <Shell>
    <TopBar>
      <Brand to="/">Curatio</Brand>
      <HomeLink to="/">
        <ArrowLeft size={16} />
        Back home
      </HomeLink>
    </TopBar>
    <Main>
      <Outlet />
    </Main>
  </Shell>
);

export default VisualExplainerLayout;
