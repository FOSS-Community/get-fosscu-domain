import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

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

  const login = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(`${BASE_URL}/api/v1/auth/login/github`);
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
      
      const { data: userData } = await axios.get(`${BASE_URL}/api/v1/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setUser(userData);
    } catch (error) {
      console.error('Callback error:', error);
      localStorage.removeItem('token');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
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