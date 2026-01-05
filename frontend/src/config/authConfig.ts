import { Configuration, LogLevel } from '@azure/msal-browser';

/**
 * Microsoft Authentication Library (MSAL) Configuration
 * for Azure AD (Entra ID) SSO implementation
 */
export const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID || '',
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_TENANT_ID || 'common'}`,
    redirectUri: import.meta.env.VITE_AZURE_REDIRECT_URI || window.location.origin,
    postLogoutRedirectUri: import.meta.env.VITE_AZURE_REDIRECT_URI || window.location.origin,
    navigateToLoginRequestUrl: true,
  },
  cache: {
    cacheLocation: 'sessionStorage', // Use sessionStorage for better security
    storeAuthStateInCookie: false, // Set to true for IE11 or Edge support
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) return;
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
        }
      },
    },
  },
};

/**
 * Scopes for Microsoft Graph API and Azure AD
 * Add additional scopes as needed for your application
 */
export const loginRequest = {
  scopes: ['User.Read', 'openid', 'profile', 'email'],
};

/**
 * Scopes for silent token acquisition
 */
export const silentRequest = {
  scopes: ['User.Read'],
  forceRefresh: false,
};

/**
 * Protected resource map for API calls
 * Maps API endpoints to required scopes
 */
export const protectedResources = {
  graphMe: {
    endpoint: 'https://graph.microsoft.com/v1.0/me',
    scopes: ['User.Read'],
  },
  api: {
    endpoint: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
    scopes: [`api://${import.meta.env.VITE_AZURE_CLIENT_ID}/access_as_user`],
  },
};
