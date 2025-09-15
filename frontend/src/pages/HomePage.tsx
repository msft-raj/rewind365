import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DigestView from '../components/DigestView';
import Loader from '../components/Loader';
import { apiService, DailyDigest } from '../services/api';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [digest, setDigest] = useState<DailyDigest | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  useEffect(() => {
    loadDigest();
  }, []);

  const loadDigest = async () => {
    setLoading(true);
    setError(null);

    try {
      const digestData = await apiService.getDailyDigest();
      setDigest(digestData);
      setLastRefresh(new Date());
    } catch (err) {
      console.error('Failed to load digest:', err);
      setError('Failed to load your daily digest. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadDigest();
  };

  const formatLastRefresh = (): string => {
    return lastRefresh.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <Loader message="Loading your daily digest..." />;
  }

  if (error) {
    return (
      <div>
        <div className="page-header">
          <h1>Daily Digest</h1>
          <p>Your personalized summary of Teams and Outlook activity</p>
        </div>
        
        <div className="card" style={{ backgroundColor: '#fed9cc', borderColor: '#d13438', color: '#d13438' }}>
          <strong>Error:</strong> {error}
        </div>
        
        <div className="nav-buttons">
          <button className="button" onClick={handleRefresh}>
            Try Again
          </button>
          <button className="button button-secondary" onClick={() => navigate('/config')}>
            Update Preferences
          </button>
        </div>
      </div>
    );
  }

  if (!digest) {
    return (
      <div>
        <div className="page-header">
          <h1>Daily Digest</h1>
          <p>Your personalized summary of Teams and Outlook activity</p>
        </div>
        
        <div className="empty-state">
          <h3>No digest available</h3>
          <p>Unable to load your daily digest. Please check your preferences or try again later.</p>
          
          <div className="nav-buttons">
            <button className="button" onClick={handleRefresh}>
              Refresh
            </button>
            <button className="button button-secondary" onClick={() => navigate('/config')}>
              Update Preferences
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1>Daily Digest</h1>
        <p>{formatDate(digest.date)} • Last updated: {formatLastRefresh()}</p>
      </div>

      <DigestView digestData={digest} />
      
      <div className="nav-buttons">
        <button className="button" onClick={handleRefresh}>
          🔄 Refresh
        </button>
        <button className="button button-secondary" onClick={() => navigate('/config')}>
          ⚙️ Settings
        </button>
        <button className="button button-secondary" onClick={() => navigate('/about')}>
          ℹ️ About
        </button>
      </div>
      
      <div style={{ 
        marginTop: '32px', 
        textAlign: 'center', 
        color: '#a19f9d', 
        fontSize: '12px',
        padding: '16px',
        borderTop: '1px solid #e1dfdd'
      }}>
        <p>Rewind365 • Keeping you informed and productive</p>
        <p>Digest automatically refreshes every hour during business hours</p>
      </div>
    </div>
  );
};

export default HomePage;