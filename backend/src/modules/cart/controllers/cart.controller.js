import { asyncHandler } from '../../../shared/utils/asyncHandler.js';
import { successResponse } from '../../../shared/utils/response.js';
import cartService from '../services/cart.service.js';

export const getCart = asyncHandler(async (req, res) => {
  const cart = await cartService.getCart(req.user.id);
  return successResponse(res, cart);
});

export const addCartItem = asyncHandler(async (req, res) => {
  const cart = await cartService.addItem(
    req.user.id,
    Number(req.body.product_id),
    req.body.quantity,
  );

  return successResponse(res, cart, 'Produto adicionado ao carrinho', 201);
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const cart = await cartService.updateItemQuantity(
    req.user.id,
    Number(req.params.itemId),
    req.body.quantity,
  );

  return successResponse(res, cart, 'Quantidade atualizada com sucesso');
});

export const removeCartItem = asyncHandler(async (req, res) => {
  const cart = await cartService.removeItem(req.user.id, Number(req.params.itemId));
  return successResponse(res, cart, 'Item removido do carrinho');
});

export const clearCart = asyncHandler(async (req, res) => {
  const cart = await cartService.clearCart(req.user.id);
  return successResponse(res, cart, 'Carrinho esvaziado com sucesso');
});
