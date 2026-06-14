import pool from '../../../database/pool.js';

export class EmailVerificationRepository {
  async create({ usuarioId, tokenHash, expiresAt }) {
    await this.invalidateActiveByUserId(usuarioId);

    const [result] = await pool.query(
      `INSERT INTO email_verifications (usuario_id, token, expires_at) VALUES (?, ?, ?)`,
      [usuarioId, tokenHash, expiresAt],
    );

    return result.insertId;
  }

  async findValidByTokenHash(tokenHash) {
    const [rows] = await pool.query(
      `SELECT id, usuario_id, token, expires_at, used
       FROM email_verifications
       WHERE token = ?
         AND used = FALSE
         AND expires_at > NOW()
       LIMIT 1`,
      [tokenHash],
    );

    return rows[0] || null;
  }

  async markAsUsed(id) {
    await pool.query(`UPDATE email_verifications SET used = TRUE WHERE id = ?`, [id]);
  }

  async invalidateActiveByUserId(usuarioId) {
    await pool.query(
      `UPDATE email_verifications SET used = TRUE WHERE usuario_id = ? AND used = FALSE`,
      [usuarioId],
    );
  }

  async findByUserId(usuarioId) {
    const [rows] = await pool.query(
      `SELECT id, usuario_id, token, expires_at, used, created_at
       FROM email_verifications
       WHERE usuario_id = ?
         AND used = FALSE
         AND expires_at > NOW()
       ORDER BY created_at DESC
       LIMIT 1`,
      [usuarioId],
    );

    return rows[0] || null;
  }
}

export default new EmailVerificationRepository();
