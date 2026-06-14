export const name = '002_create_password_resets';

export async function up(connection) {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS password_resets (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      usuario_id BIGINT UNSIGNED NOT NULL,
      token VARCHAR(255) NOT NULL,
      expires_at DATETIME NOT NULL,
      used BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE
    )
  `);
}

export async function down(connection) {
  await connection.query('DROP TABLE IF EXISTS password_resets');
}
