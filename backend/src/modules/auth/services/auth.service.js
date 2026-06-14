import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../../../config/env.js';
import { AppError } from '../../../shared/errors/AppError.js';
import pool from '../../../database/pool.js';
import userRepository from '../repositories/user.repository.js';
import loginLogRepository from '../repositories/loginLog.repository.js';
import emailVerificationService from './emailVerification.service.js';
import auditService from './audit.service.js';

function sanitizeUser(user) {
  if (!user) return null;

  return {
    id: user.id,
    nome: user.nome,
    email: user.email,
    role: user.role || 'user',
    emailVerificado: Boolean(user.email_verificado),
    createdAt: user.created_at,
  };
}

function isUserLocked(user) {
  if (!user.bloqueado_ate) return false;
  return new Date(user.bloqueado_ate) > new Date();
}

function getLockoutExpiryDate() {
  const date = new Date();
  date.setMinutes(date.getMinutes() + env.security.lockoutMinutes);
  return date;
}

export class AuthService {
  async register({ nome, email, senha }) {
    const existingUser = await userRepository.findByEmail(email);

    if (existingUser) {
      const verification = await emailVerificationService.createVerification(existingUser.id);
      return {
        user: null,
        verification,
        message: 'Se o e-mail estiver cadastrado, você receberá instruções de verificação.',
      };
    }

    const senhaHash = await bcrypt.hash(senha, env.security.bcryptRounds);
    const user = await userRepository.create({ nome, email, senhaHash, role: 'user' });

    const verification = await emailVerificationService.createVerification(user.id);

    await auditService.logUserRegister(user.id, null, null, { email });

    return {
      user: sanitizeUser(user),
      verification,
    };
  }

  async login({ email, senha }, { ip, userAgent }) {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      await loginLogRepository.create({
        usuarioId: null,
        ip,
        userAgent,
        sucesso: false,
      });
      await auditService.logUserLoginFailed(null, ip, userAgent, { email });
      throw new AppError('Credenciais inválidas', 401);
    }

    if (isUserLocked(user)) {
      await loginLogRepository.create({
        usuarioId: user.id,
        ip,
        userAgent,
        sucesso: false,
      });
      await auditService.logUserLoginFailed(user.id, ip, userAgent, { reason: 'account_locked' });
      throw new AppError(
        `Conta temporariamente bloqueada. Tente novamente em ${env.security.lockoutMinutes} minutos.`,
        423,
      );
    }

    const senhaValida = await bcrypt.compare(senha, user.senha);

    if (!senhaValida) {
      const novasTentativas = user.tentativas_login + 1;
      let bloqueadoAte = null;

      if (novasTentativas >= env.security.maxLoginAttempts) {
        bloqueadoAte = getLockoutExpiryDate();
      }

      await userRepository.updateLoginAttempts(user.id, novasTentativas, bloqueadoAte);
      await loginLogRepository.create({
        usuarioId: user.id,
        ip,
        userAgent,
        sucesso: false,
      });
      await auditService.logUserLoginFailed(user.id, ip, userAgent, { attempts: novasTentativas });

      if (bloqueadoAte) {
        await auditService.logAccountLocked(user.id, ip, userAgent, { attempts: novasTentativas });
        throw new AppError(
          `Conta bloqueada após ${env.security.maxLoginAttempts} tentativas inválidas. Tente novamente em ${env.security.lockoutMinutes} minutos.`,
          423,
        );
      }

      throw new AppError('Credenciais inválidas', 401);
    }

    await userRepository.resetLoginAttempts(user.id);
    await loginLogRepository.create({
      usuarioId: user.id,
      ip,
      userAgent,
      sucesso: true,
    });

    await auditService.logUserLogin(user.id, ip, userAgent);

    const token = this.generateToken(user);

    return {
      token,
      user: sanitizeUser(user),
    };
  }

  generateToken(user) {
    return jwt.sign(
      {
        sub: user.id,
        tokenVersion: user.token_version,
        role: user.role || 'user',
      },
      env.jwt.secret,
      {
        expiresIn: env.jwt.expiresIn,
        issuer: env.jwt.issuer,
        audience: env.jwt.audience,
      },
    );
  }

  async getProfile(userId) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }

    return sanitizeUser(user);
  }

  async changePassword(userId, { senhaAtual, novaSenha }, { ip, userAgent } = {}) {
    const user = await userRepository.findByIdWithPassword(userId);

    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }

    const senhaValida = await bcrypt.compare(senhaAtual, user.senha);

    if (!senhaValida) {
      throw new AppError('Senha atual incorreta', 401);
    }

    const mesmaSenha = await bcrypt.compare(novaSenha, user.senha);

    if (mesmaSenha) {
      throw new AppError('A nova senha deve ser diferente da senha atual', 400);
    }

    const novaSenhaHash = await bcrypt.hash(novaSenha, env.security.bcryptRounds);

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      await connection.query(
        `UPDATE usuarios SET senha = ?, token_version = token_version + 1 WHERE id = ?`,
        [novaSenhaHash, userId],
      );

      await connection.commit();

      await auditService.logPasswordChange(userId, ip, userAgent);

      return {
        message: 'Senha alterada com sucesso. Todas as sessões foram invalidadas.',
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async logoutAll(userId, { ip, userAgent } = {}) {
    await userRepository.incrementTokenVersion(userId);

    await auditService.logUserLogoutAll(userId, ip, userAgent);

    return {
      message: 'Todas as sessões foram invalidadas com sucesso',
    };
  }
}

export default new AuthService();
