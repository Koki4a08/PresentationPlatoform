import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.error || error.message || 'An error occurred';
    console.error('API Error:', message);
    return Promise.reject(new Error(message));
  }
);

// Presentation API calls
export const getPresentations = async (params = {}) => {
  const searchParams = new URLSearchParams();
  
  if (params.search) searchParams.append('search', params.search);
  if (params.page) searchParams.append('page', params.page);
  if (params.limit) searchParams.append('limit', params.limit);
  
  const queryString = searchParams.toString();
  const url = queryString ? `/presentations?${queryString}` : '/presentations';
  
  return await api.get(url);
};

export const getPresentation = async (id) => {
  return await api.get(`/presentations/${id}`);
};

export const createPresentation = async (presentationData) => {
  return await api.post('/presentations', presentationData);
};

export const updatePresentation = async (id, updateData) => {
  return await api.put(`/presentations/${id}`, updateData);
};

export const deletePresentation = async (id) => {
  return await api.delete(`/presentations/${id}`);
};

export const duplicatePresentation = async (id) => {
  return await api.post(`/presentations/${id}/duplicate`);
};

// Slide API calls
export const getSlidesByPresentation = async (presentationId) => {
  return await api.get(`/slides/presentation/${presentationId}`);
};

export const getSlide = async (id) => {
  return await api.get(`/slides/${id}`);
};

export const createSlide = async (slideData) => {
  return await api.post('/slides', slideData);
};

export const updateSlide = async (id, updateData) => {
  return await api.put(`/slides/${id}`, updateData);
};

export const deleteSlide = async (id) => {
  return await api.delete(`/slides/${id}`);
};

export const reorderSlide = async (id, newOrder) => {
  return await api.put(`/slides/${id}/reorder`, { newOrder });
};

export const duplicateSlide = async (id) => {
  return await api.post(`/slides/${id}/duplicate`);
};

// Health check
export const healthCheck = async () => {
  return await api.get('/health');
};

// Presentation API object (for Editor/Viewer components)
export const presentationAPI = {
  getById: getPresentation,
  getSlides: getSlidesByPresentation,
  createSlide: (presentationId, slideData) => 
    createSlide({ ...slideData, presentationId }),
  updateSlide: (presentationId, slideId, updateData) => 
    updateSlide(slideId, updateData),
};

export default api; 