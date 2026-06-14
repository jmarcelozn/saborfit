export const name = '001_create_usuarios';

export async function up(connection) {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(120) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      senha VARCHAR(255) NOT NULL,
      email_verificado BOOLEAN DEFAULT FALSE,
      tentativas_login INT DEFAULT 0,
      bloqueado_ate DATETIME NULL,
      token_version INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
}

export async function down(connection) {
  await connection.query('DROP TABLE IF EXISTS usuarios');
}
