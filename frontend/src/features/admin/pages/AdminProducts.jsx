import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/contexts/useAuth';
import AdminLayout from '@/shared/AdminLayout/AdminLayout';
import { listProducts, deleteProduct } from '@/app/services/productService';
import { showNotification } from '@/app/services/notificationService';
import { Plus, Pencil, Trash2, Package } from 'lucide-react';
import './AdminProducts.css';

export default function AdminProducts() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  return (
    <AdminLayout>
      <div className="admin-header">
        <h1>Gerenciar Produtos</h1>
        <button
          onClick={() => navigate('/dashboard/products/new')}
          className="btn btn-primary"
        >
          <Plus size={18} />
          Novo Produto
        </button>
      </div>

      {loading ? (
        <div className="loading">Carregando...</div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <Package size={48} />
          <p>Nenhum produto cadastrado</p>
          <button
            onClick={() => navigate('/dashboard/products/new')}
            className="btn btn-primary"
          >
            Criar Primeiro Produto
          </button>
        </div>
      ) : (
        <div className="products-table">
          <table>
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
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>
                    <code>{product.sku}</code>
                  </td>
                  <td>R$ {Number(product.price).toFixed(2)}</td>
                  <td>{product.stock_quantity || 0}</td>
                  <td>
                    <span className={`status ${product.is_active ? 'active' : 'inactive'}`}>
                      {product.is_active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="actions">
                    <button
                      onClick={() => navigate(`/dashboard/products/${product.id}`)}
                      className="btn btn-sm btn-secondary"
                      title="Editar"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="btn btn-sm btn-danger"
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
