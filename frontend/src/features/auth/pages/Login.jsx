import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/app/contexts/useAuth";
import { getErrorMessage } from "@/app/services/errorHandler";
import logo from "@/assets/logo.png";
import "@/styles/pages/auth.css";

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();

  const [form, setForm] = useState({
    email: "",
    senha: "",
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate(
        user?.role === "admin" ? "/admin" : "/",
        { replace: true }
      );
    }
  }, [isAuthenticated, user, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const result = await login(
        form.email,
        form.senha
      );

      const role = result?.data?.user?.role;

      navigate(
        role === "admin" ? "/admin" : "/",
        { replace: true }
      );
    } catch (err) {
      alert(getErrorMessage(err));
    }
  }

  return (
    <div className="auth-page">
      {/* Banner lateral */}
      <div className="auth-banner">
        <div className="banner-content">
          <img
            src={logo}
            alt="SaborFit"
            className="banner-logo"
          />
        </div>
      </div>

      {/* Área do formulário */}
      <div className="auth-content">
        <form
          className="auth-card"
          onSubmit={handleSubmit}
        >
          <div className="auth-header">
            <h2>Entrar</h2>
            <span>Bem-vindo</span>
          </div>

          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Senha"
              value={form.senha}
              onChange={(e) =>
                setForm({
                  ...form,
                  senha: e.target.value,
                })
              }
              required
            />
          </div>

          <div className="auth-options">
            <a href="/recuperar-senha">
              Esqueci minha senha
            </a>
          </div>

          <button
            type="submit"
            className="login-btn"
          >
            Entrar
          </button>

          <div className="auth-footer">
            <p>
              Não possui conta?{" "}
              <a href="/register">
                Criar conta
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}