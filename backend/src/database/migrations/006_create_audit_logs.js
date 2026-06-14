export const name = '006_create_audit_logs';

export async function up(connection) {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      usuario_id BIGINT UNSIGNED NULL,
      acao VARCHAR(100) NOT NULL,
      ip VARCHAR(45),
      user_agent TEXT,
      payload JSON NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE SET NULL,
      INDEX idx_audit_logs_usuario_id (usuario_id),
      INDEX idx_audit_logs_acao (acao),
      INDEX idx_audit_logs_created_at (created_at)
    )
  `);
}

export async function down(connection) {
  await connection.query('DROP TABLE IF EXISTS audit_logs');
}
