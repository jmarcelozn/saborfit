import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, CakeSlice } from 'lucide-react';
import { ROUTES } from '@/app/config/routes';
import '@/styles/pages/error.css';

export default function ErrorPage() {
  const location = useLocation();
  const status = location.state?.status || 404;
  const isNotFound = status === 404;
  const message = location.state?.message || (isNotFound ? 'A página que você procura não foi encontrada.' : 'Ocorreu um erro ao carregar esta página.');

  return (
    <main className="error-page" id="main-content">
      <div className="error-card">
        <span className="error-icon"><CakeSlice size={25} /></span>
        <span className="error-status">Erro {status}</span>
        <h1 className="error-title">{isNotFound ? 'Esta fatia não existe.' : 'Algo não saiu como esperado.'}</h1>
        <p className="error-message">{message}</p>
        <Link className="error-action" to={ROUTES.HOME}><ArrowLeft size={17} /> Voltar para a página inicial</Link>
      </div>
    </main>
  );
}
