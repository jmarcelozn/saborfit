import { createContext, useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/app/contexts/useAuth';
import { showNotification } from '@/app/services/notificationService';
import {
  addCartItem as addCartItemRequest,
  clearCart as clearCartRequest,
  fetchCart,
  removeCartItem as removeCartItemRequest,
  updateCartItemQuantity as updateCartItemQuantityRequest,
} from '@/features/cart/services/cartService';

const EMPTY_CART = {
  id: null,
  status: 'ativo',
  items: [],
  item_count: 0,
  subtotal: 0,
};

const CartContext = createContext();

export function CartProvider({ children }) {
  const { isAuthenticated, isInitializing } = useAuth();
  const [cart, setCart] = useState(EMPTY_CART);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const loadCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(EMPTY_CART);
      return null;
    }

    setIsLoading(true);

    try {
      const data = await fetchCart();
      setCart(data);
      return data;
    } catch (error) {
      showNotification(error.message || 'Não foi possível carregar o carrinho.', 'error');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isInitializing) {
      return;
    }

    loadCart();
  }, [isInitializing, loadCart]);

  const addToCart = useCallback(async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      showNotification('Faça login para adicionar produtos ao carrinho.', 'info');
      return { requiresAuth: true };
    }

    setIsUpdating(true);

    try {
      const data = await addCartItemRequest(productId, quantity);
      setCart(data);
      showNotification('Produto adicionado ao carrinho.', 'success');
      return { success: true, data };
    } catch (error) {
      showNotification(error.message || 'Não foi possível adicionar o produto.', 'error');
      return { success: false, error };
    } finally {
      setIsUpdating(false);
    }
  }, [isAuthenticated]);

  const updateQuantity = useCallback(async (itemId, quantity) => {
    setIsUpdating(true);

    try {
      const data = await updateCartItemQuantityRequest(itemId, quantity);
      setCart(data);
      return { success: true, data };
    } catch (error) {
      showNotification(error.message || 'Não foi possível atualizar a quantidade.', 'error');
      return { success: false, error };
    } finally {
      setIsUpdating(false);
    }
  }, []);

  const removeItem = useCallback(async (itemId) => {
    setIsUpdating(true);

    try {
      const data = await removeCartItemRequest(itemId);
      setCart(data);
      showNotification('Item removido do carrinho.', 'success');
      return { success: true, data };
    } catch (error) {
      showNotification(error.message || 'Não foi possível remover o item.', 'error');
      return { success: false, error };
    } finally {
      setIsUpdating(false);
    }
  }, []);

  const clearCart = useCallback(async () => {
    setIsUpdating(true);

    try {
      const data = await clearCartRequest();
      setCart(data);
      showNotification('Carrinho esvaziado.', 'success');
      return { success: true, data };
    } catch (error) {
      showNotification(error.message || 'Não foi possível esvaziar o carrinho.', 'error');
      return { success: false, error };
    } finally {
      setIsUpdating(false);
    }
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        items: cart.items,
        itemCount: cart.item_count,
        subtotal: cart.subtotal,
        isLoading,
        isUpdating,
        loadCart,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export { CartContext };
