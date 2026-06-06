import React, { useState, useRef, useLayoutEffect } from 'react';
import styled from 'styled-components';
import { gsap } from 'gsap';
import { Search, ArrowRight, Activity, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

// ==========================================
// 1. STYLED COMPONENTS
// ==========================================

const ExploreWrapper = styled.div`
  min-height: 100vh;
  padding: 120px 8% 100px;
  background: #fafafc;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const HeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  color: #1a1a2e;
  margin-bottom: 1rem;
  letter-spacing: -1px;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #666;
  max-width: 600px;
  line-height: 1.6;
`;

const ControlsSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #e4e4e7;
  border-radius: 100px;
  padding: 0.5rem 1rem 0.5rem 1.5rem;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.03);
`;

const SearchInput = styled.input`
  border: none;
  outline: none;
  flex: 1;
  padding: 0.8rem;
  font-size: 1rem;
  color: #1a1a2e;
  background: transparent;

  &::placeholder {
    color: #a1a1aa;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const FilterPill = styled.button`
  padding: 8px 20px;
  border-radius: 100px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid ${props => props.active ? 'transparent' : '#e4e4e7'};
  background: ${props => props.active ? '#1a1a2e' : 'white'};
  color: ${props => props.active ? 'white' : '#64748b'};

  &:hover {
    background: ${props => props.active ? '#1a1a2e' : '#f4f4f5'};
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const PathwayCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 24px;
  border-left: 6px solid ${props => props.color};
  box-shadow: 0 10px 30px rgba(0,0,0,0.04);
  display: flex;
  flex-direction: column;
  gap: 16px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  will-change: transform, opacity;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 15px 35px rgba(0,0,0,0.08);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Badge = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 8px;
  background: ${props => props.bg};
  color: ${props => props.color};
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0;
`;

const CardDescription = styled.p`
  font-size: 0.95rem;
  color: #64748b;
  line-height: 1.5;
  margin: 0;
  flex: 1;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
`;

const TimeIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 500;
`;

const ActionArrow = styled.div`
  background: #f8fafc;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;

  ${PathwayCard}:hover & {
    background: #e2e8f0;
  }
`;

// ==========================================
// 2. COMPONENT LOGIC & DATA
// ==========================================

const mockPathways = [
  {
    id: 1,
    title: "Cardiac Arrest / Severe Trauma",
    description: "Immediate life-saving intervention required. Bypass standard queue.",
    category: "Resuscitation",
    color: "#ff4d4f",
    bg: "#ffeef0",
    icon: AlertTriangle,
    waitTime: "0 mins"
  },
  {
    id: 2,
    title: "Severe Chest Pain / Stroke",
    description: "High risk of deterioration. Requires rapid medical assessment.",
    category: "Emergent",
    color: "#faad14",
    bg: "#fffbe6",
    icon: Activity,
    waitTime: "< 15 mins"
  },
  {
    id: 3,
    title: "Moderate Asthma Attack",
    description: "Stable but uncomfortable. Requires timely intervention to prevent worsening.",
    category: "Urgent",
    color: "#1890ff",
    bg: "#e6f7ff",
    icon: Clock,
    waitTime: "< 30 mins"
  },
  {
    id: 4,
    title: "Minor Lacerations / Sprains",
    description: "Stable patients presenting with minor injuries or symptoms.",
    category: "Standard",
    color: "#52c41a",
    bg: "#f6ffed",
    icon: CheckCircle,
    waitTime: "60+ mins"
  },
  {
    id: 5,
    title: "Prescription Refill / Routine",
    description: "Non-urgent administrative or routine medical requests.",
    category: "Standard",
    color: "#52c41a",
    bg: "#f6ffed",
    icon: CheckCircle,
    waitTime: "120+ mins"
  },
  {
    id: 6,
    title: "Acute Abdominal Pain",
    description: "Severe localized pain requiring imaging and immediate labs.",
    category: "Emergent",
    color: "#faad14",
    bg: "#fffbe6",
    icon: Activity,
    waitTime: "< 15 mins"
  }
];

const categories = ["All", "Resuscitation", "Emergent", "Urgent", "Standard"];

const Explore = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const gridRef = useRef(null);

  // Filter logic
  const filteredPathways = mockPathways.filter(pathway => {
    const matchesSearch = pathway.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          pathway.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || pathway.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Re-run animation whenever the filtered results change
  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo('.pathway-card', 
        { y: 40, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.6, 
          stagger: 0.05, 
          ease: 'back.out(1.5)',
          clearProps: 'all' // cleans up inline styles after animation
        }
      );
    }, gridRef);

    return () => ctx.revert();
  }, [searchTerm, activeCategory]);

  return (
    <ExploreWrapper>
      <HeaderSection>
        <Title>Clinical Pathways</Title>
        <Subtitle>
          Browse and filter standard operating procedures based on triage severity. 
          Curatio dynamically assigns these protocols during patient intake.
        </Subtitle>
      </HeaderSection>

      <ControlsSection>
        <SearchContainer>
          <Search size={20} color="#a1a1aa" />
          <SearchInput 
            placeholder="Search conditions, symptoms, or protocols..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchContainer>

        <FilterGroup>
          {categories.map(cat => (
            <FilterPill 
              key={cat} 
              active={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </FilterPill>
          ))}
        </FilterGroup>
      </ControlsSection>

      <Grid ref={gridRef}>
        {filteredPathways.map(pathway => {
          const IconComponent = pathway.icon;
          return (
            <PathwayCard key={pathway.id} color={pathway.color} className="pathway-card">
              <CardHeader>
                <Badge bg={pathway.bg} color={pathway.color}>
                  <IconComponent size={14} />
                  {pathway.category}
                </Badge>
              </CardHeader>
              
              <CardTitle>{pathway.title}</CardTitle>
              <CardDescription>{pathway.description}</CardDescription>
              
              <CardFooter>
                <TimeIndicator>
                  <Clock size={14} />
                  Target Wait: {pathway.waitTime}
                </TimeIndicator>
                <ActionArrow>
                  <ArrowRight size={16} color="#1a1a2e" />
                </ActionArrow>
              </CardFooter>
            </PathwayCard>
          );
        })}
        
        {filteredPathways.length === 0 && (
          <div style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '3rem', color: '#a1a1aa' }}>
            No pathways found matching your criteria.
          </div>
        )}
      </Grid>
    </ExploreWrapper>
  );
};

// ==========================================
// 3. EXPORT
// ==========================================

export default Explore;