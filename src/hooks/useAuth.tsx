// src/hooks/useAuth.ts
import { useEffect, useState } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

export function useAuth() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await axios.get("http://localhost:8000/api/user");
        setIsAuthenticated(!!response.data);
      } catch (err) {
        console.error(err);
        setIsAuthenticated(false);
        
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, []);

  return { isAuthenticated, isLoading };
}
