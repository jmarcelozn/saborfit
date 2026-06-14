export const name = '005_create_email_verifications';

export async function up(connection) {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS email_verifications (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      usuario_id BIGINT UNSIGNED NOT NULL,
      token VARCHAR(255) NOT NULL,
      expires_at DATETIME NOT NULL,
      used BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE,
      INDEX idx_email_verifications_token (token),
      INDEX idx_email_verifications_usuario_id (usuario_id)
    )
  `);
}

export async function down(connection) {
  await connection.query('DROP TABLE IF EXISTS email_verifications');
}
