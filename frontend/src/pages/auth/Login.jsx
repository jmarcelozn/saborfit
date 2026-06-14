import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import "../../styles/auth.css";

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();

  const [form, setForm] = useState({
    email: "",
    senha: "",
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate(user?.role === 'admin' ? '/admin' : '/');
    }
  }, [isAuthenticated, user, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const result = await login(form.email, form.senha);

      alert("Login realizado com sucesso!");
      const role = result?.data?.user?.role;
      navigate(role === 'admin' ? '/admin' : '/');
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="auth-container">
      <form
        className="auth-card"
        onSubmit={handleSubmit}
      >
        <h1>Entrar</h1>

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
        />

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
        />

        <button type="submit">
          Entrar
        </button>
      </form>
    </div>
  );
}