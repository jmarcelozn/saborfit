import { asyncHandler } from '../../../shared/utils/asyncHandler.js';
import { successResponse } from '../../../shared/utils/response.js';
import productService from '../services/product.service.js';

export const listProducts = asyncHandler(async (_req, res) => {
  const products = await productService.listProducts();
  return successResponse(res, products);
});

export const getProduct = asyncHandler(async (req, res) => {
  const product = await productService.getProduct(Number(req.params.id));
  return successResponse(res, product);
});

export const createProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.body);
  return successResponse(res, product, 'Produto criado com sucesso', 201);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(Number(req.params.id), req.body);
  return successResponse(res, product, 'Produto atualizado com sucesso');
});

export const deleteProduct = asyncHandler(async (req, res) => {
  await productService.deleteProduct(Number(req.params.id));
  return successResponse(res, null, 'Produto desativado com sucesso');
});
