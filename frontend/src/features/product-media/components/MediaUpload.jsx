import { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import './MediaUpload.css';

export default function MediaUpload({ onUpload, uploading }) {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  function handleFileSelect(file) {
    if (!file) return;

    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      alert('Por favor, selecione apenas imagens ou vídeos');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('O arquivo deve ter no máximo 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    onUpload(file);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  }

  function handleInputChange(e) {
    const file = e.target.files[0];
    handleFileSelect(file);
  }

  function clearPreview() {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  return (
    <div className="media-upload">
      <div className="upload-header">
        <h3>Enviar Mídia</h3>
        <p className="upload-hint">Imagens e vídeos (máx. 10MB)</p>
      </div>

      <div
        className={`upload-zone ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragActive(false);
        }}
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {uploading ? (
          <div className="upload-loading">
            <Loader2 className="spinner" size={32} />
            <p>Enviando...</p>
          </div>
        ) : preview ? (
          <div className="upload-preview">
            {preview.startsWith('data:video') ? (
              <video src={preview} controls className="preview-media" />
            ) : (
              <img src={preview} alt="Preview" className="preview-media" />
            )}
            <button
              type="button"
              className="clear-preview"
              onClick={(e) => {
                e.stopPropagation();
                clearPreview();
              }}
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="upload-prompt">
            <Upload size={32} />
            <p>Arraste e solte ou clique para selecionar</p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          onChange={handleInputChange}
          disabled={uploading}
          className="file-input"
        />
      </div>

      <div className="upload-info">
        <div className="info-item">
          <ImageIcon size={16} />
          <span>Formatos: JPG, PNG, WebP, MP4</span>
        </div>
        <div className="info-item">
          <span>Tamanho máximo: 10MB</span>
        </div>
      </div>
    </div>
  );
}
