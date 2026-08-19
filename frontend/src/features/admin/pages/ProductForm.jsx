import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/app/contexts/useAuth';
import AdminLayout from '@/shared/AdminLayout/AdminLayout';
import { getProduct, createProduct, updateProduct } from '@/app/services/productService';
import { showNotification } from '@/app/services/notificationService';
import { ArrowLeft, Save, Image as ImageIcon, Package, DollarSign, Tag, Box, ToggleRight } from 'lucide-react';
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
      <div className="pf-product-form-container">
        <div className="pf-form-header">
          <div className="pf-form-header-left">
            <button
              onClick={() => navigate('/dashboard/products')}
              className="pf-btn pf-btn-secondary"
            >
              <ArrowLeft size={18} />
              Voltar
            </button>
            <div className="pf-form-header-title">
              <h1>{isEditing ? 'Editar Produto' : 'Novo Produto'}</h1>
              <p>{isEditing ? 'Atualize as informações do produto' : 'Preencha os dados para criar um novo produto'}</p>
            </div>
          </div>
          {isEditing && (
            <button
              onClick={() => navigate(`/dashboard/products/${id}/media`)}
              className="pf-btn pf-btn-secondary"
            >
              <ImageIcon size={18} />
              Gerenciar Mídias
            </button>
          )}
        </div>

        {loading ? (
          <div className="pf-loading-state">
            <p>Carregando produto...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="pf-product-form">
            <div className="pf-form-section">
              <div className="pf-form-section-header">
                <Package size={20} />
                <h3>Informações Básicas</h3>
              </div>

              <div className="pf-form-grid">
                <div className="pf-form-group pf-form-group--full">
                  <label htmlFor="name">
                    Nome do Produto <span className="pf-required">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Ex: Whey Protein 1kg"
                  />
                </div>

                <div className="pf-form-group pf-form-group--full">
                  <label htmlFor="description">Descrição</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Descreva o produto, suas características, benefícios..."
                  />
                </div>
              </div>
            </div>

            <div className="pf-form-section">
              <div className="pf-form-section-header">
                <DollarSign size={20} />
                <h3>Precificação</h3>
              </div>

              <div className="pf-form-grid">
                <div className="pf-form-group">
                  <label htmlFor="price">
                    Preço de Venda <span className="pf-required">*</span>
                  </label>
                  <div className="pf-input-with-icon">
                    <span className="pf-input-icon">R$</span>
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
                </div>

                <div className="pf-form-group">
                  <label htmlFor="cost_price">Preço de Custo</label>
                  <div className="pf-input-with-icon">
                    <span className="pf-input-icon">R$</span>
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
              </div>
            </div>

            <div className="pf-form-section">
              <div className="pf-form-section-header">
                <Tag size={20} />
                <h3>Categoria e Estoque</h3>
              </div>

              <div className="pf-form-grid">
                <div className="pf-form-group">
                  <label htmlFor="category_id">ID da Categoria</label>
                  <input
                    type="number"
                    id="category_id"
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    min="1"
                    placeholder="1"
                  />
                </div>

                <div className="pf-form-group">
                  <label htmlFor="stock_quantity">Quantidade em Estoque</label>
                  <div className="pf-input-with-icon">
                    <Box size={18} className="pf-input-icon" />
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
              </div>
            </div>

            <div className="pf-form-section">
              <div className="pf-form-section-header">
                <ToggleRight size={20} />
                <h3>Status</h3>
              </div>

              <div className="pf-status-row">
                <div className="pf-status-info">
                  <span className="pf-status-title">Produto Ativo</span>
                  <p className="pf-status-description">
                    Produtos ativos são visíveis para os clientes no catálogo
                  </p>
                </div>

                <div className="pf-status-control">
                  <span
                    className={`pf-status-badge ${
                      formData.is_active ? 'pf-status-badge--active' : 'pf-status-badge--inactive'
                    }`}
                  >
                    {formData.is_active ? 'Ativo' : 'Inativo'}
                  </span>
                  <label className="pf-toggle-switch">
                    <input
                      type="checkbox"
                      id="is_active"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleChange}
                    />
                    <span className="pf-toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>

            <div className="pf-form-actions">
              <button
                type="button"
                onClick={() => navigate('/dashboard/products')}
                className="pf-btn pf-btn-secondary"
                disabled={submitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="pf-btn pf-btn-primary"
                disabled={submitting}
              >
                <Save size={18} />
                {submitting ? 'Salvando...' : isEditing ? 'Atualizar Produto' : 'Criar Produto'}
              </button>
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
}