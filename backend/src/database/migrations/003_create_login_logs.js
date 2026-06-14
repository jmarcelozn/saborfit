export const name = '003_create_login_logs';

export async function up(connection) {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS login_logs (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      usuario_id BIGINT UNSIGNED NULL,
      ip VARCHAR(45),
      user_agent TEXT,
      sucesso BOOLEAN,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE SET NULL
    )
  `);
}

export async function down(connection) {
  await connection.query('DROP TABLE IF EXISTS login_logs');
}
