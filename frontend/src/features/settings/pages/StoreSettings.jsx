import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save } from 'lucide-react';
import { useAuth } from '@/app/contexts/useAuth';
import AdminLayout from '@/shared/AdminLayout/AdminLayout';
import { showNotification } from '@/app/services/notificationService';
import {
  fetchStoreSettings,
  updateStoreSettings,
} from '../services/settingsService';
import './StoreSettings.css';

const INITIAL_FORM = {
  store_name: '',
  description: '',
  email: '',
  whatsapp: '',
  instagram: '',
  address: '',
};

export default function StoreSettings() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user && user.role !== 'admin') {
      navigate('/');
      return;
    }

    loadSettings();
  }, [isAuthenticated, user, navigate]);

  async function loadSettings() {
    try {
      setLoading(true);
      const data = await fetchStoreSettings();

      setFormData({
        store_name: data.store_name || '',
        description: data.description || '',
        email: data.email || '',
        whatsapp: data.whatsapp || '',
        instagram: data.instagram || '',
        address: data.address || '',
      });
    } catch (error) {
      showNotification(error.message || 'Erro ao carregar configurações', 'error');
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSubmitting(true);
      await updateStoreSettings(formData);
      showNotification('Configurações salvas com sucesso.', 'success');
    } catch (error) {
      showNotification(error.message || 'Erro ao salvar configurações', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  return (
    <AdminLayout>
      <div className="store-settings">
        <header className="store-settings__header">
          <h1>Configurações da Loja</h1>
          <p>Defina as informações exibidas no site e no rodapé.</p>
        </header>

        {loading ? (
          <p className="store-settings__status">Carregando configurações...</p>
        ) : (
          <form className="store-settings__form" onSubmit={handleSubmit}>
            <section className="store-settings__section">
              <h2>Identidade</h2>

              <label className="store-settings__field">
                <span>Nome da loja</span>
                <input
                  type="text"
                  name="store_name"
                  value={formData.store_name}
                  onChange={handleChange}
                  placeholder="Ex: SaborFit"
                  maxLength={255}
                />
              </label>

              <label className="store-settings__field">
                <span>Descrição</span>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Breve descrição exibida no rodapé"
                  rows={4}
                />
              </label>
            </section>

            <section className="store-settings__section">
              <h2>Contato</h2>

              <label className="store-settings__field">
                <span>E-mail</span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="contato@sualoja.com.br"
                />
              </label>

              <label className="store-settings__field">
                <span>WhatsApp</span>
                <input
                  type="text"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="5511999999999"
                  maxLength={30}
                />
                <small>Apenas números, com DDI e DDD (ex: 5511999999999)</small>
              </label>

              <label className="store-settings__field">
                <span>Endereço</span>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Cidade, Estado"
                />
              </label>
            </section>

            <section className="store-settings__section">
              <h2>Redes sociais</h2>

              <label className="store-settings__field">
                <span>Instagram</span>
                <input
                  type="text"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                  placeholder="usuario ou @usuario"
                  maxLength={255}
                />
              </label>
            </section>

            <div className="store-settings__actions">
              <button
                type="submit"
                className="store-settings__submit"
                disabled={submitting}
              >
                <Save size={18} />
                {submitting ? 'Salvando...' : 'Salvar configurações'}
              </button>
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
}
