import rateLimit from 'express-rate-limit';
import { env } from '../../config/env.js';

const userRateLimiters = new Map();

export function createUserRateLimiter(options = {}) {
  const {
    windowMs = env.rateLimit.windowMs,
    max = 5,
    keyGenerator = (req) => req.user?.id?.toString() || req.ip,
  } = options;

  const limiter = rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator,
    message: {
      success: false,
      error: { message: 'Muitas tentativas para este usuário. Tente novamente mais tarde.' },
    },
    skip: (req) => !req.user,
  });

  return limiter;
}

export const passwordChangeRateLimiter = createUserRateLimiter({
  windowMs: 60 * 60 * 1000,
  max: 3,
});

export const emailVerificationRateLimiter = createUserRateLimiter({
  windowMs: 24 * 60 * 60 * 1000,
  max: 5,
});

export const passwordResetRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.body.email || req.ip,
  message: {
    success: false,
    error: { message: 'Muitas tentativas de reset de senha. Tente novamente mais tarde.' },
  },
});
