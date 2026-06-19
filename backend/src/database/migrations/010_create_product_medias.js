export const name = '010_create_product_medias';

export async function up(connection) {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS produto_midias (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      produto_id BIGINT UNSIGNED NOT NULL,
      public_id VARCHAR(255) NOT NULL,
      secure_url VARCHAR(500) NOT NULL,
      width INT UNSIGNED NULL,
      height INT UNSIGNED NULL,
      format VARCHAR(20) NULL,
      bytes BIGINT UNSIGNED NULL,
      resource_type ENUM('image', 'video') NOT NULL DEFAULT 'image',
      is_primary BOOLEAN NOT NULL DEFAULT FALSE,
      sort_order INT NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      
      FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE,
      
      INDEX idx_produto_id (produto_id),
      INDEX idx_is_primary (is_primary),
      INDEX idx_sort_order (sort_order),
      INDEX idx_produto_primary_sort (produto_id, is_primary DESC, sort_order ASC)
    )
  `);
}

export async function down(connection) {
  await connection.query('DROP TABLE IF EXISTS produto_midias');
}
