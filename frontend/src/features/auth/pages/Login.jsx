import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/app/contexts/useAuth";
import { getErrorMessage } from "@/app/services/errorHandler";
import logo from "@/assets/logo.png";
import "@/styles/pages/auth.css";

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();

  const [form, setForm] = useState({ email: "", senha: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(user?.role === "admin" ? "/admin" : "/", { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  function handleChange(field) {
    return (e) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (error) setError("");
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const result = await login(form.email, form.senha);
      const role = result?.data?.user?.role;
      navigate(role === "admin" ? "/admin" : "/", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="auth-page">

      <div className="auth-card">
        <div className="auth-brand">
          <img src={logo} alt="SaborFit" className="auth-logo" />
          <p className="auth-tagline">Sabor que aconchega</p>
        </div>

        <div className="auth-header">
          <h1>Entrar</h1>
          <p>Bem-vindo de volta! Acesse sua conta para continuar.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="seuemail@exemplo.com"
              value={form.email}
              onChange={handleChange("email")}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              autoComplete="current-password"
              placeholder="Digite sua senha"
              value={form.senha}
              onChange={handleChange("senha")}
              required
            />
          </div>

          {error && (
            <p className="field-error" role="alert">
              {error}
            </p>
          )}

          <div className="auth-options">
            <a href="/recuperar-senha">Esqueci minha senha</a>
          </div>

          <button type="submit" className="auth-submit" disabled={isSubmitting}>
            {isSubmitting ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="auth-footer">
          Não possui conta? <a href="/register">Criar conta</a>
        </p>
      </div>
    </div>
  );
}