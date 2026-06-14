const BASE_API_URL = import.meta.env.VITE_API_URL || "/api";

export const API_URL = `${BASE_API_URL}/auth`;

export class ApiError extends Error {
  constructor(message, details = null) {
    super(message);
    this.details = details;
  }
}

export async function apiFetch(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(
      data?.message ||
      data?.error?.message ||
      "Erro de requisição",
      data?.error?.details || null
    );
  }

  return data;
}