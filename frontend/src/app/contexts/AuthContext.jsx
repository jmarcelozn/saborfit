import {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { apiFetch, registerApiErrorHandler } from "@/app/services/api";
import { showNotification } from "@/app/services/notificationService";
import { ROUTES } from "@/app/config/routes";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const unauthorizedHandled = useRef(false);

  const clearAuth = useCallback(() => {
    setUser(null);

    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
  }, []);

  const getMe = async () => {
    const data = await apiFetch("/me", {
      method: "GET",
    });

    setUser({
      ...data.data.user,
      session: data.data.session,
    });

    unauthorizedHandled.current = false;

    return data.data.user;
  };

  const logout = useCallback(() => {
    unauthorizedHandled.current = false;
    clearAuth();
  }, [clearAuth]);

  const handleUnauthorized = useCallback(() => {
    // NÃO redireciona enquanto está inicializando
    // Usuários não autenticados acessando páginas públicas é esperado durante init
    if (isInitializing) {
      return;
    }

    if (unauthorizedHandled.current) {
      return;
    }

    unauthorizedHandled.current = true;

    clearAuth();

    const currentPath = window.location.pathname;

    const authRoutes = [
      ROUTES.LOGIN,
      ROUTES.REGISTER,
      ROUTES.FORGOT_PASSWORD,
      ROUTES.RESET_PASSWORD,
    ];

    if (!authRoutes.includes(currentPath)) {
      showNotification(
        "Sua sessão expirou. Faça login novamente.",
        "error"
      );

      window.location.replace(ROUTES.LOGIN);
    }
  }, [clearAuth, isInitializing]);

  useEffect(() => {
    // Registra um handler "silencioso" durante a inicialização
    // que não redireciona em caso de 401 (usuário não autenticado é esperado)
    registerApiErrorHandler(null);

    async function initAuth() {
      try {
        // Tenta recuperar dados do usuário sem ativar redirecionamento
        // Se não estiver autenticado, a exceção é capturada e tratada normalmente
        await getMe();
      } catch {
        clearAuth();
      } finally {
        setIsInitializing(false);
      }
    }

    initAuth().finally(() => {
      // Após inicializar, registra o handler real que redireciona ao login
      registerApiErrorHandler((status) => {
        if (status === 401) {
          handleUnauthorized();
        }
      });
    });
  }, [handleUnauthorized, clearAuth]);

  const login = async (email, senha) => {
    const data = await apiFetch("/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        senha,
      }),
    });

    unauthorizedHandled.current = false;

    setUser({
      ...data.data.user,
      session: data.data.session,
    });

    return data;
  };

  const register = async (payload) => {
    const data = await apiFetch("/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (data?.data?.user) {
      unauthorizedHandled.current = false;

      setUser({
        ...data.data.user,
        session: data.data.session,
      });
    }

    return data;
  };

  const logoutAll = async () => {
    try {
      await apiFetch("/logout-all", {
        method: "POST",
      });
    } finally {
      logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isAdmin: user?.role === "admin",
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