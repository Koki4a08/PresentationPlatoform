import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { PresentationContext } from '../context/PresentationContext';
import { presentationAPI } from '../services/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const EditorContainer = styled.div`
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
`;

const Title = styled.h1`
  color: ${props => props.theme.text};
  margin: 0;
  font-size: 1.5rem;
`;

const ButtonGroup = styled.div`
  display: flex;
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
`;

const EditorMain = styled.main`
  flex: 1;
  display: flex;
  overflow: hidden;
`;

const SlideList = styled.aside`
  width: 300px;
  background: ${props => props.theme.sidebarBackground};
  border-right: 1px solid ${props => props.theme.border};
  overflow-y: auto;
`;

const EditArea = styled.section`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const SlidePreview = styled.div`
  height: 200px;
  background: white;
  border-bottom: 1px solid ${props => props.theme.border};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.textMuted};
`;

const SlideEditor = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1rem;
`;

const TextArea = styled.textarea`
  flex: 1;
  padding: 1rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 4px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.5;
  resize: none;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const PresentationEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useContext(PresentationContext);
  const [presentation, setPresentation] = useState(null);
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(null);
  const [slideContent, setSlideContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [presentationResponse, slidesResponse] = await Promise.all([
          presentationAPI.getById(id),
          presentationAPI.getSlides(id)
        ]);
        
        setPresentation(presentationResponse.data);
        setSlides(slidesResponse.data);
        
        if (slidesResponse.data.length > 0) {
          setCurrentSlide(slidesResponse.data[0]);
          setSlideContent(slidesResponse.data[0].content || '');
        }
      } catch (error) {
        console.error('Error fetching presentation:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSave = async () => {
    if (!currentSlide) return;
    
    try {
      setSaving(true);
      await presentationAPI.updateSlide(id, currentSlide.id, {
        content: slideContent
      });
      
      // Update local state
      setSlides(slides.map(slide => 
        slide.id === currentSlide.id 
          ? { ...slide, content: slideContent }
          : slide
      ));
      
      dispatch({
        type: 'SET_MESSAGE',
        payload: { text: 'Slide saved successfully', type: 'success' }
      });
    } catch (error) {
      console.error('Error saving slide:', error);
      dispatch({
        type: 'SET_MESSAGE',
        payload: { text: 'Error saving slide', type: 'error' }
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAddSlide = async () => {
    try {
      const response = await presentationAPI.createSlide(id, {
        content: '# New Slide\n\nAdd your content here...',
        layout: 'default',
        order: slides.length
      });
      
      const newSlide = response.data;
      setSlides([...slides, newSlide]);
      setCurrentSlide(newSlide);
      setSlideContent(newSlide.content);
    } catch (error) {
      console.error('Error creating slide:', error);
    }
  };

  const handleSlideSelect = (slide) => {
    setCurrentSlide(slide);
    setSlideContent(slide.content || '');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!presentation) {
    return <div>Presentation not found</div>;
  }

  return (
    <EditorContainer>
      <Header>
        <Title>{presentation.title}</Title>
        <ButtonGroup>
          <Button 
            className="secondary" 
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </Button>
          <Button 
            className="primary" 
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save'}
          </Button>
          <Button 
            className="primary" 
            onClick={() => navigate(`/viewer/${id}`)}
          >
            Preview
          </Button>
        </ButtonGroup>
      </Header>
      
      <EditorMain>
        <SlideList>
          <div style={{ padding: '1rem' }}>
            <Button className="primary" onClick={handleAddSlide}>
              Add Slide
            </Button>
          </div>
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              onClick={() => handleSlideSelect(slide)}
              style={{
                padding: '0.5rem 1rem',
                cursor: 'pointer',
                background: currentSlide?.id === slide.id ? '#e3f2fd' : 'transparent',
                borderBottom: '1px solid #eee'
              }}
            >
              Slide {index + 1}
            </div>
          ))}
        </SlideList>
        
        <EditArea>
          <SlidePreview>
            Slide Preview Area
          </SlidePreview>
          
          <SlideEditor>
            <h3>Edit Slide Content (Markdown)</h3>
            <TextArea
              value={slideContent}
              onChange={(e) => setSlideContent(e.target.value)}
              placeholder="Enter your slide content in Markdown format..."
            />
          </SlideEditor>
        </EditArea>
      </EditorMain>
    </EditorContainer>
  );
};

export default PresentationEditor; 