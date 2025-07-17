import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
// import { useAuth } from "../hooks/useAuth";

interface AdminRouteProps {
  children: ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  // Aqui você poderia usar um hook de autenticação, como:
  // const { isAuthenticated, isAdmin, isLoading } = useAuth();

  const isLoading = false;
  const isAuthenticated = true;
  const isAdmin = true; // <- Aqui verifica se o usuário tem permissão de admin

  if (isLoading) {
    return <div className="text-center mt-10 text-xl">Carregando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!isAdmin) {
    return <Navigate to="/unauthorized" />; // Página de acesso negado
  }

  return children;
}
