import { useCart } from '@/app/contexts/useCart';
import CartItem, { EmptyCart } from '../components/CartItem';
import CartSummary from '../components/CartSummary';
import '../css/Cart.css';

export default function Cart() {
  const {
    items,
    itemCount,
    subtotal,
    isLoading,
    isUpdating,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const handleClearCart = async () => {
    const confirmed = window.confirm('Deseja remover todos os itens do carrinho?');

    if (!confirmed) {
      return;
    }

    await clearCart();
  };

  return (
    <main className="cart-page">
      <header className="cart-page__header">
        <h1>Meu Carrinho</h1>
        <p>Gerencie os produtos antes de finalizar sua encomenda.</p>
      </header>

      {isLoading ? (
        <p className="cart-page__status">Carregando carrinho...</p>
      ) : itemCount === 0 ? (
        <EmptyCart />
      ) : (
        <div className="cart-page__content">
          <section className="cart-page__items" aria-label="Itens do carrinho">
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
                disabled={isUpdating}
              />
            ))}
          </section>

          <CartSummary
            subtotal={subtotal}
            itemCount={itemCount}
            onClear={handleClearCart}
            disabled={isUpdating}
          />
        </div>
      )}
    </main>
  );
}
