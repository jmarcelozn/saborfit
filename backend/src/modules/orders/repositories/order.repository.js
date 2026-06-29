import pool from '../../../database/pool.js';
import { AppError } from '../../../shared/errors/AppError.js';

export async function createOrder(orderData) {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query(
      `INSERT INTO pedidos 
       (usuario_id, total, status, observacoes, data_entrega) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        orderData.usuario_id,
        orderData.total,
        orderData.status || 'PENDENTE',
        orderData.observacoes || null,
        orderData.data_entrega || null,
      ]
    );

    const [newOrder] = await connection.query(
      'SELECT * FROM pedidos WHERE id = ?',
      [result.insertId]
    );

    return newOrder[0];
  } finally {
    connection.release();
  }
}

export async function createOrderItem(itemData) {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query(
      `INSERT INTO pedido_itens 
       (pedido_id, produto_id, quantidade, preco_unitario) 
       VALUES (?, ?, ?, ?)`,
      [
        itemData.pedido_id,
        itemData.produto_id,
        itemData.quantidade,
        itemData.preco_unitario,
      ]
    );

    const [newItem] = await connection.query(
      'SELECT * FROM pedido_itens WHERE id = ?',
      [result.insertId]
    );

    return newItem[0];
  } finally {
    connection.release();
  }
}

export async function getOrderById(orderId) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      'SELECT * FROM pedidos WHERE id = ?',
      [orderId]
    );
    return rows[0] || null;
  } finally {
    connection.release();
  }
}

export async function getOrderByUserId(userId) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      'SELECT * FROM pedidos WHERE usuario_id = ? ORDER BY created_at DESC',
      [userId]
    );
    return rows;
  } finally {
    connection.release();
  }
}

export async function getOrderItems(orderId) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      `SELECT 
        pi.*,
        p.name as produto_nome,
        p.sku as produto_sku
      FROM pedido_itens pi
      JOIN produtos p ON p.id = pi.produto_id
      WHERE pi.pedido_id = ?`,
      [orderId]
    );
    return rows;
  } finally {
    connection.release();
  }
}

export async function updateOrderStatus(orderId, status) {
  const connection = await pool.getConnection();
  try {
    await connection.query(
      'UPDATE pedidos SET status = ? WHERE id = ?',
      [status, orderId]
    );

    const [updatedOrder] = await connection.query(
      'SELECT * FROM pedidos WHERE id = ?',
      [orderId]
    );

    return updatedOrder[0];
  } finally {
    connection.release();
  }
}
