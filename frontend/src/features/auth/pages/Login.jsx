import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react';
import { useAuth } from '@/app/contexts/useAuth';
import { ROUTES } from '@/app/config/routes';
import { getErrorMessage } from '@/app/services/errorHandler';
import AuthLayout from '../components/AuthLayout';
import '@/styles/pages/auth.css';

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();
  const [form, setForm] = useState({ email: '', senha: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate(user?.role === 'admin' ? '/admin' : '/', { replace: true });
  }, [isAuthenticated, user, navigate]);

  const handleChange = (field) => (event) => {
    setForm((previous) => ({ ...previous, [field]: event.target.value }));
    if (error) setError('');
  };

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const result = await login(form.email, form.senha);
      navigate(result?.data?.user?.role === 'admin' ? '/admin' : '/', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout mode="login">
      <header className="auth-header">
        <span className="auth-kicker">Que bom ter você aqui</span>
        <h1>Bem-vindo<br />de volta.</h1>
        <p>Acesse sua conta para acompanhar pedidos e continuar suas escolhas.</p>
      </header>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="login-email">E-mail</label>
          <div className="auth-input"><Mail size={18} aria-hidden="true" /><input id="login-email" type="email" autoComplete="email" placeholder="seuemail@exemplo.com" value={form.email} onChange={handleChange('email')} required /></div>
        </div>
        <div className="form-group">
          <div className="auth-label-row"><label htmlFor="login-password">Senha</label><Link to={ROUTES.FORGOT_PASSWORD}>Esqueci minha senha</Link></div>
          <div className="auth-input"><LockKeyhole size={18} aria-hidden="true" /><input id="login-password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Digite sua senha" value={form.senha} onChange={handleChange('senha')} required /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>
        </div>

        {error && <p className="field-error" role="alert"><AlertCircle size={17} /> <span>{error}</span></p>}

        <button type="submit" className="auth-submit" disabled={isSubmitting}>
          <span>{isSubmitting ? 'Entrando...' : 'Entrar na minha conta'}</span><i aria-hidden="true">→</i>
        </button>
      </form>

      <p className="auth-switch">Ainda não possui uma conta? <Link to={ROUTES.REGISTER}>Criar conta</Link></p>
    </AuthLayout>
  );
}
