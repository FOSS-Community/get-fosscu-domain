import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

axios.defaults.baseURL = BASE_URL;
axios.defaults.headers.common['Content-Type'] = 'application/json';

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
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

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
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
      setIsInitialized(true);
      return;
    }

    try {
      const { data: userData } = await axios.get('/api/v1/auth/me');
      setUser(userData);
    } catch (error) {
      console.error('Auth check error:', error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setIsLoading(false);
      setIsInitialized(true);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get('/api/v1/auth/login/github');
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCallback = async (token: string) => {
    try {
      setIsLoading(true);
      localStorage.setItem('token', token);

      const { data: userData } = await axios.get('/api/v1/auth/me');
      setUser(userData);
    } catch (error) {
      console.error('Callback error:', error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/';
  };

  // Don't render anything until initial auth check is complete
  if (!isInitialized) {
    return null;
  }

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