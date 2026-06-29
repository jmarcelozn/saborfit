export const name = '013_create_pedido_itens';

export async function up(connection) {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS pedido_itens (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      pedido_id BIGINT UNSIGNED NOT NULL,
      produto_id BIGINT UNSIGNED NOT NULL,
      quantidade INT NOT NULL DEFAULT 1,
      preco_unitario DECIMAL(10, 2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      
      FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
      FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE,
      
      INDEX idx_pedido_id (pedido_id),
      INDEX idx_produto_id (produto_id)
    )
  `);
}

export async function down(connection) {
  await connection.query('DROP TABLE IF EXISTS pedido_itens');
}
