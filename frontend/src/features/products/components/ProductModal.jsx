import { useEffect, useState } from 'react';
import { X, ShoppingBag, Check } from 'lucide-react';
import { formatCurrency } from '@/shared/utils/formatCurrency';
import { getProductImage } from '@/shared/utils/getProductImage';
import ProductGallery from './ProductGallery';
import './css/ProductModal.css';

function ProductModal({ product, isOpen, onClose, onAddToCart, isAdding = false }) {
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (product) {
      // Get all product images from media array if available
      const productImages = product.media && product.media.length > 0
        ? product.media.map(m => m.secure_url)
        : [getProductImage(product)];
      setImages(productImages);
    }
  }, [product]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleAddToCart = () => {
    if (typeof onAddToCart === 'function') {
      onAddToCart(product);
    }
  };

  if (!isOpen || !product) {
    return null;
  }

  const name = product?.name || 'Produto';
  const description = product?.description || '';
  const price = product?.price;
  const category = product?.category;
  const stock = product?.stock_quantity;
  const isActive = product?.is_active !== false;

  return (
    <div className="product-modal-overlay" onClick={handleOverlayClick} role="dialog" aria-modal="true">
      <div className="product-modal">
        <button
          type="button"
          className="product-modal__close"
          onClick={onClose}
          aria-label="Fechar modal"
        >
          <X size={24} />
        </button>

        <div className="product-modal__content">
          <div className="product-modal__gallery">
            <ProductGallery images={images} />
          </div>

          <div className="product-modal__info">
            <div className="product-modal__header">
              {category && (
                <span className="product-modal__category">{category}</span>
              )}
              <h2 className="product-modal__title">{name}</h2>
            </div>

            <div className="product-modal__price">
              <span className="product-modal__price-value">
                {formatCurrency(price)}
              </span>
            </div>

            {description && (
              <div className="product-modal__description">
                <h3>Descrição</h3>
                <p>{description}</p>
              </div>
            )}

            <div className="product-modal__availability">
              {isActive ? (
                <div className="product-modal__status product-modal__status--available">
                  <Check size={16} />
                  <span>Disponível</span>
                </div>
              ) : (
                <div className="product-modal__status product-modal__status--unavailable">
                  <span>Indisponível</span>
                </div>
              )}

              {stock !== undefined && stock !== null && (
                <span className="product-modal__stock">
                  {stock > 0 ? `${stock} unidades em estoque` : 'Esgotado'}
                </span>
              )}
            </div>

            <div className="product-modal__actions">
              <button
                type="button"
                className="product-modal__add-btn"
                onClick={handleAddToCart}
                disabled={!isActive || isAdding || stock === 0}
              >
                {isAdding ? (
                  <>
                    <span className="product-modal__spinner" />
                    Adicionando...
                  </>
                ) : (
                  <>
                    <ShoppingBag size={20} />
                    Adicionar ao Carrinho
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
