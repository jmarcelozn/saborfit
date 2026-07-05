import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/contexts/useAuth';
import AdminLayout from '@/shared/AdminLayout/AdminLayout';
import { listProducts } from '@/app/services/productService';
import {
  Package,
  Users,
  ShoppingBag,
  Settings,
  AlertTriangle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import './Admin.css';

const LOW_STOCK_THRESHOLD = 5;

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

export default function Admin() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [products, setProducts] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user && user.role !== 'admin') {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') return;

    let cancelled = false;

    async function loadStats() {
      try {
        setStatsLoading(true);
        setStatsError(false);
        const data = await listProducts();
        if (!cancelled) setProducts(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelled) setStatsError(true);
      } finally {
        if (!cancelled) setStatsLoading(false);
      }
    }

    loadStats();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, user]);

  const stats = useMemo(() => {
    const total = products.length;
    const active = products.filter((p) => p.is_active).length;
    const lowStock = products.filter(
      (p) => (p.stock_quantity ?? 0) <= LOW_STOCK_THRESHOLD
    ).length;
    return { total, active, lowStock };
  }, [products]);

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  const quickLinks = [
    {
      label: 'Produtos',
      description: 'Cadastre, edite e organize o catálogo',
      icon: Package,
      to: '/dashboard/products',
    },
    {
      label: 'Pedidos',
      description: 'Acompanhe e atualize o status dos pedidos',
      icon: ShoppingBag,
      to: '/dashboard/orders',
    },
    {
      label: 'Usuários',
      description: 'Veja quem está cadastrado na plataforma',
      icon: Users,
      to: '/dashboard/users',
    },
    {
      label: 'Configurações',
      description: 'Dados da loja e informações de contato',
      icon: Settings,
      to: '/dashboard/settings',
    },
  ];

  return (
    <AdminLayout>
      <div className="admin-home">
        <section className="admin-hero">
          <div className="admin-hero-decoration" aria-hidden="true">
            <svg viewBox="0 0 200 200" fill="none">
              <path
                d="M100 20c44 0 80 36 80 80s-36 80-80 80-80-36-80-80 22-64 40-72 24-8 40-8Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div className="admin-hero-content">
            <span className="admin-eyebrow">
              <Sparkles size={14} />
              Painel de Administração
            </span>
            <h1>{getGreeting()}, {user.nome?.split(' ')[0] || 'admin'}.</h1>
            <p>Aqui está um resumo rápido da operação do SaborFit hoje.</p>
          </div>
        </section>

        <section className="admin-stats" aria-label="Estatísticas gerais">
          <div className="stat-card">
            <span className="stat-label">Produtos cadastrados</span>
            <span className="stat-value">
              {statsLoading ? '—' : statsError ? '–' : stats.total}
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Produtos ativos</span>
            <span className="stat-value">
              {statsLoading ? '—' : statsError ? '–' : stats.active}
            </span>
          </div>
          <div className={`stat-card ${stats.lowStock > 0 ? 'stat-card-alert' : ''}`}>
            <span className="stat-label">
              {stats.lowStock > 0 && <AlertTriangle size={14} />}
              Estoque baixo
            </span>
            <span className="stat-value">
              {statsLoading ? '—' : statsError ? '–' : stats.lowStock}
            </span>
          </div>
        </section>

        {statsError && (
          <p className="admin-stats-error">
            Não foi possível carregar as estatísticas de produtos agora.
          </p>
        )}

        <section className="admin-section">
          <h2>Acesso rápido</h2>
          <div className="admin-quick-grid">
            {quickLinks.map(({ label, description, icon: Icon, to }) => (
              <button
                key={to}
                type="button"
                className="quick-card"
                onClick={() => navigate(to)}
              >
                <span className="quick-card-icon">
                  <Icon size={20} />
                </span>
                <span className="quick-card-text">
                  <strong>{label}</strong>
                  <span>{description}</span>
                </span>
                <ArrowRight size={16} className="quick-card-arrow" />
              </button>
            ))}
          </div>
        </section>

        <section className="admin-section">
          <h2>Sua conta</h2>
          <div className="account-card">
            <div className="account-avatar">{getInitials(user.nome)}</div>
            <div className="account-info">
              <div className="account-row">
                <span className="account-key">Nome</span>
                <span className="account-value">{user.nome}</span>
              </div>
              <div className="account-row">
                <span className="account-key">Email</span>
                <span className="account-value">{user.email}</span>
              </div>
              <div className="account-row">
                <span className="account-key">Função</span>
                <span className="account-badge">{user.role}</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}