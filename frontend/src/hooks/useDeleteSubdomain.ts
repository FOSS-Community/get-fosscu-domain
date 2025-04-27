import { useState } from "react";

const baseUrl = import.meta.env.VITE_BASE_URL;

interface DeleteSubdomainResponse {
  success: boolean;
  message?: string;
}

type DeleteSubdomainError = {
  message: string;
  status?: number;
};

export const useDeleteSubdomain = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<DeleteSubdomainError | null>(null);
  const token = localStorage.getItem("token");
  console.log(token);

  const deleteSubdomain = async (id: number): Promise<DeleteSubdomainResponse | undefined> => {
    if (!token) {
      setError({ message: "Authentication token not found" });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${baseUrl}/api/v1/subdomains/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        throw {
          message: data.message || "Failed to delete subdomain",
          status: response.status,
        };
      }

      return {
        success: true,
        message: data.message,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete subdomain";
      const error: DeleteSubdomainError = {
        message: errorMessage,
        status: (err as any)?.status,
      };
      setError(error);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteSubdomain, isLoading, error };
};
