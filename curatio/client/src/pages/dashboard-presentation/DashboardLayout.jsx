import React from 'react';
import styled from 'styled-components';
import Sidebar from '../../components/Sidebar';
import PresentationPages from './PresentationPages';
import { SidebarProvider } from '../../context/SidebarContext';

const DashboardWrapper = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
  height: 100vh;
  overflow: hidden;
  background-color: #f4f7f5;
  font-family: 'Plus Jakarta Sans', sans-serif;
`;

const DashboardLayout = () => {
  return (
    <SidebarProvider>
      <DashboardWrapper>
        <Sidebar />
        <PresentationPages />
      </DashboardWrapper>
    </SidebarProvider>
  );
};

export default DashboardLayout;
