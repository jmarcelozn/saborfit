import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export default function Admin() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user && user.role !== 'admin') {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Painel de Administração</h1>
      <p>Bem-vindo ao painel administrativo do SaborFit.</p>
      <section style={{ marginTop: '1.5rem' }}>
        <h2>Informações de acesso</h2>
        <p>Usuário: <strong>{user.nome}</strong></p>
        <p>Email: <strong>{user.email}</strong></p>
        <p>Função: <strong>{user.role}</strong></p>
      </section>
    </main>
  );
}
