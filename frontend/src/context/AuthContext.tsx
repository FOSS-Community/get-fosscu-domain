import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

axios.defaults.baseURL = BASE_URL;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Configure axios interceptors
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      dispatchTokenChangeEvent();
    }
    return Promise.reject(error);
  }
);

// Helper to dispatch custom event for token changes
const dispatchTokenChangeEvent = () => {
  window.dispatchEvent(new CustomEvent('tokenChange'));
};

interface AuthContextType {
  user: any;
  setUser: (user: any) => void;
  login: () => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  handleCallback: (token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check authentication status
  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      return;
    }

    try {
      const { data: userData } = await axios.get('/api/v1/auth/me');
      setUser(userData);
    } catch (error) {
      console.error('Auth check error:', error);
      localStorage.removeItem('token');
      dispatchTokenChangeEvent();
      setUser(null);
    }
  }, []);

  // Initialize auth state and set up listeners
  useEffect(() => {
    // Silent initialization
    checkAuth();
    
    // Listen for token changes
    const handleTokenChange = () => {
      checkAuth();
    };
    
    window.addEventListener('tokenChange', handleTokenChange);
    window.addEventListener('storage', (e) => {
      if (e.key === 'token') {
        handleTokenChange();
      }
    });
    
    return () => {
      window.removeEventListener('tokenChange', handleTokenChange);
      window.removeEventListener('storage', handleTokenChange as any);
    };
  }, [checkAuth]);

  // Login with GitHub
  const login = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get('/api/v1/auth/login/github');
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
    }
  };

  // Handle OAuth callback
  const handleCallback = async (token: string) => {
    try {
      localStorage.setItem('token', token);
      dispatchTokenChangeEvent();

      const { data: userData } = await axios.get('/api/v1/auth/me');
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Callback error:', error);
      localStorage.removeItem('token');
      dispatchTokenChangeEvent();
      setUser(null);
      throw error;
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    dispatchTokenChangeEvent();
    setUser(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, isLoading, handleCallback }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 