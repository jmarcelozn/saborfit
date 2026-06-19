import { useState } from "react";
import { useAuth } from "@/app/contexts/useAuth";
import { getErrorMessage } from "@/app/services/errorHandler";
import "@/styles/pages/auth.css";

export default function Register() {
  const { register } = useAuth();

  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const data = await register(form);

      alert(data.message);
    } catch (err) {
      alert(getErrorMessage(err));
    }
  }

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Cadastro</h1>

        <input
          placeholder="Nome"
          value={form.nome}
          onChange={(e) =>
            setForm({
              ...form,
              nome: e.target.value,
            })
          }
        />

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

        <button type="submit">Criar Conta</button>
      </form>
    </div>
  );
}
