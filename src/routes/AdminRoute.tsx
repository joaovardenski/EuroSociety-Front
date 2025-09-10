import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";

interface AdminRouteProps {
  children: ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-gray-50">
        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        {/* Texto */}
        <span className="text-gray-700 text-lg font-medium">Carregando...</span>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/not-authenticated" replace />;

  if (!isAdmin) return <Navigate to="/unauthorized" replace />;

  return children;
}
