import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/contexts/useAuth';
import AdminLayout from '@/shared/AdminLayout/AdminLayout';
import { getProductMedia, uploadProductMedia, setPrimaryMedia, deleteMedia } from '../services/productMediaService';
import { showNotification } from '@/app/services/notificationService';
import MediaUpload from '../components/MediaUpload';
import MediaGallery from '../components/MediaGallery';
import { ArrowLeft, Upload, Image as ImageIcon } from 'lucide-react';
import './ProductMediaManager.css';

export default function ProductMediaManager() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user && user.role !== 'admin') {
      navigate('/');
      return;
    }

    if (!productId || isNaN(productId)) {
      showNotification('ID do produto inválido', 'error');
      navigate('/dashboard/products');
      return;
    }

    loadMedia();
  }, [isAuthenticated, user, navigate, productId]);

  async function loadMedia() {
    try {
      setLoading(true);
      const data = await getProductMedia(productId);
      setMediaList(data);
    } catch (error) {
      showNotification('Erro ao carregar mídias', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(file) {
    try {
      setUploading(true);
      const result = await uploadProductMedia(productId, file);
      showNotification('Mídia enviada com sucesso', 'success');
      loadMedia();
      return result;
    } catch (error) {
      showNotification(error.message || 'Erro ao enviar mídia', 'error');
      throw error;
    } finally {
      setUploading(false);
    }
  }

  async function handleSetPrimary(mediaId) {
    try {
      await setPrimaryMedia(mediaId);
      showNotification('Imagem principal definida', 'success');
      loadMedia();
    } catch (error) {
      showNotification('Erro ao definir imagem principal', 'error');
    }
  }

  async function handleDelete(mediaId) {
    if (!confirm('Tem certeza que deseja excluir esta mídia?')) {
      return;
    }

    try {
      await deleteMedia(mediaId);
      showNotification('Mídia excluída com sucesso', 'success');
      loadMedia();
    } catch (error) {
      showNotification('Erro ao excluir mídia', 'error');
    }
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  return (
    <AdminLayout>
      <div className="media-manager-header">
        <button
          onClick={() => navigate('/dashboard/products')}
          className="btn btn-secondary"
        >
          <ArrowLeft size={18} />
          Voltar
        </button>
        <h1>Gerenciar Mídias do Produto #{productId}</h1>
      </div>

      <div className="media-manager-content">
        <div className="upload-section">
          <MediaUpload onUpload={handleUpload} uploading={uploading} />
        </div>

        <div className="gallery-section">
          {loading ? (
            <div className="loading">Carregando mídias...</div>
          ) : mediaList.length === 0 ? (
            <div className="empty-state">
              <ImageIcon size={48} />
              <p>Nenhuma mídia cadastrada</p>
              <p className="hint">Envie imagens para começar</p>
            </div>
          ) : (
            <MediaGallery
              mediaList={mediaList}
              onSetPrimary={handleSetPrimary}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
