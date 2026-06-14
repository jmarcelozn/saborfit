import pool from '../../../database/pool.js';

export class PasswordResetRepository {
  async create({ usuarioId, tokenHash, expiresAt }) {
    await this.invalidateActiveByUserId(usuarioId);

    const [result] = await pool.query(
      `INSERT INTO password_resets (usuario_id, token, expires_at) VALUES (?, ?, ?)`,
      [usuarioId, tokenHash, expiresAt],
    );

    return result.insertId;
  }

  async findValidByTokenHash(tokenHash) {
    const [rows] = await pool.query(
      `SELECT id, usuario_id, token, expires_at, used
       FROM password_resets
       WHERE token = ?
         AND used = FALSE
         AND expires_at > NOW()
       LIMIT 1`,
      [tokenHash],
    );

    return rows[0] || null;
  }

  async markAsUsed(id) {
    await pool.query(`UPDATE password_resets SET used = TRUE WHERE id = ?`, [id]);
  }

  async invalidateActiveByUserId(usuarioId) {
    await pool.query(
      `UPDATE password_resets SET used = TRUE WHERE usuario_id = ? AND used = FALSE`,
      [usuarioId],
    );
  }
}

export default new PasswordResetRepository();
