import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const GitHubCallback = () => {
    const [searchParams] = useSearchParams();
    const { handleCallback } = useAuth();

    useEffect(() => {
        const token = searchParams.get('token');

        if (!token) {
            window.location.href = '/';
            return;
        }

        const processAuth = async () => {
            try {
                await handleCallback(token);
                window.location.href = '/';
            } catch (error) {
                console.error('Authentication failed:', error);
                window.location.href = '/';
            }
        };

        processAuth();
    }, [searchParams, handleCallback]);

    // Return null - no visible UI
    return null;
};

export default GitHubCallback;