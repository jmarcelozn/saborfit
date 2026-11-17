import { Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCart } from '@/app/contexts/useCart';
import { ROUTES } from '@/app/config/routes';
import CartItem, { EmptyCart } from '../components/CartItem';
import CartSummary from '../components/CartSummary';
import '../css/Cart.css';

export default function Cart() {
  const { items, itemCount, subtotal, isLoading, isUpdating, updateQuantity, removeItem, clearCart } = useCart();

  const handleClearCart = async () => {
    if (window.confirm('Deseja remover todos os itens do carrinho?')) await clearCart();
  };

  return (
    <main className="cart-page" id="main-content">
      <div className="cart-page__topline">
        <Link to={ROUTES.MENU}><ArrowLeft size={17} /> Continuar comprando</Link>
        {!isLoading && itemCount > 0 && <span><ShoppingBag size={16} /> {itemCount} {itemCount === 1 ? 'item' : 'itens'}</span>}
      </div>

      <header className="cart-page__header">
        <span className="cart-page__eyebrow">Sua seleção</span>
        <h1>Meu carrinho</h1>
        <p>Revise os sabores e informe os detalhes da sua encomenda.</p>
      </header>

      {isLoading ? (
        <div className="cart-page__loading" aria-label="Carregando carrinho"><span /><span /></div>
      ) : itemCount === 0 ? (
        <EmptyCart />
      ) : (
        <div className="cart-page__content">
          <section className="cart-page__items" aria-label="Itens do carrinho">
            <div className="cart-page__items-heading"><h2>Itens escolhidos</h2><span>{itemCount}</span></div>
            {items.map((item) => <CartItem key={item.id} item={item} onUpdateQuantity={updateQuantity} onRemove={removeItem} disabled={isUpdating} />)}
          </section>
          <CartSummary subtotal={subtotal} itemCount={itemCount} onClear={handleClearCart} disabled={isUpdating} />
        </div>
      )}
    </main>
  );
}
