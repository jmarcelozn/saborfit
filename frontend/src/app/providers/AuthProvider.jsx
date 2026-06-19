import { AuthProvider as AuthProviderContext } from "@/app/contexts/AuthContext";

export function AuthProvider({ children }) {
  return <AuthProviderContext>{children}</AuthProviderContext>;
}
