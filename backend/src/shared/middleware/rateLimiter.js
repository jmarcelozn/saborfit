import rateLimit from 'express-rate-limit';
import { env } from '../../config/env.js';

export const globalRateLimiter = rateLimit({
  windowMs: env.rateLimit.windowMs,
  max: env.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: { message: 'Muitas requisições. Tente novamente mais tarde.' },
  },
});

export const authRateLimiter = rateLimit({
  windowMs: env.rateLimit.windowMs,
  max: env.rateLimit.authMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: { message: 'Muitas tentativas de autenticação. Tente novamente mais tarde.' },
  },
});
