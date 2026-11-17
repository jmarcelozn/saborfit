import { useEffect, useRef } from 'react';
import { Clock3, PackageCheck, ShoppingBag, Sparkles, X } from 'lucide-react';
import { formatCurrency } from '@/shared/utils/formatCurrency';
import { getProductImage } from '@/shared/utils/getProductImage';
import ProductGallery from './ProductGallery';
import './css/ProductModal.css';

function ProductModal({ product, isOpen, onClose, onAddToCart, isAdding = false }) {
  const closeButtonRef = useRef(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const previouslyFocusedElement = document.activeElement;
    const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());
    const handleEscape = (event) => {
      if (event.key === 'Escape') onCloseRef.current();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleEscape);
      window.cancelAnimationFrame(focusFrame);
      previouslyFocusedElement?.focus?.();
    };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const productImages = product.media?.map((media) => media.secure_url || media.image_url).filter(Boolean) || [];
  const images = productImages.length ? productImages : [getProductImage(product)];
  const name = product.name || 'Produto';
  const description = product.description || '';
  const category = product.category?.name || product.category || product.category_name;
  const stock = product.stock_quantity;
  const isActive = product.is_active !== false;
  const hasStockInformation = stock !== null && stock !== undefined && Number.isFinite(Number(stock));
  const isSoldOut = hasStockInformation && Number(stock) <= 0;
  const canAdd = isActive && !isSoldOut && !isAdding;
  const availabilityLabel = !isActive || isSoldOut
    ? 'Indisponível no momento'
    : hasStockInformation
      ? `${Number(stock)} ${Number(stock) === 1 ? 'unidade disponível' : 'unidades disponíveis'}`
      : 'Consulte a disponibilidade';

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) onCloseRef.current();
  };

  return (
    <div className="product-modal-overlay" onMouseDown={handleOverlayClick}>
      <section
        className="product-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
        aria-describedby={description ? 'product-modal-description' : 'product-modal-purchase-note'}
      >
        <button
          ref={closeButtonRef}
          type="button"
          className="product-modal__close"
          onClick={onClose}
          aria-label="Fechar detalhes do produto"
        >
          <X size={20} />
        </button>

        <div className="product-modal__content">
          <div className="product-modal__gallery-panel">
            <div className="product-modal__gallery-label">
              <Sparkles size={14} aria-hidden="true" />
              Feito com carinho
            </div>
            <ProductGallery key={product.id} images={images} productName={name} />
            {category && (
              <span className="product-modal__gallery-category">{String(category)}</span>
            )}
          </div>

          <div className="product-modal__info">
            <header className="product-modal__header">
              <h2 className="product-modal__title" id="product-modal-title">{name}</h2>
              <div className="product-modal__price-row">
                <span className="product-modal__price-label">Valor</span>
                <strong className="product-modal__price">{formatCurrency(product.price)}</strong>
              </div>
            </header>

            <div className="product-modal__section">
              <h3 className="product-modal__section-title">Sobre o produto</h3>
              {description ? (
                <p className="product-modal__description" id="product-modal-description">{description}</p>
              ) : (
                <p className="product-modal__description product-modal__description--muted">
                  Consulte nosso atendimento para saber mais sobre este produto.
                </p>
              )}
            </div>

            <div className="product-modal__facts" aria-label="Informações do produto">
              <div className="product-modal__fact">
                <span className="product-modal__fact-icon"><PackageCheck size={18} aria-hidden="true" /></span>
                <span className="product-modal__fact-copy">
                  <strong>Disponibilidade</strong>
                  <span className={!canAdd ? 'is-unavailable' : ''} aria-live="polite">{availabilityLabel}</span>
                </span>
              </div>
              <div className="product-modal__fact">
                <span className="product-modal__fact-icon"><Clock3 size={18} aria-hidden="true" /></span>
                <span className="product-modal__fact-copy">
                  <strong>Prazo</strong>
                  <span>Confirme com nosso atendimento</span>
                </span>
              </div>
            </div>

            <footer className="product-modal__actions">
              <button
                type="button"
                className="product-modal__add-btn"
                onClick={() => onAddToCart?.(product)}
                disabled={!canAdd}
              >
                {isAdding
                  ? <><span className="product-modal__spinner" /> Adicionando...</>
                  : <><ShoppingBag size={18} aria-hidden="true" /> {canAdd ? 'Adicionar ao carrinho' : 'Produto indisponível'}</>}
              </button>
              <p id="product-modal-purchase-note">Você poderá revisar seu pedido antes de finalizar.</p>
            </footer>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ProductModal;
