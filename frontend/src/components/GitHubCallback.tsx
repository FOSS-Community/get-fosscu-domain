import { useEffect } from 'react';
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
          navigate('/');
        })
        .catch((error) => {
          console.error('Authentication failed:', error);
          navigate('/');
        });
    } else {
      navigate('/');
    }
  }, [searchParams, handleCallback, navigate]);

  if (isLoading) {
    return <div>Authenticating...</div>;
  }

  return null;
};

export default GitHubCallback;