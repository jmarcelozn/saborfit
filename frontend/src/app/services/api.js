const BASE_API_URL = import.meta.env.VITE_API_URL || "/api";
const MAX_NETWORK_RETRIES = 3;
const NETWORK_RETRY_DELAY_MS = 500;

export const API_URL = `${BASE_API_URL}/auth`;
export const ADMIN_API_URL = BASE_API_URL;

let apiErrorHandler = null;

export function registerApiErrorHandler(handler) {
  apiErrorHandler = handler;
}

export class ApiError extends Error {
  constructor(message, details = null, status = null) {
    super(message);
    this.details = details;
    this.status = status;
  }
}

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function fetchWithRetry(url, options) {
  const method = (options.method || 'GET').toUpperCase();
  const canRetry = method === 'GET' || method === 'HEAD';

  for (let attempt = 0; ; attempt += 1) {
    try {
      const response = await fetch(url, options);
      const isTransientStatus = [502, 503, 504].includes(response.status);

      if (!canRetry || !isTransientStatus || attempt >= MAX_NETWORK_RETRIES) {
        return response;
      }

      await response.body?.cancel();
    } catch (error) {
      if (!canRetry || !(error instanceof TypeError) || attempt >= MAX_NETWORK_RETRIES) {
        throw error;
      }
    }

    await wait(NETWORK_RETRY_DELAY_MS * (attempt + 1));
  }
}

function getDefaultMessageByStatus(status) {
  switch (status) {
    case 400:
      return "Verifique os dados informados.";
    case 401:
      return "Sua sessão expirou. Faça login novamente.";
    case 403:
      return "Você não possui permissão para acessar este recurso.";
    case 404:
      return "O recurso solicitado não foi encontrado.";
    case 409:
      return "Conflito de dados. Verifique e tente novamente.";
    case 422:
      return "Verifique os dados informados.";
    case 429:
      return "Excedeu o limite de tentativas. Aguarde alguns instantes e tente novamente.";
    case 500:
      return "Ocorreu um erro interno. Tente novamente mais tarde.";
    case 503:
      return "Sistema temporariamente indisponível.";
    default:
      return "Erro inesperado.";
  }
}

export async function apiFetch(path, options = {}) {
  try {
    const response = await fetchWithRetry(`${API_URL}${path}`, {
      credentials: 'include',
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    const text = await response.text();
    let data = null;

    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = null;
      }
    }

    if (!response.ok) {
      const message =
        data?.message ||
        data?.error?.message ||
        getDefaultMessageByStatus(response.status) ||
        "Erro de requisição";

      if (response.status === 401 && typeof apiErrorHandler === "function") {
        apiErrorHandler(response.status);
      }

      throw new ApiError(message, data?.error?.details || null, response.status);
    }

    return data === null ? {} : data;
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401 && typeof apiErrorHandler === "function") {
        apiErrorHandler(error.status);
      }
      throw error;
    }

    if (error instanceof TypeError) {
      throw new ApiError(
        "Não foi possível conectar ao servidor. Verifique se o backend está rodando.",
        null,
        null
      );
    }

    throw new ApiError(
      "Servidor indisponível. Tente novamente em alguns instantes.",
      null,
      null
    );
  }
}

export async function adminApiFetch(path, options = {}) {
  try {
    const response = await fetchWithRetry(`${ADMIN_API_URL}${path}`, {
      credentials: 'include',
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    const text = await response.text();
    let data = null;

    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = null;
      }
    }

    if (!response.ok) {
      const message =
        data?.message ||
        data?.error?.message ||
        getDefaultMessageByStatus(response.status) ||
        "Erro de requisição";

      if (response.status === 401 && typeof apiErrorHandler === "function") {
        apiErrorHandler(response.status);
      }

      throw new ApiError(message, data?.error?.details || null, response.status);
    }

    return data === null ? {} : data;
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401 && typeof apiErrorHandler === "function") {
        apiErrorHandler(error.status);
      }
      throw error;
    }

    if (error instanceof TypeError) {
      throw new ApiError(
        "Não foi possível conectar ao servidor. Verifique se o backend está rodando.",
        null,
        null
      );
    }

    throw new ApiError(
      "Servidor indisponível. Tente novamente em alguns instantes.",
      null,
      null
    );
  }
}
