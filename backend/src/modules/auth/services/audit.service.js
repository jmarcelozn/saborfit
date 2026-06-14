import auditLogRepository from '../repositories/auditLog.repository.js';

const AUDIT_ACTIONS = {
  USER_REGISTERED: 'USER_REGISTERED',
  USER_LOGIN: 'USER_LOGIN',
  USER_LOGIN_FAILED: 'USER_LOGIN_FAILED',
  USER_LOGOUT: 'USER_LOGOUT',
  USER_LOGOUT_ALL: 'USER_LOGOUT_ALL',
  PASSWORD_CHANGE: 'PASSWORD_CHANGE',
  PASSWORD_RESET_REQUEST: 'PASSWORD_RESET_REQUEST',
  PASSWORD_RESET_COMPLETED: 'PASSWORD_RESET_COMPLETED',
  EMAIL_VERIFICATION_REQUEST: 'EMAIL_VERIFICATION_REQUEST',
  EMAIL_VERIFIED: 'EMAIL_VERIFIED',
  ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',
};

export class AuditService {
  async log({ usuarioId, acao, ip, userAgent, payload }) {
    try {
      await auditLogRepository.create({
        usuarioId,
        acao,
        ip,
        userAgent,
        payload,
      });
    } catch (error) {
      console.error('Failed to create audit log:', error);
    }
  }

  async logUserRegister(usuarioId, ip, userAgent, payload = {}) {
    await this.log({
      usuarioId,
      acao: AUDIT_ACTIONS.USER_REGISTERED,
      ip,
      userAgent,
      payload,
    });
  }

  async logUserLogin(usuarioId, ip, userAgent, payload = {}) {
    await this.log({
      usuarioId,
      acao: AUDIT_ACTIONS.USER_LOGIN,
      ip,
      userAgent,
      payload,
    });
  }

  async logUserLoginFailed(usuarioId, ip, userAgent, payload = {}) {
    await this.log({
      usuarioId,
      acao: AUDIT_ACTIONS.USER_LOGIN_FAILED,
      ip,
      userAgent,
      payload,
    });
  }

  async logUserLogout(usuarioId, ip, userAgent, payload = {}) {
    await this.log({
      usuarioId,
      acao: AUDIT_ACTIONS.USER_LOGOUT,
      ip,
      userAgent,
      payload,
    });
  }

  async logUserLogoutAll(usuarioId, ip, userAgent, payload = {}) {
    await this.log({
      usuarioId,
      acao: AUDIT_ACTIONS.USER_LOGOUT_ALL,
      ip,
      userAgent,
      payload,
    });
  }

  async logPasswordChange(usuarioId, ip, userAgent, payload = {}) {
    await this.log({
      usuarioId,
      acao: AUDIT_ACTIONS.PASSWORD_CHANGE,
      ip,
      userAgent,
      payload,
    });
  }

  async logPasswordResetRequest(usuarioId, ip, userAgent, payload = {}) {
    await this.log({
      usuarioId,
      acao: AUDIT_ACTIONS.PASSWORD_RESET_REQUEST,
      ip,
      userAgent,
      payload,
    });
  }

  async logPasswordResetCompleted(usuarioId, ip, userAgent, payload = {}) {
    await this.log({
      usuarioId,
      acao: AUDIT_ACTIONS.PASSWORD_RESET_COMPLETED,
      ip,
      userAgent,
      payload,
    });
  }

  async logEmailVerificationRequest(usuarioId, ip, userAgent, payload = {}) {
    await this.log({
      usuarioId,
      acao: AUDIT_ACTIONS.EMAIL_VERIFICATION_REQUEST,
      ip,
      userAgent,
      payload,
    });
  }

  async logEmailVerified(usuarioId, ip, userAgent, payload = {}) {
    await this.log({
      usuarioId,
      acao: AUDIT_ACTIONS.EMAIL_VERIFIED,
      ip,
      userAgent,
      payload,
    });
  }

  async logAccountLocked(usuarioId, ip, userAgent, payload = {}) {
    await this.log({
      usuarioId,
      acao: AUDIT_ACTIONS.ACCOUNT_LOCKED,
      ip,
      userAgent,
      payload,
    });
  }
}

export default new AuditService();
export { AUDIT_ACTIONS };
