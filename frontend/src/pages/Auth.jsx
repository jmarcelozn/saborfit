import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE_API_URL = import.meta.env.VITE_API_URL || "/api";
const API_URL = `${BASE_API_URL}/auth`;

class ApiError extends Error {
  constructor(message, details = null) {
    super(message);
    this.details = details;
  }
}

export default function AuthPage() {
  const navigate = useNavigate();
  const [registerData, setRegisterData] = useState({
    nome: "",
    email: "",
    senha: "",
  });

  const [loginData, setLoginData] = useState({
    email: "",
    senha: "",
  });

  const [profile, setProfile] = useState(null);

  const [forgotEmail, setForgotEmail] = useState("");

  const [resetToken, setResetToken] = useState("");
  const [resetSenha, setResetSenha] = useState("");

  const [verifyToken, setVerifyToken] = useState("");

  const [passwordData, setPasswordData] = useState({
    senhaAtual: "",
    novaSenha: "",
  });

  const apiFetch = async (path, options = {}) => {
    const response = await fetch(`${API_URL}${path}`, {
      credentials: 'include',
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data?.message || data?.error?.message || "Erro de requisição";
      const details = data?.error?.details || null;
      throw new ApiError(errorMessage, details);
    }

    return data;
  };

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await apiFetch("/me", { method: "GET" });
        setProfile(data.data.user);
      } catch {
        setProfile(null);
      }
    }

    loadProfile();
  }, []);

  useEffect(() => {
    if (profile) {
      navigate('/');
    }
  }, [profile, navigate]);

  const showError = (err) => {
    if (err instanceof ApiError && Array.isArray(err.details) && err.details.length > 0) {
      const detailsText = err.details.map((detail) => `${detail.field}: ${detail.message}`).join("\n");
      alert(`${err.message}\n${detailsText}`);
      return;
    }

    alert(err.message || "Erro inesperado");
  };

  async function register() {
    try {
      const data = await apiFetch("/register", {
        method: "POST",
        body: JSON.stringify(registerData),
      });

      alert(data.message);
    } catch (err) {
      console.error(err);
      showError(err);
    }
  }

  async function login() {
    try {
      const data = await apiFetch("/login", {
        method: "POST",
        body: JSON.stringify(loginData),
      });

      setProfile(data.data.user);
      alert("Login realizado");
      navigate('/');
    } catch (err) {
      console.error(err);
      showError(err);
    }
  }

  async function getMe() {
    try {
      const data = await apiFetch("/me", {
        method: "GET",
      });

      setProfile(data.data.user);
    } catch (err) {
      console.error(err);
      showError(err);
    }
  }

  async function forgotPassword() {
    try {
      const data = await apiFetch("/forgot-password", {
        method: "POST",
        body: JSON.stringify({
          email: forgotEmail,
        }),
      });

      alert(data.message);
    } catch (err) {
      console.error(err);
      showError(err);
    }
  }

  async function validateResetToken() {
    try {
      const data = await apiFetch("/validate-reset-token", {
        method: "POST",
        body: JSON.stringify({
          token: resetToken,
        }),
      });

      alert(data.message);
    } catch (err) {
      console.error(err);
      showError(err);
    }
  }

  async function resetPassword() {
    try {
      const data = await apiFetch("/reset-password", {
        method: "POST",
        body: JSON.stringify({
          token: resetToken,
          senha: resetSenha,
        }),
      });

      alert(data.message);
    } catch (err) {
      console.error(err);
      showError(err);
    }
  }

  async function verifyEmail() {
    try {
      const data = await apiFetch("/verify-email", {
        method: "POST",
        body: JSON.stringify({
          token: verifyToken,
        }),
      });

      alert(data.message);
    } catch (err) {
      console.error(err);
      showError(err);
    }
  }

  async function resendVerification() {
    try {
      const data = await apiFetch("/resend-verification", {
        method: "POST",
      });

      alert(data.message);
    } catch (err) {
      console.error(err);
      showError(err);
    }
  }

  async function changePassword() {
    try {
      const data = await apiFetch("/change-password", {
        method: "PATCH",
        body: JSON.stringify(passwordData),
      });

      setProfile(null);
      alert(data.message);
    } catch (err) {
      console.error(err);
      showError(err);
    }
  }

  async function logoutAll() {
    try {
      const data = await apiFetch("/logout-all", {
        method: "POST",
      });

      setProfile(null);
      alert(data.message);
      navigate('/auth');
    } catch (err) {
      console.error(err);
      showError(err);
    }
  }

  return (
    <div>
      <h1>Auth Page</h1>

      <hr />

      <h2>Cadastro</h2>

      <input
        placeholder="Nome"
        value={registerData.nome}
        onChange={(e) =>
          setRegisterData({
            ...registerData,
            nome: e.target.value,
          })
        }
      />

      <input
        placeholder="Email"
        value={registerData.email}
        onChange={(e) =>
          setRegisterData({
            ...registerData,
            email: e.target.value,
          })
        }
      />

      <input
        type="password"
        placeholder="Senha"
        value={registerData.senha}
        onChange={(e) =>
          setRegisterData({
            ...registerData,
            senha: e.target.value,
          })
        }
      />

      <button onClick={register}>Cadastrar</button>

      <hr />

      <h2>Login</h2>

      <input
        placeholder="Email"
        value={loginData.email}
        onChange={(e) =>
          setLoginData({
            ...loginData,
            email: e.target.value,
          })
        }
      />

      <input
        type="password"
        placeholder="Senha"
        value={loginData.senha}
        onChange={(e) =>
          setLoginData({
            ...loginData,
            senha: e.target.value,
          })
        }
      />

      <button onClick={login}>Entrar</button>

      <hr />

      <h2>Perfil</h2>

      <button onClick={getMe}>Buscar Perfil</button>

      {profile && (
        <pre>{JSON.stringify(profile, null, 2)}</pre>
      )}

      <hr />

      <h2>Solicitar Reset</h2>

      <input
        placeholder="Email"
        value={forgotEmail}
        onChange={(e) => setForgotEmail(e.target.value)}
      />

      <button onClick={forgotPassword}>
        Solicitar Reset
      </button>

      <hr />

      <h2>Resetar Senha</h2>

      <input
        placeholder="Token"
        value={resetToken}
        onChange={(e) => setResetToken(e.target.value)}
      />

      <input
        type="password"
        placeholder="Nova senha"
        value={resetSenha}
        onChange={(e) => setResetSenha(e.target.value)}
      />

      <button onClick={validateResetToken}>
        Validar Token
      </button>

      <button onClick={resetPassword}>
        Resetar Senha
      </button>

      <hr />

      <h2>Verificação de Email</h2>

      <input
        placeholder="Token"
        value={verifyToken}
        onChange={(e) => setVerifyToken(e.target.value)}
      />

      <button onClick={verifyEmail}>
        Verificar Email
      </button>

      <button onClick={resendVerification}>
        Reenviar Verificação
      </button>

      <hr />

      <h2>Alterar Senha</h2>

      <input
        type="password"
        placeholder="Senha atual"
        value={passwordData.senhaAtual}
        onChange={(e) =>
          setPasswordData({
            ...passwordData,
            senhaAtual: e.target.value,
          })
        }
      />

      <input
        type="password"
        placeholder="Nova senha"
        value={passwordData.novaSenha}
        onChange={(e) =>
          setPasswordData({
            ...passwordData,
            novaSenha: e.target.value,
          })
        }
      />

      <button onClick={changePassword}>
        Alterar Senha
      </button>

      <hr />

      <h2>Logout Global</h2>

      <button onClick={logoutAll}>
        Logout All
      </button>
    </div>
  );
}