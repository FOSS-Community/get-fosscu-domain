import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

const GithubCallback = () => {
  const { setUser } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (code) {
      // Exchange the code for a token
      fetch('http://localhost:8000/auth/github/callback', {
        method: 'POST',
        body: JSON.stringify({ code }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => response.json())
        .then(data => {
          setUser(data.user); // Set user data in context
        })
        .catch(error => console.error('Error:', error));
    }
  }, []);

  return <div>Loading...</div>;
};

export default GithubCallback; 