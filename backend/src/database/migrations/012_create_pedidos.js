export const name = '012_create_pedidos';

export async function up(connection) {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS pedidos (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      usuario_id BIGINT UNSIGNED NOT NULL,
      total DECIMAL(10, 2) NOT NULL,
      status ENUM('PENDENTE', 'CONFIRMADO', 'PREPARANDO', 'ENVIADO', 'ENTREGUE', 'CANCELADO') NOT NULL DEFAULT 'PENDENTE',
      observacoes TEXT NULL,
      data_entrega DATE NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
      
      INDEX idx_usuario_id (usuario_id),
      INDEX idx_status (status),
      INDEX idx_created_at (created_at)
    )
  `);
}

export async function down(connection) {
  await connection.query('DROP TABLE IF EXISTS pedidos');
}
