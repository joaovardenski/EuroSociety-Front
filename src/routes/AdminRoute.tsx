import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";

interface AdminRouteProps {
  children: ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  if (isLoading) return <div className="text-center mt-10 text-xl">Carregando...</div>;

  if (!isAuthenticated) return <Navigate to="/not-authenticated" replace />;

  if (!isAdmin) return <Navigate to="/unauthorized" replace />;

  return children;
}
