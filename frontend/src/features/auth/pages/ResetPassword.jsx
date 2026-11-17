import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, CheckCircle2, KeyRound, LockKeyhole } from 'lucide-react';
import { apiFetch } from '@/app/services/api';
import { getErrorMessage } from '@/app/services/errorHandler';
import { ROUTES } from '@/app/config/routes';
import AuthLayout from '../components/AuthLayout';
import '@/styles/pages/auth.css';

export default function ResetPassword() {
  const [token, setToken] = useState('');
  const [senha, setSenha] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setMessage('');
    setIsSubmitting(true);
    try {
      const data = await apiFetch('/reset-password', { method: 'POST', body: JSON.stringify({ token, senha }) });
      setMessage(data.message);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout mode="reset-password">
      <header className="auth-header">
        <span className="auth-kicker">Novo acesso</span>
        <h1>Crie uma<br />nova senha.</h1>
        <p>Use o código recebido por e-mail e escolha uma senha segura para sua conta.</p>
      </header>
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group"><label htmlFor="reset-token">Código de recuperação</label><div className="auth-input"><KeyRound size={18} aria-hidden="true" /><input id="reset-token" autoComplete="one-time-code" placeholder="Cole o código recebido" value={token} onChange={(event) => setToken(event.target.value)} required /></div></div>
        <div className="form-group"><label htmlFor="reset-password">Nova senha</label><div className="auth-input"><LockKeyhole size={18} aria-hidden="true" /><input id="reset-password" type="password" autoComplete="new-password" placeholder="Mínimo de 6 caracteres" value={senha} onChange={(event) => setSenha(event.target.value)} minLength={6} required /></div></div>
        {error && <p className="field-error" role="alert"><AlertCircle size={17} /><span>{error}</span></p>}
        {message && <p className="field-success" role="status"><CheckCircle2 size={17} /><span>{message}</span></p>}
        <button className="auth-submit" type="submit" disabled={isSubmitting}><span>{isSubmitting ? 'Atualizando...' : 'Atualizar senha'}</span><i aria-hidden="true">→</i></button>
      </form>
      <p className="auth-switch"><Link to={ROUTES.LOGIN}>Voltar ao login</Link></p>
    </AuthLayout>
  );
}
