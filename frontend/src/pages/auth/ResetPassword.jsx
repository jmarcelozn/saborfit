import { useState } from "react";
import { apiFetch } from "../../services/api";
import "../../styles/auth.css";

export default function ResetPassword() {
  const [token, setToken] = useState("");
  const [senha, setSenha] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const data = await apiFetch("/reset-password", {
        method: "POST",
        body: JSON.stringify({
          token,
          senha,
        }),
      });

      alert(data.message);
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
        <h1>Nova Senha</h1>

        <input
          placeholder="Token"
          value={token}
          onChange={(e) =>
            setToken(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Nova Senha"
          value={senha}
          onChange={(e) =>
            setSenha(e.target.value)
          }
        />

        <button type="submit">
          Atualizar Senha
        </button>
      </form>
    </div>
  );
}