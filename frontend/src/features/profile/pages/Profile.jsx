import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/app/contexts/useAuth";
import "./css/Profile.css";

function formatDuration(seconds) {
  if (seconds === null || seconds === undefined) return "Não disponível";
  if (seconds <= 0) return "Expirado";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts = [];
  if (hours) parts.push(`${hours}h`);
  if (minutes) parts.push(`${minutes}m`);
  if (secs || parts.length === 0) parts.push(`${secs}s`);
  return parts.join(" ");
}

function formatDate(value) {
  if (!value) return "Não disponível";
  try {
    return new Date(value).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return value;
  }
}

function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0][0]?.toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Profile() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logoutAll } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const tokenInfo = useMemo(() => {
    if (!user?.session) return null;

    return {
      expiresAt: user.session.expiresAt,
      expiresIn: formatDuration(user.session.expiresInSeconds),
    };
  }, [user]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logoutAll();
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert(err.message || "Erro ao sair");
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <main className="profile-container">
      <section className="profile-hero">
        <div className="profile-avatar">{getInitials(user.nome)}</div>

        <div className="profile-hero-info">
          <span className="profile-eyebrow">Meu Perfil</span>
          <h1 className="profile-name">{user.nome}</h1>
          {user.email && <p className="profile-email">{user.email}</p>}

        </div>

        <button
          type="button"
          className="profile-logout-btn"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? "Saindo..." : "Sair da conta"}
        </button>
      </section>

      <section className="profile-cards">
        <div className="profile-card">
          <h2 className="profile-card-title">Dados da conta</h2>

          <dl className="profile-detail-list">
            <div className="profile-detail-row">
              <dt>Nome</dt>
              <dd>{user.nome || "Não informado"}</dd>
            </div>
            <div className="profile-detail-row">
              <dt>E-mail</dt>
              <dd>{user.email || "Não informado"}</dd>
            </div>

            {user.telefone && (
              <div className="profile-detail-row">
                <dt>Telefone</dt>
                <dd>{user.telefone}</dd>
              </div>
            )}
          </dl>
        </div>

        <div className="profile-card">
          <h2 className="profile-card-title">Sessão atual</h2>

          <dl className="profile-detail-list">
            <div className="profile-detail-row">
              <dt>Expira em</dt>
              <dd>
                <span className="profile-session-pill">
                  {tokenInfo?.expiresIn ?? "Não disponível"}
                </span>
              </dd>
            </div>
            <div className="profile-detail-row">
              <dt>Data de expiração</dt>
              <dd>{formatDate(tokenInfo?.expiresAt)}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="profile-danger-zone">
        <div>
          <h3>Encerrar todas as sessões</h3>
          <p>Isso vai desconectar sua conta em todos os dispositivos conectados.</p>
        </div>
        <button
          type="button"
          className="profile-logout-outline-btn"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? "Saindo..." : "Sair de todos os dispositivos"}
        </button>
      </section>
    </main>
  );
}