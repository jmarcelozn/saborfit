import pool from '../../../database/pool.js';

export class AuditLogRepository {
  async create({ usuarioId, acao, ip, userAgent, payload }) {
    const [result] = await pool.query(
      `INSERT INTO audit_logs (usuario_id, acao, ip, user_agent, payload) VALUES (?, ?, ?, ?, ?)`,
      [usuarioId ?? null, acao, ip, userAgent, payload ? JSON.stringify(payload) : null],
    );

    return result.insertId;
  }

  async findByUserId(usuarioId, limit = 100) {
    const [rows] = await pool.query(
      `SELECT id, usuario_id, acao, ip, user_agent, payload, created_at
       FROM audit_logs
       WHERE usuario_id = ?
       ORDER BY created_at DESC
       LIMIT ?`,
      [usuarioId, limit],
    );

    return rows.map(row => ({
      ...row,
      payload: row.payload ? JSON.parse(row.payload) : null,
    }));
  }

  async findByAcao(acao, limit = 100) {
    const [rows] = await pool.query(
      `SELECT id, usuario_id, acao, ip, user_agent, payload, created_at
       FROM audit_logs
       WHERE acao = ?
       ORDER BY created_at DESC
       LIMIT ?`,
      [acao, limit],
    );

    return rows.map(row => ({
      ...row,
      payload: row.payload ? JSON.parse(row.payload) : null,
    }));
  }
}

export default new AuditLogRepository();
