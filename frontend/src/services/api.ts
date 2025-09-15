import axios from 'axios';

// Base API configuration
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types
export interface TeamChannel {
  id: string;
  name: string;
  teamName: string;
  teamId: string;
}

export interface OutlookFolder {
  id: string;
  name: string;
  parentFolderName?: string;
}

export interface UserPreferences {
  selectedChannels: string[];
  selectedFolders: string[];
}

export interface DigestItem {
  id: string;
  title: string;
  summary: string;
  source: 'teams' | 'outlook';
  sourceDetails: string;
  priority: 'urgent' | 'action' | 'info';
  timestamp: string;
  url?: string;
}

export interface DailyDigest {
  date: string;
  items: DigestItem[];
  summary: {
    totalItems: number;
    urgentCount: number;
    actionCount: number;
    infoCount: number;
  };
}

// API Functions
export const apiService = {
  // Get available Teams channels
  async getTeamsChannels(): Promise<TeamChannel[]> {
    try {
      const response = await api.get('/api/teams/channels');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch Teams channels:', error);
      // Return mock data for local development
      return [
        { id: '1', name: 'General', teamName: 'Marketing Team', teamId: 'team1' },
        { id: '2', name: 'Announcements', teamName: 'Marketing Team', teamId: 'team1' },
        { id: '3', name: 'Development', teamName: 'Engineering Team', teamId: 'team2' },
        { id: '4', name: 'Stand-ups', teamName: 'Engineering Team', teamId: 'team2' },
        { id: '5', name: 'Design Review', teamName: 'Product Team', teamId: 'team3' },
      ];
    }
  },

  // Get available Outlook folders
  async getOutlookFolders(): Promise<OutlookFolder[]> {
    try {
      const response = await api.get('/api/outlook/folders');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch Outlook folders:', error);
      // Return mock data for local development
      return [
        { id: 'inbox', name: 'Inbox' },
        { id: 'sent', name: 'Sent Items' },
        { id: 'important', name: 'Important' },
        { id: 'flagged', name: 'Flagged' },
        { id: 'project-alpha', name: 'Project Alpha', parentFolderName: 'Projects' },
        { id: 'project-beta', name: 'Project Beta', parentFolderName: 'Projects' },
      ];
    }
  },

  // Save user preferences
  async savePreferences(preferences: UserPreferences): Promise<void> {
    try {
      await api.post('/api/preferences', preferences);
    } catch (error) {
      console.error('Failed to save preferences:', error);
      // For local development, just log the preferences
      console.log('Mock save preferences:', preferences);
    }
  },

  // Get user preferences
  async getPreferences(): Promise<UserPreferences | null> {
    try {
      const response = await api.get('/api/preferences');
      return response.data;
    } catch (error) {
      console.error('Failed to get preferences:', error);
      return null;
    }
  },

  // Get daily digest
  async getDailyDigest(): Promise<DailyDigest> {
    try {
      const response = await api.get('/api/digest');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch daily digest:', error);
      // Return mock data for local development
      return {
        date: new Date().toISOString().split('T')[0],
        items: [
          {
            id: '1',
            title: 'Quarterly Review Meeting Scheduled',
            summary: 'Sarah scheduled the Q4 review for next Friday at 2 PM. Please prepare your department reports.',
            source: 'teams',
            sourceDetails: 'Marketing Team > General',
            priority: 'urgent',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            url: 'https://teams.microsoft.com/...',
          },
          {
            id: '2',
            title: 'Action Required: Budget Approval',
            summary: 'Finance needs approval for the marketing budget increase. Deadline is end of week.',
            source: 'outlook',
            sourceDetails: 'Important',
            priority: 'action',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: '3',
            title: 'New Feature Deployed',
            summary: 'The user authentication update went live. All testing passed successfully.',
            source: 'teams',
            sourceDetails: 'Engineering Team > Development',
            priority: 'info',
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: '4',
            title: 'Client Feedback on Project Alpha',
            summary: 'Positive feedback received from client. They want to discuss expansion opportunities.',
            source: 'outlook',
            sourceDetails: 'Project Alpha',
            priority: 'action',
            timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
          },
        ],
        summary: {
          totalItems: 4,
          urgentCount: 1,
          actionCount: 2,
          infoCount: 1,
        },
      };
    }
  },
};

export default apiService;