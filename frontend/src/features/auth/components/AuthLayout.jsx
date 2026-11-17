import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import logo from '@/assets/logo.png';

export default function AuthLayout({ children, mode }) {
  return (
    <main className={`auth-page auth-page--${mode}`}>
      <div className="auth-topbar">
        <Link to="/" className="auth-back"><ArrowLeft size={16} /> Voltar para a loja</Link>
        <Link to="/" className="auth-brand" aria-label="SaborFit — página inicial">
          <img src={logo} alt="" className="auth-logo" />
        </Link>
        <span className="auth-topbar__spacer" aria-hidden="true" />
      </div>

      <section className="auth-shell" aria-label={mode === 'register' ? 'Criar conta' : 'Acessar conta'}>
        <div className="auth-form-wrap">{children}</div>
      </section>

      <p className="auth-copyright">© {new Date().getFullYear()} SaborFit</p>
    </main>
  );
}
