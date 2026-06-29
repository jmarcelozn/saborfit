import pool from '../../../database/pool.js';
import { AppError } from '../../../shared/errors/AppError.js';

export async function getProductMediaByProductId(produtoId) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      `SELECT * FROM produto_midias 
       WHERE produto_id = ? 
       ORDER BY is_primary DESC, sort_order ASC`,
      [produtoId]
    );
    return rows;
  } finally {
    connection.release();
  }
}

export async function getProductMediaById(mediaId) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      'SELECT * FROM produto_midias WHERE id = ?',
      [mediaId]
    );
    return rows[0] || null;
  } finally {
    connection.release();
  }
}

export async function createProductMedia(mediaData) {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query(
      `INSERT INTO produto_midias 
       (produto_id, public_id, secure_url, width, height, format, bytes, resource_type, is_primary, sort_order) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        mediaData.produto_id,
        mediaData.public_id,
        mediaData.secure_url,
        mediaData.width,
        mediaData.height,
        mediaData.format,
        mediaData.bytes,
        mediaData.resource_type,
        mediaData.is_primary,
        mediaData.sort_order,
      ]
    );

    const [newMedia] = await connection.query(
      'SELECT * FROM produto_midias WHERE id = ?',
      [result.insertId]
    );

    return newMedia[0];
  } finally {
    connection.release();
  }
}

export async function updateProductMedia(mediaId, mediaData) {
  const connection = await pool.getConnection();
  try {
    await connection.query(
      `UPDATE produto_midias 
       SET is_primary = ?, sort_order = ? 
       WHERE id = ?`,
      [mediaData.is_primary, mediaData.sort_order, mediaId]
    );

    const [updatedMedia] = await connection.query(
      'SELECT * FROM produto_midias WHERE id = ?',
      [mediaId]
    );

    return updatedMedia[0];
  } finally {
    connection.release();
  }
}

export async function deleteProductMedia(mediaId) {
  const connection = await pool.getConnection();
  try {
    await connection.query(
      'DELETE FROM produto_midias WHERE id = ?',
      [mediaId]
    );
  } finally {
    connection.release();
  }
}

export async function setPrimaryMedia(mediaId, produtoId) {
  const connection = await pool.getConnection();
  try {
    // Remove primary status from all media for this product
    await connection.query(
      'UPDATE produto_midias SET is_primary = FALSE WHERE produto_id = ?',
      [produtoId]
    );

    // Set primary status for the selected media
    await connection.query(
      'UPDATE produto_midias SET is_primary = TRUE WHERE id = ?',
      [mediaId]
    );
  } finally {
    connection.release();
  }
}
