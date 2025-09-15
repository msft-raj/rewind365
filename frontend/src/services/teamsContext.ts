import { app } from '@microsoft/teams-js';

export interface TeamsContext {
  theme: string;
  user?: {
    id: string;
    displayName: string;
    userPrincipalName: string;
  };
  team?: {
    internalId: string;
    displayName: string;
  };
  channel?: {
    id: string;
    displayName: string;
  };
}

class TeamsContextService {
  private context: any = null;
  private initialized = false;

  // Initialize Teams context
  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      await app.initialize();
      this.context = await app.getContext();
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize Teams context:', error);
      // For local development, create mock context
      this.context = {
        app: {
          theme: 'default',
          host: {
            name: 'Teams',
            clientType: 'desktop',
          },
        },
        user: {
          id: 'mock-user-id',
          displayName: 'Mock User',
          userPrincipalName: 'mock.user@company.com',
        },
        team: {
          internalId: 'mock-team-id',
          displayName: 'Mock Team',
        },
        channel: {
          id: 'mock-channel-id',
          displayName: 'Mock Channel',
        },
      };
      this.initialized = true;
    }
  }

  // Get current context
  getContext(): TeamsContext | null {
    if (!this.context) return null;

    return {
      theme: this.context.app?.theme || 'default',
      user: this.context.user ? {
        id: this.context.user.id,
        displayName: this.context.user.displayName || 'Unknown User',
        userPrincipalName: this.context.user.userPrincipalName || '',
      } : undefined,
      team: this.context.team ? {
        internalId: this.context.team.internalId,
        displayName: this.context.team.displayName || 'Unknown Team',
      } : undefined,
      channel: this.context.channel ? {
        id: this.context.channel.id,
        displayName: this.context.channel.displayName || 'Unknown Channel',
      } : undefined,
    };
  }

  // Get user ID for API calls
  getUserId(): string | null {
    return this.context?.user?.id || null;
  }

  // Get current theme
  getTheme(): string {
    return this.context?.app?.theme || 'default';
  }

  // Check if running in Teams
  isInTeams(): boolean {
    return this.initialized && this.context?.app?.host?.name === 'Teams';
  }
}

// Create singleton instance
export const teamsContext = new TeamsContextService();

// Hook for React components
export const useTeamsContext = () => {
  return {
    context: teamsContext.getContext(),
    getUserId: () => teamsContext.getUserId(),
    getTheme: () => teamsContext.getTheme(),
    isInTeams: () => teamsContext.isInTeams(),
  };
};