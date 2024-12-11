import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function GithubCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleCallback, isLoading } = useAuth();

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      handleCallback(code)
        .then(() => {
          // Redirect to home page after successful login
          navigate('/');
        })
        .catch((error) => {
          console.error('Error during callback:', error);
          // Redirect to home page on error
          navigate('/');
        });
    } else {
      // No code found, redirect to home
      navigate('/');
    }
  }, [searchParams, handleCallback, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      {isLoading ? (
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Logging you in...</h2>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      ) : (
        <div className="text-center">
          <h2 className="text-xl font-bold">Redirecting...</h2>
        </div>
      )}
    </div>
  );
} 