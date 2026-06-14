import pool from '../../../database/pool.js';

export class LoginLogRepository {
  async create({ usuarioId, ip, userAgent, sucesso }) {
    await pool.query(
      `INSERT INTO login_logs (usuario_id, ip, user_agent, sucesso) VALUES (?, ?, ?, ?)`,
      [usuarioId ?? null, ip, userAgent, sucesso],
    );
  }
}

export default new LoginLogRepository();
