import pool from '../../../database/pool.js';

const ordersRepository = {
  async createOrder({ usuario_id, total, observacoes, whatsapp, endereco, forma_pagamento }) {
    const [result] = await pool.execute(
      `INSERT INTO pedidos (usuario_id, total, status, observacoes, whatsapp, endereco, forma_pagamento)
       VALUES (?, ?, 'NOVO', ?, ?, ?, ?)`,
      [usuario_id, total, observacoes ?? null, whatsapp ?? null, endereco ?? null, forma_pagamento ?? null]
    );

    return this.findById(result.insertId);
  },

  async createOrderItems(pedido_id, items) {
    const values = items.map(item => [
      pedido_id,
      item.produto_id,
      item.quantidade,
      item.preco_unitario,
      item.nome_produto,
    ]);

    await pool.query(
      `INSERT INTO pedido_itens (pedido_id, produto_id, quantidade, preco_unitario, nome_produto)
       VALUES ?`,
      [values]
    );
  },

  async findById(id) {
    const [[pedido]] = await pool.execute(
      `SELECT
         p.id,
         p.usuario_id,
         p.total,
         p.status,
         p.observacoes,
         p.whatsapp,
         p.endereco,
         p.forma_pagamento,
         p.created_at,
         p.updated_at,
         u.nome AS cliente_nome
       FROM pedidos p
       INNER JOIN usuarios u ON u.id = p.usuario_id
       WHERE p.id = ?`,
      [id]
    );

    if (!pedido) return null;

    const [itens] = await pool.execute(
      `SELECT
         id,
         produto_id,
         quantidade,
         preco_unitario,
         nome_produto
       FROM pedido_itens
       WHERE pedido_id = ?`,
      [id]
    );

    return { ...pedido, itens };
  },

  async findByUserId(usuario_id) {
    const [rows] = await pool.execute(
      `SELECT
         id,
         total,
         status,
         forma_pagamento,
         created_at
       FROM pedidos
       WHERE usuario_id = ?
       ORDER BY created_at DESC`,
      [usuario_id]
    );

    return rows;
  },

  async findAll({ page = 1, limit = 20, status } = {}) {
    const offset = (page - 1) * limit;
    const params = [];
    let where = '';

    if (status) {
      where = 'WHERE p.status = ?';
      params.push(status);
    }

    params.push(limit, offset);

    const [rows] = await pool.execute(
      `SELECT
         p.id,
         p.total,
         p.status,
         p.whatsapp,
         p.forma_pagamento,
         p.created_at,
         u.nome AS cliente_nome
       FROM pedidos p
       INNER JOIN usuarios u ON u.id = p.usuario_id
       ${where}
       ORDER BY p.created_at DESC
       LIMIT ? OFFSET ?`,
      params
    );

    const [[{ total }]] = await pool.execute(
      `SELECT COUNT(*) AS total FROM pedidos p ${where}`,
      status ? [status] : []
    );

    return { data: rows, total, page, limit };
  },

  async updateStatus(id, status) {
    await pool.execute(
      `UPDATE pedidos SET status = ? WHERE id = ?`,
      [status, id]
    );

    return this.findById(id);
  },
};

export default ordersRepository;
