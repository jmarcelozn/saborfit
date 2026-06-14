import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function formatDuration(seconds) {
  if (seconds === null || seconds === undefined) return 'Não disponível';
  if (seconds <= 0) return 'Expirado';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts = [];
  if (hours) parts.push(`${hours}h`);
  if (minutes) parts.push(`${minutes}m`);
  if (secs || parts.length === 0) parts.push(`${secs}s`);
  return parts.join(' ');
}

export default function Profile() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logoutAll } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
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
      await logoutAll();
      navigate('/login');
    } catch (err) {
      console.error(err);
      alert(err.message || 'Erro ao sair');
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Meu Perfil</h1>
          <p>Bem-vindo, {user.nome}!</p>
        </div>

        <button type="button" onClick={handleLogout} style={{ padding: '0.75rem 1rem' }}>
          Logout
        </button>
      </div>

      <section style={{ marginTop: '1.5rem' }}>
        <h2>Informações da sessão</h2>
        <p>Token expira em: <strong>{tokenInfo?.expiresIn}</strong></p>
        <p>Expira em: <strong>{tokenInfo?.expiresAt || 'Não disponível'}</strong></p>
      </section>

      <section style={{ marginTop: '1.5rem' }}>
        <h2>Dados do usuário</h2>
        <p>Função: <strong>{user.role || 'user'}</strong></p>
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </section>
    </main>
  );
}
