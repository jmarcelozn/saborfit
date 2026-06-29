import { useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/shared/utils/formatCurrency';
import { getProductImage } from '@/shared/utils/getProductImage';
import { ROUTES } from '@/app/config/routes';
import './css/CartItem.css';

export default function CartItem({ item, onUpdateQuantity, onRemove, disabled }) {
  const image = getProductImage(item.product);
  const maxQuantity = item.product?.stock_quantity ?? 99;

  const handleDecrease = () => {
    if (item.quantity <= 1) {
      onRemove(item.id);
      return;
    }

    onUpdateQuantity(item.id, item.quantity - 1);
  };

  const handleIncrease = () => {
    if (item.quantity >= maxQuantity) {
      return;
    }

    onUpdateQuantity(item.id, item.quantity + 1);
  };

  return (
    <article className="cart-item">
      <div className="cart-item__image-wrap">
        <img
          src={image}
          alt={item.product?.name || 'Produto'}
          className="cart-item__image"
          loading="lazy"
        />
      </div>

      <div className="cart-item__details">
        <h3 className="cart-item__name">{item.product?.name}</h3>

        {item.product?.description && (
          <p className="cart-item__description">{item.product.description}</p>
        )}

        <p className="cart-item__unit-price">
          {formatCurrency(item.unit_price)} <span>un.</span>
        </p>
      </div>

      <div className="cart-item__actions">
        <div className="cart-item__quantity">
          <button
            type="button"
            className="cart-item__qty-btn"
            onClick={handleDecrease}
            disabled={disabled}
            aria-label="Diminuir quantidade"
          >
            <Minus size={16} />
          </button>

          <span className="cart-item__qty-value">{item.quantity}</span>

          <button
            type="button"
            className="cart-item__qty-btn"
            onClick={handleIncrease}
            disabled={disabled || item.quantity >= maxQuantity}
            aria-label="Aumentar quantidade"
          >
            <Plus size={16} />
          </button>
        </div>

        <p className="cart-item__subtotal">{formatCurrency(item.subtotal)}</p>

        <button
          type="button"
          className="cart-item__remove"
          onClick={() => onRemove(item.id)}
          disabled={disabled}
          aria-label="Remover item"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </article>
  );
}

export function EmptyCart() {
  const navigate = useNavigate();

  return (
    <div className="cart-empty">
      <p className="cart-empty__title">Seu carrinho está vazio</p>
      <p className="cart-empty__text">
        Explore nossos produtos e adicione itens para continuar.
      </p>
      <button
        type="button"
        className="cart-empty__btn"
        onClick={() => navigate(ROUTES.HOME)}
      >
        Ver produtos
      </button>
    </div>
  );
}
