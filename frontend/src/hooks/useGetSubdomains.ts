import { useState, useEffect, useCallback } from 'react';

interface Subdomain {
    id: number;
    subdomain: string;
    target_domain: string;
    record_type: string;
    ttl: number;
    priority: number;
    created_at: string;
    updated_at: string;
}

export const useGetSubdomains = () => {
    const [subdomains, setSubdomains] = useState<Subdomain[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const fetchSubdomains = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/subdomains/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                // Add cache busting parameter to prevent caching
                cache: 'no-store'
            });

            if (!response.ok) {
                throw new Error('Failed to fetch subdomains');
            }

            const data = await response.json();
            setSubdomains(data);
        } catch (err) {
            setError(err);
            console.error('Error fetching subdomains:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSubdomains();

        // Set up an interval to refresh data every 30 seconds
        const intervalId = setInterval(() => {
            fetchSubdomains();
        }, 30000);

        // Listen for storage events (token changes)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'token') {
                fetchSubdomains();
            }
        };
        
        window.addEventListener('storage', handleStorageChange);
        
        return () => {
            clearInterval(intervalId);
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [fetchSubdomains]);

    const refreshSubdomains = useCallback(() => {
        return fetchSubdomains();
    }, [fetchSubdomains]);

    const removeSubdomain = useCallback((id: number) => {
        setSubdomains(prevSubdomains => 
            prevSubdomains.filter(subdomain => subdomain.id !== id)
        );
    }, []);

    return {
        subdomains,
        isLoading,
        error,
        refreshSubdomains,
        removeSubdomain
    };
};