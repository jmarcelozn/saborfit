import { Link } from 'react-router-dom';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/shared/utils/formatCurrency';
import { getProductImage } from '@/shared/utils/getProductImage';
import { ROUTES } from '@/app/config/routes';
import './css/CartItem.css';

export default function CartItem({ item, onUpdateQuantity, onRemove, disabled }) {
  const image = getProductImage(item.product);
  const maxQuantity = item.product?.stock_quantity ?? 99;
  const name = item.product?.name || 'Produto';

  const handleDecrease = () => item.quantity <= 1
    ? onRemove(item.id)
    : onUpdateQuantity(item.id, item.quantity - 1);

  const handleIncrease = () => {
    if (item.quantity < maxQuantity) onUpdateQuantity(item.id, item.quantity + 1);
  };

  return (
    <article className="cart-item">
      <div className="cart-item__image-wrap"><img src={image} alt={name} className="cart-item__image" loading="lazy" /></div>
      <div className="cart-item__details">
        <span className="cart-item__label">Confeitaria artesanal</span>
        <h3 className="cart-item__name">{name}</h3>
        {item.product?.description && <p className="cart-item__description">{item.product.description}</p>}
        <p className="cart-item__unit-price">{formatCurrency(item.unit_price)} <span>por unidade</span></p>
      </div>
      <div className="cart-item__purchase">
        <p className="cart-item__subtotal"><span>Subtotal</span><strong>{formatCurrency(item.subtotal)}</strong></p>
        <div className="cart-item__quantity" aria-label={`Quantidade de ${name}`}>
          <button type="button" onClick={handleDecrease} disabled={disabled} aria-label="Diminuir quantidade"><Minus size={15} /></button>
          <span aria-live="polite">{item.quantity}</span>
          <button type="button" onClick={handleIncrease} disabled={disabled || item.quantity >= maxQuantity} aria-label="Aumentar quantidade"><Plus size={15} /></button>
        </div>
        <button type="button" className="cart-item__remove" onClick={() => onRemove(item.id)} disabled={disabled}><Trash2 size={15} /> Remover</button>
      </div>
    </article>
  );
}

export function EmptyCart() {
  return (
    <section className="cart-empty">
      <span className="cart-empty__icon"><ShoppingBag size={28} /></span>
      <span className="cart-page__eyebrow">Seu carrinho</span>
      <h2>Nenhuma delícia por aqui.</h2>
      <p>Explore nosso cardápio e escolha os sabores para a sua próxima celebração.</p>
      <Link className="cart-empty__btn" to={ROUTES.MENU}>Conhecer o cardápio <span aria-hidden="true">→</span></Link>
    </section>
  );
}
