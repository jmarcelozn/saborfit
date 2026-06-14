import { createContext, useEffect, useState } from "react";
import { apiFetch } from "../services/api";

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

    initAuth();
  }, []);

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

  const logout = () => {
    setUser(null);
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
