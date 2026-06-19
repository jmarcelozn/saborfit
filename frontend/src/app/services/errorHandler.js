export function getErrorMessage(error) {
  if (!error) {
    return "Erro inesperado.";
  }

  const status = error.status ?? error?.response?.status ?? null;

  if (!status) {
    return "Servidor indisponível. Tente novamente em alguns instantes.";
  }

  switch (status) {
    case 400:
      return "Verifique os dados informados.";

    case 401:
      return "Sua sessão expirou. Por favor, faça login novamente.";

    case 403:
      return "Você não possui permissão para acessar este recurso.";

    case 404:
      return "O recurso solicitado não foi encontrado.";

    case 409:
      return error.message || "Conflito de dados no servidor.";

    case 422:
      return error.message || "Verifique os dados informados.";

    case 429:
      return "Excedeu o limite de tentativas. Aguarde alguns instantes e tente novamente.";

    case 500:
      return "Ocorreu um erro interno. Tente novamente mais tarde.";

    case 503:
      return "Sistema temporariamente indisponível.";

    default:
      return error.message || "Erro inesperado.";
  }
}
