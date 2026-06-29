import { CartProvider as CartProviderContext } from '@/app/contexts/CartContext';

export function CartProvider({ children }) {
  return <CartProviderContext>{children}</CartProviderContext>;
}
