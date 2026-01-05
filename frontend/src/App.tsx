import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { MsalProvider } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from './config/authConfig';
import { AuthProvider } from './contexts/AuthContext';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

// Initialize MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

function RedirectOnRefresh({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== '/') {
      navigate('/', { replace: true });
    }
  }, []);

  return <>{children}</>;
}

function App() {
  return (
    <MsalProvider instance={msalInstance}>
      <AuthProvider>
        <Router>
          <RedirectOnRefresh>
            <ProtectedRoute>
              <MainLayout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/legal" element={<PlaceholderPage title="Legal Compliance" />} />
                  <Route path="/resume/*" element={<PlaceholderPage title="Resume Suite" />} />
                  <Route path="/outreach/*" element={<PlaceholderPage title="Outreach" />} />
                  <Route path="/analytics" element={<PlaceholderPage title="Analytics" />} />
                  <Route path="/jobs/*" element={<PlaceholderPage title="Jobs" />} />
                </Routes>
              </MainLayout>
            </ProtectedRoute>
          </RedirectOnRefresh>
        </Router>
      </AuthProvider>
    </MsalProvider>
  );
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex-1 p-6 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-500">This page is under construction.</p>
      </div>
    </div>
  );
}

export default App;
