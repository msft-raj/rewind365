import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChannelPicker from '../components/ChannelPicker';
import FolderPicker from '../components/FolderPicker';
import Loader from '../components/Loader';
import { apiService, TeamChannel, OutlookFolder } from '../services/api';
import { teamsContext } from '../services/teamsContext';

interface ConfigPageProps {
  onConfigComplete: () => void;
}

const ConfigPage: React.FC<ConfigPageProps> = ({ onConfigComplete }) => {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [channels, setChannels] = useState<TeamChannel[]>([]);
  const [folders, setFolders] = useState<OutlookFolder[]>([]);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [selectedFolders, setSelectedFolders] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializePage();
  }, []);

  const initializePage = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Initialize Teams context
      await teamsContext.initialize();
      
      // Load available channels and folders
      const [channelsData, foldersData] = await Promise.all([
        apiService.getTeamsChannels(),
        apiService.getOutlookFolders(),
      ]);
      
      setChannels(channelsData);
      setFolders(foldersData);
      
      // Check if user already has preferences
      const existingPreferences = await apiService.getPreferences();
      if (existingPreferences) {
        setSelectedChannels(existingPreferences.selectedChannels);
        setSelectedFolders(existingPreferences.selectedFolders);
      }
      
    } catch (err) {
      console.error('Failed to initialize config page:', err);
      setError('Failed to load configuration options. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePreferences = async () => {
    if (selectedChannels.length === 0 && selectedFolders.length === 0) {
      setError('Please select at least one channel or folder to monitor.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await apiService.savePreferences({
        selectedChannels,
        selectedFolders,
      });
      
      onConfigComplete();
      navigate('/home');
    } catch (err) {
      console.error('Failed to save preferences:', err);
      setError('Failed to save preferences. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSkipToDemo = () => {
    // For demo purposes, set some default selections
    const defaultChannels = channels.slice(0, 2).map(c => c.id);
    const defaultFolders = folders.slice(0, 2).map(f => f.id);
    
    setSelectedChannels(defaultChannels);
    setSelectedFolders(defaultFolders);
    
    // Save and proceed
    apiService.savePreferences({
      selectedChannels: defaultChannels,
      selectedFolders: defaultFolders,
    }).then(() => {
      onConfigComplete();
      navigate('/home');
    }).catch(console.error);
  };

  if (loading) {
    return <Loader message="Loading your Teams and Outlook data..." />;
  }

  return (
    <div>
      <div className="page-header">
        <h1>Welcome to Rewind365!</h1>
        <p>Let's set up your personalized digest by selecting the Teams channels and Outlook folders you want to monitor.</p>
      </div>

      {error && (
        <div className="card" style={{ backgroundColor: '#fed9cc', borderColor: '#d13438', color: '#d13438' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="card">
        <ChannelPicker
          channels={channels}
          selectedChannels={selectedChannels}
          onSelectionChange={setSelectedChannels}
        />
      </div>

      <div className="card">
        <FolderPicker
          folders={folders}
          selectedFolders={selectedFolders}
          onSelectionChange={setSelectedFolders}
        />
      </div>

      <div className="nav-buttons">
        <button 
          className="button"
          onClick={handleSavePreferences}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Preferences'}
        </button>
        
        <button 
          className="button button-secondary"
          onClick={handleSkipToDemo}
          disabled={saving}
        >
          Skip to Demo
        </button>
        
        <button 
          className="button button-secondary"
          onClick={() => navigate('/about')}
          disabled={saving}
        >
          Learn More
        </button>
      </div>

      <div style={{ marginTop: '24px', textAlign: 'center', color: '#605e5c', fontSize: '14px' }}>
        <p>You can change these preferences anytime by returning to this configuration page.</p>
        <p>Selected: {selectedChannels.length} channels, {selectedFolders.length} folders</p>
      </div>
    </div>
  );
};

export default ConfigPage;