import React from 'react';
import { useNavigate } from 'react-router-dom';

const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="page-header">
        <h1>About Rewind365</h1>
        <p>Your AI-powered assistant for staying up to date with Teams and Outlook</p>
      </div>

      <div className="card">
        <h2>What is Rewind365?</h2>
        <p>
          Rewind365 is an intelligent digest app that helps you catch up on what you missed 
          across Microsoft Teams and Outlook. Instead of manually checking multiple channels 
          and folders, get a personalized AI-powered summary that highlights what matters most.
        </p>
      </div>

      <div className="card">
        <h2>How it works</h2>
        <div style={{ marginBottom: '16px' }}>
          <h3>1. 🎯 Configure Your Preferences</h3>
          <p>Select the Teams channels and Outlook folders you want to monitor. You're in control of what gets included in your digest.</p>
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <h3>2. 🤖 AI Analysis</h3>
          <p>Our AI analyzes conversations and emails from your selected sources, identifying urgent items, action requirements, and important information.</p>
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <h3>3. 📋 Personalized Digest</h3>
          <p>Receive a clean, organized summary categorized by priority: Urgent items first, then action-required items, followed by general information.</p>
        </div>
      </div>

      <div className="card">
        <h2>Key Features</h2>
        <ul style={{ paddingLeft: '24px', lineHeight: '1.8' }}>
          <li><strong>Smart Prioritization:</strong> AI identifies what needs immediate attention</li>
          <li><strong>Multi-Source Integration:</strong> Teams channels and Outlook folders in one view</li>
          <li><strong>Customizable Monitoring:</strong> Choose exactly what you want to track</li>
          <li><strong>Time-Aware Summaries:</strong> Focus on what happened while you were away</li>
          <li><strong>Teams Integration:</strong> Native app experience within Microsoft Teams</li>
          <li><strong>Privacy-First:</strong> Your data stays within your organization</li>
        </ul>
      </div>

      <div className="card">
        <h2>Priority Levels</h2>
        <div style={{ display: 'grid', gap: '16px', marginTop: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '24px' }}>🔥</span>
            <div>
              <strong>Urgent</strong>
              <p style={{ margin: 0, color: '#605e5c', fontSize: '14px' }}>Time-sensitive items requiring immediate attention</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '24px' }}>✅</span>
            <div>
              <strong>Action Required</strong>
              <p style={{ margin: 0, color: '#605e5c', fontSize: '14px' }}>Items that need your response or action</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '24px' }}>💬</span>
            <div>
              <strong>Information</strong>
              <p style={{ margin: 0, color: '#605e5c', fontSize: '14px' }}>Important updates and general information</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2>Privacy & Security</h2>
        <p>
          Rewind365 respects your privacy and follows Microsoft security standards:
        </p>
        <ul style={{ paddingLeft: '24px', lineHeight: '1.8' }}>
          <li>All data processing happens within your organization's Microsoft 365 environment</li>
          <li>No data is stored or transmitted outside your organization</li>
          <li>Uses Microsoft Graph API with proper authentication and permissions</li>
          <li>You control exactly which channels and folders are analyzed</li>
          <li>All access follows your organization's existing security policies</li>
        </ul>
      </div>

      <div className="card">
        <h2>Getting Started</h2>
        <p>
          Ready to get started? Configure your preferences to select which Teams channels 
          and Outlook folders you'd like to monitor. The AI will start analyzing your 
          selected sources and provide daily summaries to keep you informed and productive.
        </p>
      </div>

      <div className="nav-buttons">
        <button className="button" onClick={() => navigate('/config')}>
          Configure Preferences
        </button>
        <button className="button button-secondary" onClick={() => navigate('/home')}>
          View Digest
        </button>
        <button className="button button-secondary" onClick={() => navigate('/')}>
          Back to Home
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
        <p>Built for the Microsoft Teams Hackathon 2025</p>
        <p>Powered by AI • Designed for productivity</p>
      </div>
    </div>
  );
};

export default AboutPage;