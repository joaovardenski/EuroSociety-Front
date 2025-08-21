import { useEffect, useState } from "react";
import axiosPrivate from "../api/axiosPrivate";

export interface Usuario {
  id: number;   // em vez de id_usuario
  nome: string;
  email: string;
  permissao: "admin" | "user";
  metodo_login: string;
}

export function useAuth() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<Usuario | null>(null);

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
        const response = await axiosPrivate.get("/user");
        setUser(response.data as Usuario);
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
