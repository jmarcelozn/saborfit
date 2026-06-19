import { Star, Trash2, GripVertical, Image as ImageIcon, Video, MoveUp, MoveDown } from 'lucide-react';
import './MediaGallery.css';

export default function MediaGallery({ mediaList, onSetPrimary, onDelete }) {
  if (!mediaList || mediaList.length === 0) {
    return null;
  }

  return (
    <div className="media-gallery">
      <div className="gallery-header">
        <h3>Mídias Cadastradas ({mediaList.length})</h3>
      </div>

      <div className="media-grid">
        {mediaList.map((media, index) => (
          <div key={media.id} className={`media-card ${media.is_primary ? 'primary' : ''}`}>
            <div className="media-thumbnail">
              {media.resource_type === 'video' ? (
                <video src={media.secure_url} className="thumbnail-media" />
              ) : (
                <img src={media.secure_url} alt={media.public_id} className="thumbnail-media" />
              )}
              
              {media.is_primary && (
                <div className="primary-badge">
                  <Star size={14} fill="currentColor" />
                  Principal
                </div>
              )}
            </div>

            <div className="media-info">
              <div className="media-type">
                {media.resource_type === 'video' ? (
                  <Video size={14} />
                ) : (
                  <ImageIcon size={14} />
                )}
                <span>{media.format?.toUpperCase() || 'N/A'}</span>
              </div>

              <div className="media-dimensions">
                {media.width && media.height && (
                  <span>{media.width}x{media.height}px</span>
                )}
                {media.bytes && (
                  <span>{(media.bytes / 1024).toFixed(1)} KB</span>
                )}
              </div>
            </div>

            <div className="media-actions">
              {!media.is_primary && (
                <button
                  onClick={() => onSetPrimary(media.id)}
                  className="btn-action btn-primary"
                  title="Definir como principal"
                >
                  <Star size={16} />
                </button>
              )}
              
              <button
                onClick={() => onDelete(media.id)}
                className="btn-action btn-delete"
                title="Excluir"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
