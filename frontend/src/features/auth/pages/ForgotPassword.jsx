import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Mail } from 'lucide-react';
import { apiFetch } from '@/app/services/api';
import { getErrorMessage } from '@/app/services/errorHandler';
import { ROUTES } from '@/app/config/routes';
import AuthLayout from '../components/AuthLayout';
import '@/styles/pages/auth.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setMessage('');
    setIsSubmitting(true);
    try {
      const data = await apiFetch('/forgot-password', { method: 'POST', body: JSON.stringify({ email }) });
      setMessage(data.message);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout mode="forgot-password">
      <header className="auth-header">
        <span className="auth-kicker">Recuperar acesso</span>
        <h1>Esqueceu<br />sua senha?</h1>
        <p>Informe seu e-mail e enviaremos as instruções para você criar uma nova senha.</p>
      </header>
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group"><label htmlFor="recovery-email">E-mail</label><div className="auth-input"><Mail size={18} aria-hidden="true" /><input id="recovery-email" type="email" autoComplete="email" placeholder="seuemail@exemplo.com" value={email} onChange={(event) => setEmail(event.target.value)} required /></div></div>
        {error && <p className="field-error" role="alert"><AlertCircle size={17} /><span>{error}</span></p>}
        {message && <p className="field-success" role="status"><CheckCircle2 size={17} /><span>{message}</span></p>}
        <button className="auth-submit" type="submit" disabled={isSubmitting}><span>{isSubmitting ? 'Enviando...' : 'Enviar instruções'}</span><i aria-hidden="true">→</i></button>
      </form>
      <p className="auth-switch">Lembrou sua senha? <Link to={ROUTES.LOGIN}>Voltar ao login</Link></p>
    </AuthLayout>
  );
}
