export function successResponse(res, data = null, message = 'Operação realizada com sucesso', statusCode = 200) {
  const body = { success: true, message };

  if (data !== null && data !== undefined) {
    body.data = data;
  }

  return res.status(statusCode).json(body);
}

export function errorResponse(res, message, statusCode = 400, details = null) {
  const body = {
    success: false,
    error: { message },
  };

  if (details) {
    body.error.details = details;
  }

  return res.status(statusCode).json(body);
}
