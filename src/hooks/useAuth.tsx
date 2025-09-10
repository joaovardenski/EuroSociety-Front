import { useEffect, useState } from "react";
import axiosPrivate from "../api/axiosPrivate";
import type { User } from "../types/interfacesFront";
import type { UserAPI } from "../types/interfacesApi";
import { mapUser } from "../utils/Mappers";

export function useAuth() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        const response = await axiosPrivate.get<UserAPI>("/user");

        const mappedUser = mapUser(response.data);
        setUser(mappedUser);
        setIsAuthenticated(true);
      } catch (err) {
        console.error(err);
        localStorage.removeItem("access_token"); // limpa token inválido
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, []);

  const isAdmin = user?.permissao === "admin";

  return { isAuthenticated, isAdmin, isLoading, user };
}
