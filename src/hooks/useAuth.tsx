import { useEffect, useState } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

export interface Usuario {
  id_usuario: number;
  nome: string;
  email: string;
  permissao: "admin" | "usuario"; // ajuste se usar outro sistema
  metodo_login: string;
}

export function useAuth() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<Usuario | null>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await axios.get("http://localhost:8000/api/user");
        setUser(response.data as Usuario); // espera que o backend retorne { id_usuario, nome, ... }
        setIsAuthenticated(true);
      } catch (err) {
        console.error(err);
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
