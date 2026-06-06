import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu, ChevronDown, ChevronRight, PanelLeftClose,
  Activity, HeartPulse, GitBranch, Stethoscope,
} from 'lucide-react';
import { useSidebar } from '../context/SidebarContext';

const MobileToggleBtn = styled.button`
  display: none;
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 999;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px;
  color: #1e293b;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  cursor: pointer;

  @media (max-width: 1024px) {
    display: ${props => (props.$sidebarOpen ? 'none' : 'flex')};
    align-items: center;
    justify-content: center;
  }
`;

const Overlay = styled.div`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(4px);
  z-index: 1000;
  opacity: ${props => (props.isOpen ? 1 : 0)};
  pointer-events: ${props => (props.isOpen ? 'auto' : 'none')};
  transition: opacity 0.3s ease;

  @media (max-width: 1024px) {
    display: block;
  }
`;

const SidebarWrapper = styled.aside`
  width: 280px;
  height: 100vh;
  background: #ffffff;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1001;
  transition: transform 0.3s ease-in-out;
  transform: translateX(${props => (props.$isOpen ? '0' : '-100%')});
  box-shadow: ${props => (props.$isOpen ? '10px 0 25px rgba(0,0,0,0.05)' : 'none')};
`;

const SidebarHeader = styled.div`
  height: 80px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #f1f5f9;
`;

const LogoText = styled(Link)`
  font-size: 1.5rem;
  font-weight: 800;
  color: #166534;
  text-decoration: none;
  letter-spacing: -0.5px;
`;

const CloseBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 4px;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: #f1f5f9;
    color: #166534;
  }
`;

const NavContent = styled.nav`
  flex: 1;
  overflow-y: auto;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
`;

const NavSectionTitle = styled.h4`
  font-size: 0.75rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 16px 0 8px 8px;
`;

const NavItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-radius: 12px;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s ease;
  background: ${props => (props.isActive ? '#dcfce7' : 'transparent')};
  color: ${props => (props.isActive ? '#166534' : '#475569')};
  font-weight: ${props => (props.isActive ? '700' : '500')};

  &:hover {
    background: ${props => (props.isActive ? '#dcfce7' : '#f8fafc')};
    color: ${props => (props.isActive ? '#166534' : '#0f172a')};
  }
`;

const NavItemLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const SubPageList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 4px;
  margin-left: 20px;
  padding-left: 16px;
  border-left: 1px solid #e2e8f0;
  overflow: hidden;
  max-height: ${props => (props.isOpen ? '800px' : '0')};
  opacity: ${props => (props.isOpen ? '1' : '0')};
  transition: max-height 0.3s ease, opacity 0.3s ease;
`;

const SubPageItem = styled(Link)`
  padding: 10px 16px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  background: ${props => (props.isActive ? '#f0fdf4' : 'transparent')};
  color: ${props => (props.isActive ? '#22c55e' : '#64748b')};
  font-weight: ${props => (props.isActive ? '600' : '500')};
  border-left: 3px solid ${props => (props.isActive ? '#22c55e' : 'transparent')};

  &:hover {
    color: ${props => (props.isActive ? '#22c55e' : '#1e293b')};
    background: #f8fafc;
  }
