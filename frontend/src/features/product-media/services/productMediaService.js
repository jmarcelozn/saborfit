import { adminApiFetch } from '@/app/services/api';

export async function getProductMedia(productId) {
  return adminApiFetch(`/products/${productId}/media`);
}

export async function uploadProductMedia(productId, file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('produto_id', productId);

  const response = await fetch(`/api/products/${productId}/media`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erro ao fazer upload da mídia');
  }

  return response.json();
}

export async function setPrimaryMedia(mediaId) {
  return adminApiFetch(`/products/media/${mediaId}/set-primary`, {
    method: 'PATCH',
  });
}

export async function reorderMedia(mediaId, newOrder) {
  return adminApiFetch(`/products/media/${mediaId}/reorder`, {
    method: 'PATCH',
    body: JSON.stringify({ sort_order: newOrder }),
  });
}

export async function deleteMedia(mediaId) {
  return adminApiFetch(`/products/media/${mediaId}`, {
    method: 'DELETE',
  });
}
