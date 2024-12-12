import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'

const GitHubCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleCallback, isLoading } = useAuth();

  useEffect(() => {
    const code = searchParams.get('code');
    
    if (code) {
      handleCallback(code)
        .then(() => {
          // Redirect to home page or dashboard after successful login
          navigate('/');
        })
        .catch((error) => {
          console.error('Authentication failed:', error);
          // Redirect to login page or error page on failure
          navigate('/login');
        });
    } else {
      // No code present, redirect to login
      navigate('/login');
    }
  }, [searchParams, handleCallback, navigate]);

  if (isLoading) {
    return <div>Authenticating...</div>;
  }

  return null;
};

export default GitHubCallback;