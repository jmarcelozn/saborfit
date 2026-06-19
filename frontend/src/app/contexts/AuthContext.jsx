import { createContext, useCallback, useEffect, useState } from "react";
import { apiFetch, registerApiErrorHandler } from "@/app/services/api";
import { showNotification } from "@/app/services/notificationService";
import { ROUTES } from "@/app/config/routes";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const getMe = async () => {
    const data = await apiFetch("/me", {
      method: "GET",
    });

    setUser({
      ...data.data.user,
      session: data.data.session,
    });
    return data.data.user;
  };

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const handleUnauthorized = useCallback(() => {
    const currentPath = window.location.pathname;
    const authRoutes = [
      ROUTES.LOGIN,
      ROUTES.REGISTER,
      ROUTES.FORGOT_PASSWORD,
      ROUTES.RESET_PASSWORD,
    ];
    const isAuthRoute = authRoutes.includes(currentPath);

    logout();

    if (!isAuthRoute) {
      showNotification("Sua sessão expirou. Faça login novamente.", "error");
      window.location.replace(ROUTES.LOGIN);
    }
  }, [logout]);

  useEffect(() => {
    async function initAuth() {
      try {
        await getMe();
      } catch {
        setUser(null);
      } finally {
        setIsInitializing(false);
      }
    }

    registerApiErrorHandler((status) => {
      if (status === 401) {
        handleUnauthorized();
      }
    });

    initAuth();
  }, [handleUnauthorized]);

  const login = async (email, senha) => {
    const data = await apiFetch("/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        senha,
      }),
    });

    setUser({
      ...data.data.user,
      session: data.data.session,
    });
    return data;
  };

  const register = async (payload) => {
    return await apiFetch("/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  };

  const logoutAll = async () => {
    const data = await apiFetch("/logout-all", {
      method: "POST",
    });

    logout();

    return data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isAdmin: Boolean(user?.role === 'admin'),
        isInitializing,
        login,
        register,
        getMe,
        logout,
        logoutAll,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
