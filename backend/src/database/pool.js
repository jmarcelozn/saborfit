import mysql from 'mysql2/promise';
import { databaseConfig } from '../config/database.js';

const pool = mysql.createPool(databaseConfig);

export async function testConnection() {
  const connection = await pool.getConnection();

  try {
    await connection.ping();
    return true;
  } finally {
    connection.release();
  }
}

export default pool;
