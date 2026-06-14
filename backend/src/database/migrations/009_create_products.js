export const name = '009_create_products';

export async function up(connection) {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS produtos (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      sku VARCHAR(100) NOT NULL UNIQUE,
      name VARCHAR(255) NOT NULL,
      description TEXT NULL,
      price DECIMAL(10, 2) NOT NULL,
      cost_price DECIMAL(10, 2) NOT NULL,
      category_id BIGINT UNSIGNED NULL,
      stock_quantity INT NOT NULL DEFAULT 0,
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
}

export async function down(connection) {
  await connection.query('DROP TABLE IF EXISTS produtos');
}
