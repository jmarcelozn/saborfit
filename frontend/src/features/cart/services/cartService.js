import { adminApiFetch } from '@/app/services/api';

export async function fetchCart() {
  const response = await adminApiFetch('/cart');
  return response.data;
}

export async function addCartItem(productId, quantity = 1) {
  const response = await adminApiFetch('/cart', {
    method: 'POST',
    body: JSON.stringify({
      product_id: productId,
      quantity,
    }),
  });

  return response.data;
}

export async function updateCartItemQuantity(itemId, quantity) {
  const response = await adminApiFetch(`/cart/items/${itemId}`, {
    method: 'PATCH',
    body: JSON.stringify({ quantity }),
  });

  return response.data;
}

export async function removeCartItem(itemId) {
  const response = await adminApiFetch(`/cart/items/${itemId}`, {
    method: 'DELETE',
  });

  return response.data;
}

export async function clearCart() {
  const response = await adminApiFetch('/cart', {
    method: 'DELETE',
  });

  return response.data;
}
