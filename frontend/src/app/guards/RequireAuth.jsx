import { Navigate } from "react-router-dom";
import { ROUTES } from "@/app/config/routes";
import { useAuth } from "@/app/contexts/useAuth";

export function RequireAuth({ children }) {
  const { isAuthenticated, isInitializing } = useAuth();

  if (isInitializing) {
    return null;
  }

  return isAuthenticated ? children : <Navigate to={ROUTES.LOGIN} replace />;
}
