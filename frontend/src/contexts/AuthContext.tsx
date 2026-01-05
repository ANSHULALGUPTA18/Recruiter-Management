import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { AccountInfo, InteractionStatus } from '@azure/msal-browser';
import { loginRequest } from '../config/authConfig';

interface AuthContextType {
  isAuthenticated: boolean;
  user: AccountInfo | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { instance, accounts, inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const [isLoading, setIsLoading] = useState(true);

  const user = accounts[0] || null;

  useEffect(() => {
    // Initialize authentication state
    if (inProgress === InteractionStatus.None) {
      setIsLoading(false);
    }
  }, [inProgress]);

  const login = async () => {
    try {
      setIsLoading(true);
      await instance.loginPopup(loginRequest);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await instance.logoutPopup({
        mainWindowRedirectUri: '/',
      });
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getAccessToken = async (): Promise<string | null> => {
    if (!user) return null;

    try {
      // Try silent token acquisition first
      const response = await instance.acquireTokenSilent({
        ...loginRequest,
        account: user,
      });
      return response.accessToken;
    } catch (error) {
      console.warn('Silent token acquisition failed, attempting interactive:', error);
      try {
        // Fall back to interactive authentication
        const response = await instance.acquireTokenPopup(loginRequest);
        return response.accessToken;
      } catch (interactiveError) {
        console.error('Interactive token acquisition failed:', interactiveError);
        return null;
      }
    }
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    login,
    logout,
    getAccessToken,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
