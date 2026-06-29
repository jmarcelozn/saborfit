import { adminApiFetch } from '@/app/services/api';

export async function fetchStoreSettings() {
  const response = await adminApiFetch('/settings');
  return response.data;
}

export async function updateStoreSettings(payload) {
  const response = await adminApiFetch('/settings', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

  return response.data;
}
