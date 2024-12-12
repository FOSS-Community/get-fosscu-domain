import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const GitHubCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleCallback } = useAuth();
  console.log('entered callback component')

  useEffect(() => {
    const code = searchParams.get('token');
    console.log('Received code:', code); // For debugging

    if (code) {
      handleCallback(code)
        .then(() => {
          console.log('Authentication successful');
          navigate('/'); // Redirect to home page after successful login
        })
        .catch((error) => {
          console.error('Authentication failed:', error);
          navigate('/login'); // Redirect to login page on failure
        });
    }
  }, [searchParams, handleCallback, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Authenticating...</h2>
        <p>Please wait while we complete your login.</p>
      </div>
    </div>
  );
};

export default GitHubCallback;