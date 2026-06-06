import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// KaTeX CSS for medical formulas
import 'katex/dist/katex.min.css';
import './styles/katex-overrides.css';

// Root App Container
import App from './App';

// Layouts & Pages
import HomeLayout from './pages/home/HomeLayout';
import Explore from './pages/home/Explore';
import DashboardLayout from './pages/dashboard-presentation/DashboardLayout';
import TriageTestPage from './pages/test/TriageTestPage';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Parent Route: App wraps everything */}
        <Route path="/" element={<App />}>
          
          {/* Index Route: Loads the main landing page */}
          <Route index element={<HomeLayout />} />
          
          {/* Explore Page */}
          <Route path="explore" element={<Explore />} />
          
          {/* Dashboard Presentation Route 
              The /* wildcard allows sub-routes (like /dashboard/ai-logic) 
              to still load this layout.
          */}
          <Route path="dashboard/*" element={<DashboardLayout />} />

          <Route path="test" element={<TriageTestPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);