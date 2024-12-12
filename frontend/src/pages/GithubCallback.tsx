import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const GitHubCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { handleCallback } = useAuth();
    console.log('entered callback component')

    useEffect(() => {
        const token = searchParams.get('token');

        if (token) {
            handleCallback(token)
                .then(() => {
                    console.log('Authentication successful');
                    navigate('/'); 
                })
                .catch((error) => {
                    console.error('Authentication failed:', error);
                    navigate('/'); 
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