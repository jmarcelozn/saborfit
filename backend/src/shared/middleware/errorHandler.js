import { env } from '../../config/env.js';
import { AppError } from '../errors/AppError.js';

export function errorHandler(err, _req, res, _next) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        ...(err.details ? { details: err.details } : {}),
      },
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(422).json({
      success: false,
      error: {
        message: 'Dados inválidos',
        details: err.details,
      },
    });
  }

  console.error('[error]', err);

  res.status(500).json({
    success: false,
    error: {
      message: 'Erro interno do servidor',
      ...(!env.isProduction && err.stack ? { stack: err.stack } : {}),
    },
  });
}
