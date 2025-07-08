// src/components/PrivateRoute.tsx
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";

interface PrivateRouteProps {
  children: ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  //const { isAuthenticated, isLoading } = useAuth();

  const isLoading = false;
  const isAuthenticated = false;  

  if (isLoading) {
    return <div className="text-center mt-10 text-xl">Carregando...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
}
