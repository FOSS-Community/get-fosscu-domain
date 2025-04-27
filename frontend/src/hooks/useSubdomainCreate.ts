import { useState } from 'react';

const baseUrl = import.meta.env.VITE_BASE_URL;

interface SubdomainCreateRequest {
  subdomain: string;
  target_domain: string;
  record_type: string;
  ttl: number;
}

interface SubdomainCreateResponse {
  id: number;
  subdomain: string;
  target_domain: string;
  record_type: string;
  ttl: number;
  created_at: string;
  updated_at: string;
}

interface ValidationError {
  detail: Array<{
    loc: (string | number)[];
    msg: string;
    type: string;
  }>;
}

export const useSubdomainCreate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ValidationError | null>(null);

  const createSubdomain = async (data: SubdomainCreateRequest): Promise<SubdomainCreateResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      console.log(token)
      const response = await fetch(`${baseUrl}/api/v1/subdomains/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      console.log(response)

      if (response.status === 422) {
        const validationError = await response.json();
        setError(validationError);
        return null;
      }

      if (!response.ok) {
        throw new Error('Failed to create subdomain');
      }

      const result = await response.json();
      return result;
    } catch (err) {
      setError({
        detail: [{
          loc: [''],
          msg: err instanceof Error ? err.message : 'An error occurred',
          type: 'error'
        }]
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { createSubdomain, isLoading, error };
}; 