import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/contexts/useAuth';
import AdminLayout from '@/shared/AdminLayout/AdminLayout';
import { listProducts, deleteProduct } from '@/app/services/productService';
import { showNotification } from '@/app/services/notificationService';
import { Plus, Pencil, Trash2, Package, Search, DollarSign, Box, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/shared/utils/formatCurrency';
import './AdminProducts.css';

export default function AdminProducts() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user && user.role !== 'admin') {
      navigate('/');
      return;
    }

    loadProducts();
  }, [isAuthenticated, user, navigate]);

  async function loadProducts() {
    try {
      setLoading(true);
      const data = await listProducts();
      setProducts(data);
    } catch (error) {
      showNotification('Erro ao carregar produtos', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Tem certeza que deseja desativar este produto?')) {
      return;
    }

    try {
      await deleteProduct(id);
      showNotification('Produto desativado com sucesso', 'success');
      loadProducts();
    } catch (error) {
      showNotification('Erro ao desativar produto', 'error');
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = !searchTerm || 
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || 
      (statusFilter === 'active' && product.is_active) ||
      (statusFilter === 'inactive' && !product.is_active);
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: products.length,
    active: products.filter(p => p.is_active).length,
    inactive: products.filter(p => !p.is_active).length,
    totalValue: products.reduce((acc, p) => acc + (p.price * (p.stock_quantity || 0)), 0),
    avgPrice: products.length > 0 ? products.reduce((acc, p) => acc + p.price, 0) / products.length : 0,
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  return (
    <AdminLayout>
      <div className="ap-admin-products-header">
        <div className="ap-admin-products-title">
          <h1>Gerenciar Produtos</h1>
          <p>Visualize e gerencie o catálogo de produtos.</p>
        </div>
        <button
          onClick={() => navigate('/dashboard/products/new')}
          className="ap-btn ap-btn-primary"
        >
          <Plus size={18} />
          Novo Produto
        </button>
      </div>

      <div className="ap-admin-products-stats">
        <div className="ap-stat-card">
          <Package size={20} />
          <div>
            <span className="ap-stat-label">Total</span>
            <span className="ap-stat-value">{stats.total}</span>
          </div>
        </div>
        <div className="ap-stat-card ap-stat-card--green">
          <TrendingUp size={20} />
          <div>
            <span className="ap-stat-label">Ativos</span>
            <span className="ap-stat-value">{stats.active}</span>
          </div>
        </div>
        <div className="ap-stat-card ap-stat-card--orange">
          <Box size={20} />
          <div>
            <span className="ap-stat-label">Inativos</span>
            <span className="ap-stat-value">{stats.inactive}</span>
          </div>
        </div>
        <div className="ap-stat-card ap-stat-card--blue">
          <DollarSign size={20} />
          <div>
            <span className="ap-stat-label">Valor Total</span>
            <span className="ap-stat-value">{formatCurrency(stats.totalValue)}</span>
          </div>
        </div>
      </div>

      <div className="ap-admin-products-filters">
        <div className="ap-search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Buscar por nome ou SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="ap-filter-box">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Todos os status</option>
            <option value="active">Ativos</option>
            <option value="inactive">Inativos</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="ap-loading-state">
          <p>Carregando produtos...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="ap-empty-state">
          <Package size={48} />
          <p>{products.length === 0 ? 'Nenhum produto cadastrado' : 'Nenhum produto encontrado'}</p>
          {products.length === 0 && (
            <button
              onClick={() => navigate('/dashboard/products/new')}
              className="ap-btn ap-btn-primary"
            >
              Criar Primeiro Produto
            </button>
          )}
        </div>
      ) : (
        <div className="ap-products-table-wrapper">
          <table className="ap-products-table-data">
            <thead>
              <tr>
                <th>Nome</th>
                <th>SKU</th>
                <th>Preço</th>
                <th>Estoque</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td className="ap-product-name">
                    <div className="ap-product-name-content">
                      <span className="ap-name">{product.name}</span>
                      {product.description && (
                        <span className="ap-description">{product.description}</span>
                      )}
                    </div>
                  </td>
                  <td className="ap-product-sku">
                    <code>{product.sku || 'N/A'}</code>
                  </td>
                  <td className="ap-product-price">
                    <DollarSign size={14} />
                    {formatCurrency(product.price)}
                  </td>
                  <td className="ap-product-stock">
                    <Box size={14} />
                    {product.stock_quantity || 0}
                  </td>
                  <td className="ap-product-status">
                    <span className={`ap-status-badge ${product.is_active ? 'ap-status-active' : 'ap-status-inactive'}`}>
                      {product.is_active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="ap-product-actions">
                    <button
                      onClick={() => navigate(`/dashboard/products/${product.id}`)}
                      className="ap-action-btn ap-action-btn--edit"
                      title="Editar"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="ap-action-btn ap-action-btn--delete"
                      title="Desativar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}