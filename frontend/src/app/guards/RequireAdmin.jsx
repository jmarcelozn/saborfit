import { Navigate } from "react-router-dom";
import { ROUTES } from "@/app/config/routes";
import { useAuth } from "@/app/contexts/useAuth";

export function RequireAdmin({ children }) {
  const { isAuthenticated, isInitializing, user } = useAuth();

  if (isInitializing) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return user?.role === "admin" ? children : <Navigate to={ROUTES.HOME} replace />;
}
