import { useState, useEffect } from 'react';

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

const token = localStorage.getItem('token');
export const useGetSubdomains = () => {
    const [subdomains, setSubdomains] = useState<Subdomain[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const fetchSubdomains = async () => {
        if (!token) return;
        
        setIsLoading(true);
        setError(null);

        try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/subdomains/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });


            if (!response.ok) {
                throw new Error('Failed to fetch subdomains');
            }

            const data = await response.json();
            console.log(data);
            setSubdomains(data);
        } catch (err) {
            setError(err);
            console.error('Error fetching subdomains:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSubdomains();
    }, [token]);

    const refreshSubdomains = () => {
        fetchSubdomains();
    };

    return {
        subdomains,
        isLoading,
        error,
        refreshSubdomains
    };
};