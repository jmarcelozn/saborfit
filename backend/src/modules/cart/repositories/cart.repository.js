import pool from '../../../database/pool.js';

export class CartRepository {
  async findActiveByUserId(userId) {
    const [rows] = await pool.query(
      `SELECT id, usuario_id, status, created_at, updated_at
       FROM carrinhos
       WHERE usuario_id = ? AND status = 'ativo'
       LIMIT 1`,
      [userId],
    );

    return rows[0] || null;
  }

  async createActiveCart(userId) {
    const [result] = await pool.query(
      `INSERT INTO carrinhos (usuario_id, status) VALUES (?, 'ativo')`,
      [userId],
    );

    const [rows] = await pool.query(
      `SELECT id, usuario_id, status, created_at, updated_at
       FROM carrinhos
       WHERE id = ?
       LIMIT 1`,
      [result.insertId],
    );

    return rows[0];
  }

  async findItemById(itemId) {
    const [rows] = await pool.query(
      `SELECT id, carrinho_id, produto_id, quantidade, preco_unitario, created_at, updated_at
       FROM carrinho_itens
       WHERE id = ?
       LIMIT 1`,
      [itemId],
    );

    return rows[0] || null;
  }

  async findItemByCartAndProduct(cartId, productId) {
    const [rows] = await pool.query(
      `SELECT id, carrinho_id, produto_id, quantidade, preco_unitario, created_at, updated_at
       FROM carrinho_itens
       WHERE carrinho_id = ? AND produto_id = ?
       LIMIT 1`,
      [cartId, productId],
    );

    return rows[0] || null;
  }

  async findItemsByCartId(cartId) {
    const [rows] = await pool.query(
      `SELECT
         ci.id,
         ci.carrinho_id,
         ci.produto_id,
         ci.quantidade,
         ci.preco_unitario,
         ci.created_at,
         ci.updated_at,
         p.name,
         p.description,
         p.price,
         p.stock_quantity,
         p.is_active,
         (
           SELECT pm.secure_url
           FROM produto_midias pm
           WHERE pm.produto_id = p.id
             AND pm.resource_type = 'image'
           ORDER BY pm.is_primary DESC, pm.sort_order ASC
           LIMIT 1
         ) AS image_url
       FROM carrinho_itens ci
       INNER JOIN produtos p ON p.id = ci.produto_id
       WHERE ci.carrinho_id = ?
       ORDER BY ci.created_at ASC`,
      [cartId],
    );

    return rows;
  }

  async createItem({ cartId, productId, quantity, unitPrice }) {
    const [result] = await pool.query(
      `INSERT INTO carrinho_itens (carrinho_id, produto_id, quantidade, preco_unitario)
       VALUES (?, ?, ?, ?)`,
      [cartId, productId, quantity, unitPrice],
    );

    return this.findItemById(result.insertId);
  }

  async updateItemQuantity(itemId, quantity) {
    await pool.query(
      `UPDATE carrinho_itens SET quantidade = ?, updated_at = NOW() WHERE id = ?`,
      [quantity, itemId],
    );

    return this.findItemById(itemId);
  }

  async removeItem(itemId) {
    await pool.query(`DELETE FROM carrinho_itens WHERE id = ?`, [itemId]);
  }

  async clearItems(cartId) {
    await pool.query(`DELETE FROM carrinho_itens WHERE carrinho_id = ?`, [cartId]);
  }
}

export default new CartRepository();