`;

const presentationData = [
  {
    section: 'Clinical Foundations',
    items: [
      { id: 'triage', title: 'What is Triage?', icon: Stethoscope, path: '/dashboard' },
      { id: 'pathways', title: 'Colour → Departments', icon: Activity, path: '/dashboard/pathways' },
    ],
  },
  {
    section: 'The Pipeline',
    items: [
      {
        id: 'pipeline',
        title: 'Input Pipeline',
        icon: GitBranch,
        subPages: [
          { id: 'input', title: '1. Patient Input', path: '/dashboard/pipeline/input' },
          { id: 'text', title: '2. Text Example', path: '/dashboard/pipeline/text-example' },
          { id: 'voice', title: '3. Speech & Translate', path: '/dashboard/pipeline/voice' },
          { id: 'biobert', title: '4. Fine-Tuned BioBERT', path: '/dashboard/pipeline/biobert' },
          { id: 'bb-infer', title: '↳ BioBERT Internals', path: '/dashboard/math/biobert-inference' },
          { id: 'bb-train', title: '↳ BioBERT Training', path: '/dashboard/math/biobert-training' },
          { id: 'data', title: '↳ Data & Findings', path: '/dashboard/math/data-exploration' },
          { id: 'fusion-p', title: '5. Fusion → Colour', path: '/dashboard/pipeline/fusion' },
          { id: 'tews', title: '↳ TEWS (vitals)', path: '/dashboard/pipeline/tews' },
          { id: 'tews-math', title: '↳ TEWS Mathematics', path: '/dashboard/math/tews' },
          { id: 'bayes-fb', title: '↳ Bayesian Fallback', path: '/dashboard/pipeline/bayesian-fallback' },
          { id: 'bayes', title: '↳ Bayesian Mathematics', path: '/dashboard/math/bayesian' },
          { id: 'fusion-m', title: '↳ Fusion Mathematics', path: '/dashboard/math/fusion' },
          { id: 'worked', title: '↳ Worked Example', path: '/dashboard/math/worked-example' },
        ],
      },
    ],
  },
  {
    section: 'Clinical Pathways',
    items: [
      {
        id: 'protocols',
        title: 'Color Protocols',
        icon: HeartPulse,
        subPages: [
          { id: 'resus', title: 'Resuscitation (Red)', path: '/dashboard/pathways/resus' },
        ],
      },
    ],
  },
];

const Sidebar = () => {
  const { isOpen, open, close, toggle } = useSidebar();
  const [openAccordions, setOpenAccordions] = useState({ pipeline: true, math: true, protocols: true });
  const location = useLocation();

  const toggleAccordion = (id) => {
    setOpenAccordions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleNavClick = () => {
    if (window.matchMedia('(max-width: 1024px)').matches) {
      close();
    }
  };

  const isParentActive = (item) => {
    if (item.path && location.pathname === item.path) return true;
    if (item.subPages) {
      return item.subPages.some(sub => location.pathname === sub.path);
    }
    return false;
  };

  return (
    <>
      <MobileToggleBtn $sidebarOpen={isOpen} onClick={open} aria-label="Open menu">
        <Menu size={24} />
      </MobileToggleBtn>

      <Overlay isOpen={isOpen} onClick={handleNavClick} />

      <SidebarWrapper $isOpen={isOpen}>
        <SidebarHeader>
          <LogoText to="/">curatio</LogoText>
          <CloseBtn
            type="button"
            onClick={toggle}
            title="Close sidebar"
            aria-label="Close sidebar"
          >
            <PanelLeftClose size={22} />
          </CloseBtn>
        </SidebarHeader>

        <NavContent>
          {presentationData.map((section, idx) => (
            <div key={idx}>
              <NavSectionTitle>{section.section}</NavSectionTitle>

              {section.items.map((item) => {
                const Icon = item.icon;
                const hasSubPages = !!item.subPages;
                const active = isParentActive(item);
                const isAccordionOpen = openAccordions[item.id];

                return (
                  <NavItemWrapper key={item.id}>
                    {hasSubPages ? (
                      <NavItem as="div" isActive={active} onClick={() => toggleAccordion(item.id)}>
                        <NavItemLeft>
                          <Icon size={18} strokeWidth={active ? 2.5 : 2} />
                          {item.title}
                        </NavItemLeft>
                        {isAccordionOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </NavItem>
                    ) : (
                      <NavItem
                        as={Link}
                        to={item.path}
                        isActive={active}
                        onClick={handleNavClick}
                      >
                        <NavItemLeft>
                          <Icon size={18} strokeWidth={active ? 2.5 : 2} />
                          {item.title}
                        </NavItemLeft>
                      </NavItem>
                    )}

                    {hasSubPages && (
                      <SubPageList isOpen={isAccordionOpen}>
                        {item.subPages.map((sub) => (
                          <SubPageItem
                            key={sub.id}
                            to={sub.path}
                            isActive={location.pathname === sub.path}
                            onClick={handleNavClick}
                          >
                            {sub.title}
                          </SubPageItem>
                        ))}
                      </SubPageList>
                    )}
                  </NavItemWrapper>
                );
              })}
            </div>
          ))}
        </NavContent>
      </SidebarWrapper>
    </>
  );
};

export default Sidebar;
