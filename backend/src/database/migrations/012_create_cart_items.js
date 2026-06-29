export const name = '012_create_cart_items';

export async function up(connection) {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS carrinho_itens (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

      carrinho_id BIGINT UNSIGNED NOT NULL,
      produto_id BIGINT UNSIGNED NOT NULL,

      quantidade INT UNSIGNED NOT NULL DEFAULT 1,

      preco_unitario DECIMAL(10,2) NOT NULL,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

      FOREIGN KEY (carrinho_id)
        REFERENCES carrinhos(id)
        ON DELETE CASCADE,

      FOREIGN KEY (produto_id)
        REFERENCES produtos(id)
        ON DELETE CASCADE,

      UNIQUE KEY uk_cart_product (
        carrinho_id,
        produto_id
      ),

      INDEX idx_carrinho_id (carrinho_id),
      INDEX idx_produto_id (produto_id)
    )
  `);
}

export async function down(connection) {
  await connection.query(`
    DROP TABLE IF EXISTS carrinho_itens
  `);
}