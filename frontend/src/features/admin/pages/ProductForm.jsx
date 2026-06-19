import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/app/contexts/useAuth';
import AdminLayout from '@/shared/AdminLayout/AdminLayout';
import { getProduct, createProduct, updateProduct } from '@/app/services/productService';
import { showNotification } from '@/app/services/notificationService';
import { ArrowLeft, Save, Image as ImageIcon } from 'lucide-react';
import './ProductForm.css';

export default function ProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    cost_price: '',
    category_id: '',
    stock_quantity: '',
    is_active: true,
  });

  const isEditing = Boolean(id);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user && user.role !== 'admin') {
      navigate('/');
      return;
    }

    if (isEditing) {
      loadProduct();
    }
  }, [isAuthenticated, user, navigate, isEditing, id]);

  async function loadProduct() {
    try {
      setLoading(true);
      const product = await getProduct(Number(id));
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        cost_price: product.cost_price || '',
        category_id: product.category_id || '',
        stock_quantity: product.stock_quantity || '',
        is_active: product.is_active !== undefined ? product.is_active : true,
      });
    } catch (error) {
      showNotification('Erro ao carregar produto', 'error');
      navigate('/dashboard/products');
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setSubmitting(true);

      const payload = {
        name: formData.name,
        description: formData.description || null,
        price: Number(formData.price),
        cost_price: formData.cost_price ? Number(formData.cost_price) : null,
        category_id: formData.category_id ? Number(formData.category_id) : null,
        stock_quantity: formData.stock_quantity ? Number(formData.stock_quantity) : 0,
        is_active: formData.is_active,
      };

      if (isEditing) {
        await updateProduct(Number(id), payload);
        showNotification('Produto atualizado com sucesso', 'success');
      } else {
        await createProduct(payload);
        showNotification('Produto criado com sucesso', 'success');
      }

      navigate('/dashboard/products');
    } catch (error) {
      showNotification(error.message || 'Erro ao salvar produto', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  return (
    <AdminLayout>
      <div className="product-form-container">
        <div className="form-header">
          <button
            onClick={() => navigate('/dashboard/products')}
            className="btn btn-secondary"
          >
            <ArrowLeft size={18} />
            Voltar
          </button>
          <h1>{isEditing ? 'Editar Produto' : 'Novo Produto'}</h1>
          {isEditing && (
            <button
              onClick={() => navigate(`/dashboard/products/${id}/media`)}
              className="btn btn-secondary"
            >
              <ImageIcon size={18} />
              Gerenciar Mídias
            </button>
          )}
        </div>

        {loading ? (
          <div className="loading">Carregando...</div>
        ) : (
          <form onSubmit={handleSubmit} className="product-form">
            <div className="form-group">
              <label htmlFor="name">Nome *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Nome do produto"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Descrição</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Descrição do produto"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Preço de Venda *</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>

              <div className="form-group">
                <label htmlFor="cost_price">Preço de Custo</label>
                <input
                  type="number"
                  id="cost_price"
                  name="cost_price"
                  value={formData.cost_price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category_id">Categoria ID</label>
                <input
                  type="number"
                  id="category_id"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  min="1"
                  placeholder="ID da categoria"
                />
              </div>

              <div className="form-group">
                <label htmlFor="stock_quantity">Quantidade em Estoque</label>
                <input
                  type="number"
                  id="stock_quantity"
                  name="stock_quantity"
                  value={formData.stock_quantity}
                  onChange={handleChange}
                  min="0"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="form-group checkbox-group">
              <label htmlFor="is_active" className="checkbox-label">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                />
                <span>Produto Ativo</span>
              </label>
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate('/dashboard/products')}
                className="btn btn-secondary"
                disabled={submitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                <Save size={18} />
                {submitting ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar'}
              </button>
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
}
