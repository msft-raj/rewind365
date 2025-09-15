import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { app } from '@microsoft/teams-js';
import ConfigPage from './pages/ConfigPage';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';

const App: React.FC = () => {
  const [teamsInitialized, setTeamsInitialized] = useState(false);
  const [hasPreferences, setHasPreferences] = useState(false);

  useEffect(() => {
    // Initialize Microsoft Teams SDK
    app.initialize().then(() => {
      setTeamsInitialized(true);
      // Check if user has saved preferences
      checkUserPreferences();
    }).catch((error) => {
      console.error('Failed to initialize Teams SDK:', error);
      // For local development, still allow the app to work
      setTeamsInitialized(true);
    });
  }, []);

  const checkUserPreferences = async () => {
    try {
      // This will be implemented to check if user has configured their preferences
      // For now, we'll default to false to show config page first
      setHasPreferences(false);
    } catch (error) {
      console.error('Failed to check user preferences:', error);
      setHasPreferences(false);
    }
  };

  if (!teamsInitialized) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Initializing Rewind365...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route 
            path="/" 
            element={hasPreferences ? <Navigate to="/home" /> : <Navigate to="/config" />} 
          />
          <Route path="/config" element={<ConfigPage onConfigComplete={() => setHasPreferences(true)} />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;