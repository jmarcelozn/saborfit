import { adminApiFetch } from '@/app/services/api';

export async function listCatalogProducts() {
  const response = await adminApiFetch('/products/catalog');
  return response.data || [];
}

export async function getCatalogProduct(id) {
  const response = await adminApiFetch(`/products/catalog/${id}`);
  return response.data;
}
