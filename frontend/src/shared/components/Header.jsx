import { User, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/app/contexts/useAuth';
import { useCart } from '@/app/contexts/useCart';
import { ROUTES } from '@/app/config/routes';
import logo from '@/assets/logo.png';
import '../../styles/components/Header.css';

function Header() {
  const { isAuthenticated } = useAuth();
  const { itemCount } = useCart();

  return (
    <>
      <header className="main-header">
        <div className="header-container">

          <div className="logo-container">
            <Link
              to="/"
              className="logo-link"
              aria-label="Ir para o início"
            >
              <img
                src={logo}
                alt="SaborFit"
                className="logo-image"
              />
            </Link>
          </div>

          <nav className="header-nav" aria-label="Navegação principal">
            <Link to={ROUTES.MENU}>Cardápio</Link>
            <Link to="/#encomendas">Como encomendar</Link>
          </nav>

          <div className="header-actions">
            <Link
              to={isAuthenticated ? '/profile' : '/login'}
              className="header-icon-link"
            >
              <User size={20} strokeWidth={1.5} />
              <span>
                {isAuthenticated
                  ? 'Meu perfil'
                  : 'Fazer login'}
              </span>
            </Link>

            <Link
              to={ROUTES.CART}
              className="header-cart"
            >
              <ShoppingBag
                size={22}
                strokeWidth={1.5}
              />

              {itemCount > 0 && (
                <span className="cart-badge">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>

        </div>
      </header>

      <div className="header-announcement">
        ✦ Encomendas com antecedência mínima de 2 dias
      </div>
    </>
  );
}

export default Header;
