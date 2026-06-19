import { apiFetch, ApiError, ADMIN_API_URL } from './api';

const PRODUCT_API_URL = `${ADMIN_API_URL}/products`;

export async function listProducts() {
  try {
    const response = await fetch(PRODUCT_API_URL, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
      const message = data?.message || data?.error?.message || 'Erro ao listar produtos';
      throw new ApiError(message, data?.error?.details || null, response.status);
    }

    return data.data || [];
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Erro ao listar produtos', null, null);
  }
}

export async function getProduct(id) {
  try {
    const response = await fetch(`${PRODUCT_API_URL}/${id}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
      const message = data?.message || data?.error?.message || 'Erro ao buscar produto';
      throw new ApiError(message, data?.error?.details || null, response.status);
    }

    return data.data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Erro ao buscar produto', null, null);
  }
}

export async function createProduct(productData) {
  try {
    const response = await fetch(PRODUCT_API_URL, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
      const message = data?.message || data?.error?.message || 'Erro ao criar produto';
      throw new ApiError(message, data?.error?.details || null, response.status);
    }

    return data.data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Erro ao criar produto', null, null);
  }
}

export async function updateProduct(id, productData) {
  try {
    const response = await fetch(`${PRODUCT_API_URL}/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
      const message = data?.message || data?.error?.message || 'Erro ao atualizar produto';
      throw new ApiError(message, data?.error?.details || null, response.status);
    }

    return data.data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Erro ao atualizar produto', null, null);
  }
}

export async function deleteProduct(id) {
  try {
    const response = await fetch(`${PRODUCT_API_URL}/${id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const text = await response.text();
      const data = text ? JSON.parse(text) : {};
      const message = data?.message || data?.error?.message || 'Erro ao desativar produto';
      throw new ApiError(message, data?.error?.details || null, response.status);
    }

    return true;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Erro ao desativar produto', null, null);
  }
}
