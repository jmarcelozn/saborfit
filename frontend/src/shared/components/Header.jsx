import { Home, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/app/contexts/useAuth';
import logo from '@/assets/logo.png';
import '../../styles/components/Header.css';

function Header() {
  const { isAuthenticated, user } = useAuth();

  return (
    <header className="main-header">
      <div className="logo-container">
        <Link to="/" className="logo-link" aria-label="Ir para o início">
          <img
            src={logo}
            alt="SaborFit"
            className="logo-image"
          />
        </Link>
      </div>

      <nav className="nav-links">
        <Link to="/" className="nav-item">
          <Home size={18} strokeWidth={1.5} className="nav-icon" />
          <span>Início</span>
        </Link>

        {isAuthenticated ? (
          <>
            {user?.role === 'admin' && (
              <Link to="/admin" className="nav-item admin-link">
                <span>Admin</span>
              </Link>
            )}

            <Link to="/profile" className="nav-item profile-active">
              <User size={18} strokeWidth={1.5} className="nav-icon" />
              <span>
                {user?.nome ? `Perfil (${user.nome})` : 'Perfil'}
              </span>
            </Link>
          </>
        ) : (
          <Link to="/login" className="nav-item auth-btn">
            <User size={18} strokeWidth={1.5} className="nav-icon" />
            <span>Entrar</span>
          </Link>
        )}
      </nav>
    </header>
  );
}

export default Header;