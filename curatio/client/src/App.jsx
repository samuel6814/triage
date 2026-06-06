import React from "react";
import styled from "styled-components";
import { Outlet } from "react-router-dom";

const Container = styled.div`
  /* Apply the new premium font globally */
  font-family: 'Plus Jakarta Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  
  height: 100vh;
  scroll-snap-type: y mandatory;
  scrollbar-width: none;
  color: #1a1a2e; /* Changed from white since your app has a light theme */
  &::-webkit-scrollbar {
    display: none;
  }
`;

const App = () => {
  return (
    <Container>
      <Outlet />
    </Container>
  );
};

export default App;