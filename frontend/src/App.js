import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { PresentationProvider } from './context/PresentationContext';
import { GlobalStyle } from './styles/GlobalStyle';
import Dashboard from './pages/Dashboard';
import PresentationEditor from './pages/PresentationEditor';
import PresentationViewer from './pages/PresentationViewer';
import NotFound from './pages/NotFound';

function App() {
  return (
    <PresentationProvider>
      <GlobalStyle />
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/presentation/:id/edit" element={<PresentationEditor />} />
            <Route path="/presentation/:id/view" element={<PresentationViewer />} />
            <Route path="/presentation/:id/present" element={<PresentationViewer fullscreen />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </PresentationProvider>
  );
}

export default App; 