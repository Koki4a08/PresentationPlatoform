import React, { createContext, useContext, useReducer, useCallback } from 'react';
import * as api from '../services/api';

export const PresentationContext = createContext();

const initialState = {
  presentations: [],
  currentPresentation: null,
  currentSlideIndex: 0,
  isLoading: false,
  error: null,
  searchQuery: '',
  isEditMode: false,
  selectedSlide: null
};

const presentationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    
    case 'SET_PRESENTATIONS':
      return { ...state, presentations: action.payload, isLoading: false };
    
    case 'SET_CURRENT_PRESENTATION':
      return { 
        ...state, 
        currentPresentation: action.payload, 
        currentSlideIndex: 0,
        isLoading: false 
      };
    
    case 'SET_CURRENT_SLIDE_INDEX':
      return { ...state, currentSlideIndex: action.payload };
    
    case 'ADD_PRESENTATION':
      return { 
        ...state, 
        presentations: [action.payload, ...state.presentations] 
      };
    
    case 'UPDATE_PRESENTATION':
      return {
        ...state,
        presentations: state.presentations.map(p => 
          p.id === action.payload.id ? action.payload : p
        ),
        currentPresentation: state.currentPresentation?.id === action.payload.id 
          ? action.payload 
          : state.currentPresentation
      };
    
    case 'DELETE_PRESENTATION':
      return {
        ...state,
        presentations: state.presentations.filter(p => p.id !== action.payload),
        currentPresentation: state.currentPresentation?.id === action.payload 
          ? null 
          : state.currentPresentation
      };
    
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    
    case 'SET_EDIT_MODE':
      return { ...state, isEditMode: action.payload };
    
    case 'SET_SELECTED_SLIDE':
      return { ...state, selectedSlide: action.payload };
    
    case 'UPDATE_SLIDE':
      if (!state.currentPresentation) return state;
      
      const updatedSlides = state.currentPresentation.slides.map(slide =>
        slide.id === action.payload.id ? action.payload : slide
      );
      
      return {
        ...state,
        currentPresentation: {
          ...state.currentPresentation,
          slides: updatedSlides
        }
      };
    
    case 'ADD_SLIDE':
      if (!state.currentPresentation) return state;
      
      return {
        ...state,
        currentPresentation: {
          ...state.currentPresentation,
          slides: [...state.currentPresentation.slides, action.payload]
        }
      };
    
    case 'DELETE_SLIDE':
      if (!state.currentPresentation) return state;
      
      const filteredSlides = state.currentPresentation.slides.filter(
        slide => slide.id !== action.payload
      );
      
      return {
        ...state,
        currentPresentation: {
          ...state.currentPresentation,
          slides: filteredSlides
        },
        currentSlideIndex: Math.min(state.currentSlideIndex, filteredSlides.length - 1)
      };
    
    case 'REORDER_SLIDES':
      if (!state.currentPresentation) return state;
      
      return {
        ...state,
        currentPresentation: {
          ...state.currentPresentation,
          slides: action.payload
        }
      };
    
    default:
      return state;
  }
};

export const PresentationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(presentationReducer, initialState);

  // Action creators
  const setLoading = useCallback((loading) => dispatch({ type: 'SET_LOADING', payload: loading }), []);
  
  const setError = useCallback((error) => dispatch({ type: 'SET_ERROR', payload: error }), []);
  
  const clearError = useCallback(() => dispatch({ type: 'SET_ERROR', payload: null }), []);
  
  const fetchPresentations = useCallback(async (searchQuery = '') => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const data = await api.getPresentations({ search: searchQuery });
      dispatch({ type: 'SET_PRESENTATIONS', payload: data.presentations });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }, []);

  const actions = {
    setLoading,
    setError,
    clearError,
    fetchPresentations,
    
    fetchPresentation: async (id) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const presentation = await api.getPresentation(id);
        dispatch({ type: 'SET_CURRENT_PRESENTATION', payload: presentation });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
      }
    },
    
    createPresentation: async (presentationData) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const newPresentation = await api.createPresentation(presentationData);
        dispatch({ type: 'ADD_PRESENTATION', payload: newPresentation });
        return newPresentation;
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        throw error;
      }
    },
    
    updatePresentation: async (id, updateData) => {
      try {
        const updatedPresentation = await api.updatePresentation(id, updateData);
        dispatch({ type: 'UPDATE_PRESENTATION', payload: updatedPresentation });
        return updatedPresentation;
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        throw error;
      }
    },
    
    deletePresentation: async (id) => {
      try {
        await api.deletePresentation(id);
        dispatch({ type: 'DELETE_PRESENTATION', payload: id });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        throw error;
      }
    },
    
    duplicatePresentation: async (id) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const duplicatedPresentation = await api.duplicatePresentation(id);
        dispatch({ type: 'ADD_PRESENTATION', payload: duplicatedPresentation });
        return duplicatedPresentation;
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        throw error;
      }
    },
    
    setCurrentSlideIndex: (index) => {
      dispatch({ type: 'SET_CURRENT_SLIDE_INDEX', payload: index });
    },
    
    nextSlide: () => {
      const { currentPresentation, currentSlideIndex } = state;
      if (currentPresentation && currentSlideIndex < currentPresentation.slides.length - 1) {
        dispatch({ type: 'SET_CURRENT_SLIDE_INDEX', payload: currentSlideIndex + 1 });
      }
    },
    
    previousSlide: () => {
      const { currentSlideIndex } = state;
      if (currentSlideIndex > 0) {
        dispatch({ type: 'SET_CURRENT_SLIDE_INDEX', payload: currentSlideIndex - 1 });
      }
    },
    
    setSearchQuery: (query) => {
      dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
    },
    
    setEditMode: (editMode) => {
      dispatch({ type: 'SET_EDIT_MODE', payload: editMode });
    },
    
    setSelectedSlide: (slide) => {
      dispatch({ type: 'SET_SELECTED_SLIDE', payload: slide });
    },
    
    // Slide actions
    createSlide: async (slideData) => {
      try {
        const newSlide = await api.createSlide(slideData);
        dispatch({ type: 'ADD_SLIDE', payload: newSlide });
        return newSlide;
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        throw error;
      }
    },
    
    updateSlide: async (id, updateData) => {
      try {
        const updatedSlide = await api.updateSlide(id, updateData);
        dispatch({ type: 'UPDATE_SLIDE', payload: updatedSlide });
        return updatedSlide;
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        throw error;
      }
    },
    
    deleteSlide: async (id) => {
      try {
        await api.deleteSlide(id);
        dispatch({ type: 'DELETE_SLIDE', payload: id });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        throw error;
      }
    },
    
    reorderSlides: async (slides) => {
      try {
        dispatch({ type: 'REORDER_SLIDES', payload: slides });
        // Note: API call for reordering would be implemented here
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
        throw error;
      }
    }
  };

  const value = {
    ...state,
    ...actions
  };

  return (
    <PresentationContext.Provider value={value}>
      {children}
    </PresentationContext.Provider>
  );
};

export const usePresentation = () => {
  const context = useContext(PresentationContext);
  if (!context) {
    throw new Error('usePresentation must be used within a PresentationProvider');
  }
  return context;
}; 