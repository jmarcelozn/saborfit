import { useAuth } from "../context/useAuth";

function Home() {
  const { user } = useAuth();

  return (
    <main style={{ padding: '2rem' }}>
      <h1>
        {user ? `Bem-vindo de volta, ${user.nome}!` : 'Bem-vindo ao SaborFit'}
      </h1>
      <p>
        {user
          ? 'Você está autenticado e sua sessão será mantida até o logout ou expiração do token.'
          : 'Sua rotina mais saudável e saborosa.'}
      </p>
      {user?.role === 'admin' && (
        <p style={{ marginTop: '1rem', fontWeight: '600' }}>
          Você é administrador e tem acesso ao painel de gerenciamento.
        </p>
      )}
    </main>
  );
}

export default Home;
