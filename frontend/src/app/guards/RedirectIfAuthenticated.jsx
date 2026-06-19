import { Navigate } from "react-router-dom";
import { ROUTES } from "@/app/config/routes";
import { useAuth } from "@/app/contexts/useAuth";

export function RedirectIfAuthenticated({ children }) {
  const { isAuthenticated, isInitializing, user } = useAuth();

  if (isInitializing) {
    return null;
  }

  if (!isAuthenticated) {
    return children;
  }

  return <Navigate to={user?.role === "admin" ? ROUTES.ADMIN : ROUTES.HOME} replace />;
}
