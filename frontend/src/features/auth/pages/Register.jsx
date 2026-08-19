import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/app/contexts/useAuth";
import { getErrorMessage } from "@/app/services/errorHandler";
import logo from "@/assets/logo.png";
import "@/styles/pages/auth.css";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(field) {
    return (e) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (error) setError("");
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const data = await register(form);

      if (data?.data?.user) {
        navigate("/", { replace: true });
        return;
      }

      setSuccessMessage(data?.message || "Conta criada com sucesso!");
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
          <h1>Criar conta</h1>
          <p>Leva menos de um minuto para começar.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="nome">Nome</label>
            <input
              id="nome"
              type="text"
              autoComplete="name"
              placeholder="Seu nome completo"
              value={form.nome}
              onChange={handleChange("nome")}
              required
            />
          </div>

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
              autoComplete="new-password"
              placeholder="Crie uma senha"
              value={form.senha}
              onChange={handleChange("senha")}
              minLength={6}
              required
            />
            <span className="field-hint">Mínimo de 6 caracteres.</span>
          </div>

          {error && (
            <p className="field-error" role="alert">
              {error}
            </p>
          )}

          {successMessage && (
            <p className="field-success" role="status">
              {successMessage}
            </p>
          )}

          <button type="submit" className="auth-submit" disabled={isSubmitting}>
            {isSubmitting ? "Criando conta..." : "Criar conta"}
          </button>
        </form>

        <p className="auth-footer">
          Já possui conta? <a href="/login">Entrar</a>
        </p>
      </div>
    </div>
  );
}