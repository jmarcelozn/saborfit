import jwt from 'jsonwebtoken';
import { asyncHandler } from '../../../shared/utils/asyncHandler.js';
import { successResponse } from '../../../shared/utils/response.js';
import { getClientIp } from '../../../shared/utils/security.js';
import { env } from '../../../config/env.js';
import authService from '../services/auth.service.js';
import passwordResetService from '../services/passwordReset.service.js';
import emailVerificationService from '../services/emailVerification.service.js';

const AUTH_COOKIE_NAME = 'saborfit_auth_token';

function parseJwtExpiresInToMs(value) {
  if (typeof value === 'number') {
    return value * 1000;
  }

  const match = /^([0-9]+)([smhd])$/.exec(value);
  if (!match) {
    return 7 * 24 * 60 * 60 * 1000;
  }

  const quantity = Number(match[1]);
  const unit = match[2];

  switch (unit) {
    case 's':
      return quantity * 1000;
    case 'm':
      return quantity * 60 * 1000;
    case 'h':
      return quantity * 60 * 60 * 1000;
    case 'd':
      return quantity * 24 * 60 * 60 * 1000;
    default:
      return 7 * 24 * 60 * 60 * 1000;
  }
}

function setAuthTokenCookie(res, token) {
  res.cookie(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: env.isProduction ? 'none' : 'lax',
    maxAge: parseJwtExpiresInToMs(env.jwt.expiresIn),
    path: '/',
  });
}

function clearAuthTokenCookie(res) {
  res.clearCookie(AUTH_COOKIE_NAME, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: env.isProduction ? 'none' : 'lax',
    path: '/',
  });
}

export const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);

  const message = result.message || 'Usuário cadastrado com sucesso';
  const statusCode = result.user ? 201 : 200;

  return successResponse(
    res,
    result,
    message,
    statusCode,
  );
});

export const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body, {
    ip: getClientIp(req),
    userAgent: req.get('user-agent') || null,
  });

  setAuthTokenCookie(res, result.token);

  const tokenPayload = jwt.decode(result.token);
  const expiresAt = tokenPayload?.exp
    ? new Date(tokenPayload.exp * 1000).toISOString()
    : null;
  const expiresInSeconds = tokenPayload?.exp
    ? Math.max(0, tokenPayload.exp - Math.floor(Date.now() / 1000))
    : null;

  return successResponse(
    res,
    {
      user: result.user,
      session: {
        expiresAt,
        expiresInSeconds,
      },
    },
    'Login realizado com sucesso',
  );
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getProfile(req.user.id);
  const expiresAt = req.tokenPayload?.exp
    ? new Date(req.tokenPayload.exp * 1000).toISOString()
    : null;
  const expiresInSeconds = req.tokenPayload?.exp
    ? Math.max(0, req.tokenPayload.exp - Math.floor(Date.now() / 1000))
    : null;

  return successResponse(
    res,
    {
      user,
      session: {
        expiresAt,
        expiresInSeconds,
      },
    },
    'Perfil recuperado com sucesso',
  );
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const result = await passwordResetService.requestReset(req.body.email, {
    ip: getClientIp(req),
    userAgent: req.get('user-agent') || null,
  });
  return successResponse(res, result, result.message);
});

export const validateResetToken = asyncHandler(async (req, res) => {
  const result = await passwordResetService.validateToken(req.body.token);
  return successResponse(res, result, 'Token válido');
});

export const resetPassword = asyncHandler(async (req, res) => {
  const result = await passwordResetService.resetPassword(req.body, {
    ip: getClientIp(req),
    userAgent: req.get('user-agent') || null,
  });
  return successResponse(res, result, result.message);
});

export const changePassword = asyncHandler(async (req, res) => {
  const result = await authService.changePassword(req.user.id, req.body, {
    ip: getClientIp(req),
    userAgent: req.get('user-agent') || null,
  });

  clearAuthTokenCookie(res);

  return successResponse(res, result, result.message);
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const result = await emailVerificationService.verifyEmail(req.body.token, {
    ip: getClientIp(req),
    userAgent: req.get('user-agent') || null,
  });
  return successResponse(res, result, result.message);
});

export const resendVerification = asyncHandler(async (req, res) => {
  const result = await emailVerificationService.resendVerification(req.user.id, {
    ip: getClientIp(req),
    userAgent: req.get('user-agent') || null,
  });
  return successResponse(res, result, result.message);
});

export const logoutAll = asyncHandler(async (req, res) => {
  const result = await authService.logoutAll(req.user.id, {
    ip: getClientIp(req),
    userAgent: req.get('user-agent') || null,
  });

  clearAuthTokenCookie(res);

  return successResponse(res, result, result.message);
});
