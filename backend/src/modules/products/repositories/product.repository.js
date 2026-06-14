import pool from '../../../database/pool.js';

export class ProductRepository {
  async findAll() {
    const [rows] = await pool.query(`
      SELECT id, sku, name, description, price, cost_price, category_id,
        stock_quantity, is_active, created_at, updated_at
      FROM produtos
      ORDER BY created_at DESC
    `);

    return rows;
  }

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT id, sku, name, description, price, cost_price, category_id, stock_quantity, is_active, created_at, updated_at FROM produtos WHERE id = ? LIMIT 1`,
      [id],
    );
    return rows[0] || null;
  }

  async findBySku(sku) {
    const [rows] = await pool.query(
      `SELECT id, sku, name, description, price, cost_price, category_id, stock_quantity, is_active, created_at, updated_at FROM produtos WHERE sku = ? LIMIT 1`,
      [sku],
    );
    return rows[0] || null;
  }

  async create({ sku, name, description, price, cost_price, category_id = null, stock_quantity = 0, is_active = true }) {
    const [result] = await pool.query(
      `INSERT INTO produtos (sku, name, description, price, cost_price, category_id, stock_quantity, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [sku, name, description, price, cost_price, category_id, stock_quantity, is_active],
    );

    return this.findById(result.insertId);
  }

  async update(id, data) {
    const fields = [];
    const values = [];

    if (data.sku !== undefined) {
      fields.push('sku = ?');
      values.push(data.sku);
    }
    if (data.name !== undefined) {
      fields.push('name = ?');
      values.push(data.name);
    }
    if (data.description !== undefined) {
      fields.push('description = ?');
      values.push(data.description);
    }
    if (data.price !== undefined) {
      fields.push('price = ?');
      values.push(data.price);
    }
    if (data.cost_price !== undefined) {
      fields.push('cost_price = ?');
      values.push(data.cost_price);
    }
    if (data.category_id !== undefined) {
      fields.push('category_id = ?');
      values.push(data.category_id);
    }
    if (data.stock_quantity !== undefined) {
      fields.push('stock_quantity = ?');
      values.push(data.stock_quantity);
    }
    if (data.is_active !== undefined) {
      fields.push('is_active = ?');
      values.push(data.is_active);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);

    await pool.query(
      `UPDATE produtos SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`,
      values,
    );

    return this.findById(id);
  }

  async deactivateById(id) {
    await pool.query(
      `UPDATE produtos SET is_active = FALSE, updated_at = NOW() WHERE id = ?`,
      [id],
    );
    return this.findById(id);
  }
}

export default new ProductRepository();
