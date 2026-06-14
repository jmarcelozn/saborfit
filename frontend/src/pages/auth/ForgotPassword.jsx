import { useState } from "react";
import { apiFetch } from "../../services/api";
import "../../styles/auth.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const data = await apiFetch("/forgot-password", {
        method: "POST",
        body: JSON.stringify({
          email,
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
        <h1>Recuperar Senha</h1>

        <input
          type="email"
          placeholder="Seu email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <button type="submit">
          Enviar
        </button>
      </form>
    </div>
  );
}