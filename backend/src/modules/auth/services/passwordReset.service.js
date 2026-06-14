import bcrypt from 'bcrypt';
import { env } from '../../../config/env.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { generateSecureToken, hashToken } from '../../../shared/utils/security.js';
import pool from '../../../database/pool.js';
import userRepository from '../repositories/user.repository.js';
import passwordResetRepository from '../repositories/passwordReset.repository.js';
import auditService from './audit.service.js';
import emailService from '../../../shared/services/email.service.js';

function getResetExpiryDate() {
  const date = new Date();
  date.setHours(date.getHours() + env.security.passwordResetExpiresHours);
  return date;
}

export class PasswordResetService {
  async requestReset(email, { ip, userAgent } = {}) {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      return {
        message: 'Se o e-mail estiver cadastrado, você receberá instruções para redefinir a senha.',
      };
    }

    const rawToken = generateSecureToken();
    const tokenHash = hashToken(rawToken);
    const expiresAt = getResetExpiryDate();

    await passwordResetRepository.create({
      usuarioId: user.id,
      tokenHash,
      expiresAt,
    });

    await auditService.logPasswordResetRequest(user.id, ip, userAgent, { email });

    try {
      await emailService.sendPasswordResetEmail({
        to: user.email,
        token: rawToken,
        userName: user.nome,
      });
    } catch (error) {
      console.error('Erro ao enviar e-mail de reset de senha:', error);
    }

    return {
      message: 'Se o e-mail estiver cadastrado, você receberá instruções para redefinir a senha.',
      ...(env.isProduction
        ? {}
        : {
            resetToken: rawToken,
            expiresAt,
          }),
    };
  }

  async validateToken(rawToken) {
    const tokenHash = hashToken(rawToken);
    const resetRecord = await passwordResetRepository.findValidByTokenHash(tokenHash);

    if (!resetRecord) {
      throw new AppError('Token inválido ou expirado', 400);
    }

    return {
      valid: true,
      expiresAt: resetRecord.expires_at,
    };
  }

  async resetPassword({ token, senha }, { ip, userAgent } = {}) {
    const tokenHash = hashToken(token);
    const resetRecord = await passwordResetRepository.findValidByTokenHash(tokenHash);

    if (!resetRecord) {
      throw new AppError('Token inválido ou expirado', 400);
    }

    const senhaHash = await bcrypt.hash(senha, env.security.bcryptRounds);

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      await connection.query(
        `UPDATE usuarios SET senha = ?, token_version = token_version + 1 WHERE id = ?`,
        [senhaHash, resetRecord.usuario_id],
      );

      await connection.query(
        `UPDATE password_resets SET used = TRUE WHERE id = ?`,
        [resetRecord.id],
      );

      await connection.query(
        `UPDATE usuarios SET tentativas_login = 0, bloqueado_ate = NULL WHERE id = ?`,
        [resetRecord.usuario_id],
      );

      await connection.commit();

      await auditService.logPasswordResetCompleted(resetRecord.usuario_id, ip, userAgent);

      return {
        message: 'Senha redefinida com sucesso',
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

export default new PasswordResetService();
