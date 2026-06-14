import { env } from '../../../config/env.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { generateSecureToken, hashToken } from '../../../shared/utils/security.js';
import pool from '../../../database/pool.js';
import userRepository from '../repositories/user.repository.js';
import emailVerificationRepository from '../repositories/emailVerification.repository.js';
import auditService from './audit.service.js';
import emailService from '../../../shared/services/email.service.js';

function getVerificationExpiryDate() {
  const date = new Date();
  date.setHours(date.getHours() + env.security.passwordResetExpiresHours);
  return date;
}

export class EmailVerificationService {
  async createVerification(userId, { ip, userAgent } = {}) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }

    if (user.email_verificado) {
      throw new AppError('E-mail já verificado', 400);
    }

    const rawToken = generateSecureToken();
    const tokenHash = hashToken(rawToken);
    const expiresAt = getVerificationExpiryDate();

    await emailVerificationRepository.create({
      usuarioId: user.id,
      tokenHash,
      expiresAt,
    });

    await auditService.logEmailVerificationRequest(user.id, ip, userAgent);

    try {
      await emailService.sendVerificationEmail({
        to: user.email,
        token: rawToken,
        userName: user.nome,
      });
    } catch (error) {
      console.error('Erro ao enviar e-mail de verificação:', error);
    }

    return {
      message: 'E-mail de verificação enviado',
      ...(env.isProduction
        ? {}
        : {
            verificationToken: rawToken,
            expiresAt,
          }),
    };
  }

  async verifyEmail(rawToken, { ip, userAgent } = {}) {
    const tokenHash = hashToken(rawToken);
    const verificationRecord = await emailVerificationRepository.findValidByTokenHash(tokenHash);

    if (!verificationRecord) {
      throw new AppError('Token inválido ou expirado', 400);
    }

    const user = await userRepository.findById(verificationRecord.usuario_id);

    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }

    if (user.email_verificado) {
      await emailVerificationRepository.markAsUsed(verificationRecord.id);
      throw new AppError('E-mail já verificado', 400);
    }

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      await connection.query(
        `UPDATE usuarios SET email_verificado = TRUE WHERE id = ?`,
        [user.id],
      );

      await connection.query(
        `UPDATE email_verifications SET used = TRUE WHERE id = ?`,
        [verificationRecord.id],
      );

      await connection.commit();

      await auditService.logEmailVerified(user.id, ip, userAgent);

      return {
        message: 'E-mail verificado com sucesso',
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async resendVerification(userId, { ip, userAgent } = {}) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }

    if (user.email_verificado) {
      throw new AppError('E-mail já verificado', 400);
    }

    const existingVerification = await emailVerificationRepository.findByUserId(userId);

    if (existingVerification) {
      const timeSinceCreation = new Date() - new Date(existingVerification.created_at);
      const cooldownMinutes = 5;
      const cooldownMs = cooldownMinutes * 60 * 1000;

      if (timeSinceCreation < cooldownMs) {
        const remainingSeconds = Math.ceil((cooldownMs - timeSinceCreation) / 1000);
        throw new AppError(
          `Aguarde ${remainingSeconds} segundos antes de solicitar um novo e-mail de verificação`,
          429,
        );
      }
    }

    return this.createVerification(userId, { ip, userAgent });
  }
}

export default new EmailVerificationService();
