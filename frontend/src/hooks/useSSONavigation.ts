import { useAuth } from '../contexts/AuthContext';

/**
 * Hook to handle SSO navigation to child applications
 * Ensures authentication token is available before navigating
 */
export function useSSONavigation() {
  const { getAccessToken, isAuthenticated } = useAuth();

  /**
   * Navigate to a child application with SSO
   * @param url - The URL of the child application
   */
  const navigateWithSSO = async (url: string) => {
    if (!isAuthenticated) {
      console.error('User is not authenticated');
      return;
    }

    try {
      // Get fresh access token
      const token = await getAccessToken();
      
      if (!token) {
        console.error('Failed to acquire access token');
        return;
      }

      // Store token in sessionStorage for child app to read
      sessionStorage.setItem('msal.token', token);
      
      // Navigate to child application
      // The child app should already have the Microsoft session active
      // since they share the same Azure AD tenant
      window.open(url, '_blank', 'noopener,noreferrer');
      
    } catch (error) {
      console.error('SSO navigation failed:', error);
    }
  };

  return { navigateWithSSO };
}
