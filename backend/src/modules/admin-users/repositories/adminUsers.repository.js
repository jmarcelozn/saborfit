import pool from '../../../database/pool.js';

class AdminUsersRepository {
  async findAll() {
    const [rows] = await pool.query(`
      SELECT
        id,
        nome,
        email,
        role,
        email_verificado,
        created_at
      FROM usuarios
      ORDER BY created_at DESC
    `);

    return rows;
  }

  async findById(id) {
    const [rows] = await pool.query(
      `
      SELECT
        id,
        nome,
        email,
        role,
        email_verificado,
        created_at
      FROM usuarios
      WHERE id = ?
      `,
      [id]
    );

    return rows[0] || null;
  }

  async updateRole(id, role) {
    await pool.query(
      `
      UPDATE usuarios
      SET role = ?
      WHERE id = ?
      `,
      [role, id]
    );

    return this.findById(id);
  }

  async userHasOrders(id) {
    const [rows] = await pool.query(
      `
      SELECT COUNT(*) as count
      FROM pedidos
      WHERE usuario_id = ?
      `,
      [id]
    );

    return rows[0].count > 0;
  }

  async delete(id) {
    const [result] = await pool.query(
      `
      DELETE FROM usuarios
      WHERE id = ?
      `,
      [id]
    );

    return result.affectedRows > 0;
  }
}

export default new AdminUsersRepository();