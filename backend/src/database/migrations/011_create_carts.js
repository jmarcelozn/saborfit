export const name = '011_create_carts';

export async function up(connection) {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS carrinhos (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      usuario_id BIGINT UNSIGNED NOT NULL,
      status ENUM('ativo', 'convertido', 'abandonado')
        NOT NULL DEFAULT 'ativo',

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

      FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE,

      INDEX idx_usuario_id (usuario_id),
      INDEX idx_status (status)
    )
  `);
}

export async function down(connection) {
  await connection.query(`
    DROP TABLE IF EXISTS carrinhos
  `);
}