import { formatCurrency } from '@/shared/utils/formatCurrency';
import { getProductImage } from '@/shared/utils/getProductImage';
import './css/ProductCard.css';

function ProductCard({ product, onAddToCart, onViewDetails, isAdding = false }) {
  const name = product?.name || 'Produto';
  const image = getProductImage(product);
  const price = product?.price;

  const handleAddToCart = () => {
    if (typeof onAddToCart === 'function') {
      onAddToCart(product);
    }
  };

  const handleViewDetails = () => {
    if (typeof onViewDetails === 'function') {
      onViewDetails(product);
    }
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img
          src={image}
          alt={name}
          className="product-image"
          loading="lazy"
        />

        <div className="product-overlay">
          <button
            type="button"
            className="product-view-btn"
            onClick={handleViewDetails}
            aria-label="Ver detalhes do produto"
          >
            Ver Detalhes
          </button>
        </div>
      </div>

      <div className="product-info">
        <h3 className="product-title">
          {name}
        </h3>

        {product?.description && (
          <p className="product-description">
            {product.description}
          </p>
        )}

        <div className="product-footer">
          <span className="product-price">
            {formatCurrency(price)}
          </span>

          <button
            type="button"
            className="product-add-btn"
            aria-label="Adicionar ao carrinho"
            onClick={handleAddToCart}
            disabled={isAdding}
          >
            <span>+</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
