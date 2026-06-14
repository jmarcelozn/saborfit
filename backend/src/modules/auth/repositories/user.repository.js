import pool from '../../../database/pool.js';

const PUBLIC_FIELDS = `
  id, nome, email, role, email_verificado, tentativas_login,
  bloqueado_ate, token_version, created_at, updated_at
`;

export class UserRepository {
  async findByEmail(email) {
    const [rows] = await pool.query(
      `SELECT ${PUBLIC_FIELDS}, senha FROM usuarios WHERE email = ? LIMIT 1`,
      [email],
    );
    return rows[0] || null;
  }

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT ${PUBLIC_FIELDS} FROM usuarios WHERE id = ? LIMIT 1`,
      [id],
    );
    return rows[0] || null;
  }

  async findByIdWithPassword(id) {
    const [rows] = await pool.query(
      `SELECT ${PUBLIC_FIELDS}, senha FROM usuarios WHERE id = ? LIMIT 1`,
      [id],
    );
    return rows[0] || null;
  }

  async create({ nome, email, senhaHash, role = 'user' }) {
    const [result] = await pool.query(
      `INSERT INTO usuarios (nome, email, senha, role) VALUES (?, ?, ?, ?)`,
      [nome, email, senhaHash, role],
    );

    return this.findById(result.insertId);
  }

  async updateLoginAttempts(id, tentativasLogin, bloqueadoAte = null) {
    await pool.query(
      `UPDATE usuarios SET tentativas_login = ?, bloqueado_ate = ? WHERE id = ?`,
      [tentativasLogin, bloqueadoAte, id],
    );
  }

  async resetLoginAttempts(id) {
    await pool.query(
      `UPDATE usuarios SET tentativas_login = 0, bloqueado_ate = NULL WHERE id = ?`,
      [id],
    );
  }

  async updatePassword(id, senhaHash) {
    await pool.query(
      `UPDATE usuarios SET senha = ?, token_version = token_version + 1 WHERE id = ?`,
      [senhaHash, id],
    );
  }

  async incrementTokenVersion(id) {
    await pool.query(
      `UPDATE usuarios SET token_version = token_version + 1 WHERE id = ?`,
      [id],
    );
  }

  async markEmailAsVerified(id) {
    await pool.query(
      `UPDATE usuarios SET email_verificado = TRUE WHERE id = ?`,
      [id],
    );
  }
}

export default new UserRepository();
