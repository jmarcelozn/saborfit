import jwt from 'jsonwebtoken';
import { env } from '../../../config/env.js';
import { AppError } from '../../../shared/errors/AppError.js';
import userRepository from '../repositories/user.repository.js';

const AUTH_COOKIE_NAME = 'saborfit_auth_token';

function parseCookies(cookieHeader = '') {
  return cookieHeader.split(';').reduce((cookies, cookiePair) => {
    const [name, ...value] = cookiePair.split('=');
    if (!name || value.length === 0) {
      return cookies;
    }

    cookies[name.trim()] = decodeURIComponent(value.join('=').trim());
    return cookies;
  }, {});
}

function getTokenFromRequest(req) {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }

  const cookies = parseCookies(req.headers.cookie || '');
  return cookies[AUTH_COOKIE_NAME] || null;
}

export async function authenticate(req, _res, next) {
  try {
    const token = getTokenFromRequest(req);

    if (!token) {
      throw new AppError('Token de autenticação não informado', 401);
    }

    let payload;

    try {
      payload = jwt.verify(token, env.jwt.secret);
    } catch {
      throw new AppError('Token inválido ou expirado', 401);
    }

    // Defensive validations
    if (!payload || typeof payload !== 'object') {
      throw new AppError('Token inválido', 401);
    }

    if (!payload.sub || typeof payload.sub !== 'number') {
      throw new AppError('Token inválido', 401);
    }

    if (payload.tokenVersion === undefined || typeof payload.tokenVersion !== 'number') {
      throw new AppError('Token inválido', 401);
    }

    if (payload.iat && typeof payload.iat !== 'number') {
      throw new AppError('Token inválido', 401);
    }

    if (payload.exp && typeof payload.exp !== 'number') {
      throw new AppError('Token inválido', 401);
    }

    const user = await userRepository.findById(payload.sub);

    if (!user) {
      throw new AppError('Usuário não encontrado', 401);
    }

    if (user.token_version !== payload.tokenVersion) {
      throw new AppError('Sessão inválida. Faça login novamente.', 401);
    }

    req.tokenPayload = payload;
    req.user = {
      id: user.id,
      nome: user.nome,
      email: user.email,
      role: user.role || payload.role || 'user',
      emailVerificado: Boolean(user.email_verificado),
    };

    next();
  } catch (error) {
    next(error);
  }
}

export function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(new AppError('Acesso negado', 403));
    }
    return next();
  };
}
