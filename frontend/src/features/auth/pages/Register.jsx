import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Eye, EyeOff, LockKeyhole, Mail, UserRound } from 'lucide-react';
import { useAuth } from '@/app/contexts/useAuth';
import { ROUTES } from '@/app/config/routes';
import { getErrorMessage } from '@/app/services/errorHandler';
import AuthLayout from '../components/AuthLayout';
import '@/styles/pages/auth.css';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ nome: '', email: '', senha: '' });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (field) => (event) => {
    setForm((previous) => ({ ...previous, [field]: event.target.value }));
    if (error) setError('');
  };

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsSubmitting(true);
    try {
      const data = await register(form);
      if (data?.data?.user) {
        navigate('/', { replace: true });
        return;
      }
      setSuccessMessage(data?.message || 'Conta criada com sucesso!');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout mode="register">
      <header className="auth-header">
        <span className="auth-kicker">Comece por aqui</span>
        <h1>Crie sua<br />conta.</h1>
        <p>Leva menos de um minuto e deixa seus próximos pedidos muito mais simples.</p>
      </header>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group"><label htmlFor="register-name">Nome completo</label><div className="auth-input"><UserRound size={18} aria-hidden="true" /><input id="register-name" type="text" autoComplete="name" placeholder="Como podemos chamar você?" value={form.nome} onChange={handleChange('nome')} required /></div></div>
        <div className="form-group"><label htmlFor="register-email">E-mail</label><div className="auth-input"><Mail size={18} aria-hidden="true" /><input id="register-email" type="email" autoComplete="email" placeholder="seuemail@exemplo.com" value={form.email} onChange={handleChange('email')} required /></div></div>
        <div className="form-group"><label htmlFor="register-password">Senha</label><div className="auth-input"><LockKeyhole size={18} aria-hidden="true" /><input id="register-password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="Crie uma senha segura" value={form.senha} onChange={handleChange('senha')} minLength={6} required /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div><span className="field-hint">Use pelo menos 6 caracteres.</span></div>

        {error && <p className="field-error" role="alert"><AlertCircle size={17} /><span>{error}</span></p>}
        {successMessage && <p className="field-success" role="status"><CheckCircle2 size={17} /><span>{successMessage}</span></p>}

        <button type="submit" className="auth-submit" disabled={isSubmitting}><span>{isSubmitting ? 'Criando conta...' : 'Criar minha conta'}</span><i aria-hidden="true">→</i></button>
      </form>

      <p className="auth-terms">Ao criar sua conta, você concorda com o uso dos seus dados para processar seus pedidos.</p>
      <p className="auth-switch">Já possui uma conta? <Link to={ROUTES.LOGIN}>Entrar</Link></p>
    </AuthLayout>
  );
}
