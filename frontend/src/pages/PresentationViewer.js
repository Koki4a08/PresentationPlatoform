import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { presentationAPI } from '../services/api';
import { parseMarkdown } from '../utils/markdownParser';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const ViewerContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: ${props => props.theme.background};
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: ${props => props.theme.cardBackground};
  border-bottom: 1px solid ${props => props.theme.border};
  position: relative;
  z-index: 100;
`;

const Title = styled.h1`
  color: ${props => props.theme.text};
  margin: 0;
  font-size: 1.5rem;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  
  &.primary {
    background: ${props => props.theme.primary};
    color: white;
    
    &:hover {
      background: ${props => props.theme.primaryHover};
    }
  }
  
  &.secondary {
    background: transparent;
    color: ${props => props.theme.text};
    border: 1px solid ${props => props.theme.border};
    
    &:hover {
      background: ${props => props.theme.hover};
    }
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SlideCounter = styled.span`
  color: ${props => props.theme.textMuted};
  font-size: 0.9rem;
`;

const SlideContainer = styled.main`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
`;

const Slide = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 3rem;
  max-width: 900px;
  width: 100%;
  min-height: 500px;
  position: relative;
  overflow: auto;
  
  h1, h2, h3, h4, h5, h6 {
    color: #333;
    margin-top: 0;
  }
  
  h1 {
    font-size: 2.5rem;
    margin-bottom: 1.5rem;
    text-align: center;
  }
  
  h2 {
    font-size: 2rem;
    margin-bottom: 1.25rem;
  }
  
  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  
  p {
    font-size: 1.25rem;
    line-height: 1.6;
    margin-bottom: 1rem;
  }
  
  ul, ol {
    font-size: 1.25rem;
    line-height: 1.6;
    margin-bottom: 1rem;
    padding-left: 2rem;
  }
  
  li {
    margin-bottom: 0.5rem;
  }
  
  code {
    background: #f5f5f5;
    padding: 0.2rem 0.4rem;
    border-radius: 3px;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  }
  
  pre {
    background: #f5f5f5;
    padding: 1rem;
    border-radius: 4px;
    overflow-x: auto;
    margin: 1rem 0;
  }
  
  blockquote {
    border-left: 4px solid ${props => props.theme.primary};
    margin: 1rem 0;
    padding-left: 1rem;
    font-style: italic;
    color: #666;
  }
`;

const ProgressBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: rgba(0, 0, 0, 0.1);
`;

const Progress = styled.div`
  height: 100%;
  background: ${props => props.theme.primary};
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`;

const Navigation = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  
  &.prev {
    left: 2rem;
  }
  
  &.next {
    right: 2rem;
  }
`;

const NavButton = styled.button`
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  cursor: pointer;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }
  
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const PresentationViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [presentation, setPresentation] = useState(null);
  const [slides, setSlides] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [presentationResponse, slidesResponse] = await Promise.all([
          presentationAPI.getById(id),
          presentationAPI.getSlides(id)
        ]);
        
        setPresentation(presentationResponse.data);
        setSlides(slidesResponse.data.sort((a, b) => a.order - b.order));
      } catch (error) {
        console.error('Error fetching presentation:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const nextSlide = useCallback(() => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  }, [currentSlideIndex, slides.length]);

  const prevSlide = useCallback(() => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  }, [currentSlideIndex]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      switch (event.key) {
        case 'ArrowRight':
        case ' ':
          event.preventDefault();
          nextSlide();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          prevSlide();
          break;
        case 'Escape':
          navigate('/dashboard');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [nextSlide, prevSlide, navigate]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!presentation || slides.length === 0) {
    return (
      <ViewerContainer>
        <Header>
          <Title>Presentation not found</Title>
          <Button className="secondary" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </Header>
      </ViewerContainer>
    );
  }

  const currentSlide = slides[currentSlideIndex];
  const progress = ((currentSlideIndex + 1) / slides.length) * 100;

  return (
    <ViewerContainer>
      <Header>
        <Title>{presentation.title}</Title>
        <Controls>
          <SlideCounter>
            {currentSlideIndex + 1} / {slides.length}
          </SlideCounter>
          <Button
            className="secondary"
            onClick={prevSlide}
            disabled={currentSlideIndex === 0}
          >
            Previous
          </Button>
          <Button
            className="secondary"
            onClick={nextSlide}
            disabled={currentSlideIndex === slides.length - 1}
          >
            Next
          </Button>
          <Button 
            className="primary" 
            onClick={() => navigate(`/editor/${id}`)}
          >
            Edit
          </Button>
          <Button 
            className="secondary" 
            onClick={() => navigate('/dashboard')}
          >
            Exit
          </Button>
        </Controls>
      </Header>
      
      <SlideContainer>
        <Navigation className="prev">
          <NavButton
            onClick={prevSlide}
            disabled={currentSlideIndex === 0}
          >
            ‹
          </NavButton>
        </Navigation>
        
        <Slide>
          {currentSlide?.content ? (
            parseMarkdown(currentSlide.content)
          ) : (
            <div style={{ textAlign: 'center', color: '#666' }}>
              <h1>Empty Slide</h1>
              <p>This slide has no content yet.</p>
            </div>
          )}
        </Slide>
        
        <Navigation className="next">
          <NavButton
            onClick={nextSlide}
            disabled={currentSlideIndex === slides.length - 1}
          >
            ›
          </NavButton>
        </Navigation>
      </SlideContainer>
      
      <ProgressBar>
        <Progress progress={progress} />
      </ProgressBar>
    </ViewerContainer>
  );
};

export default PresentationViewer; 