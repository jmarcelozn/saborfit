export const name = '013_create_store_settings';

export async function up(connection) {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS configuracoes_loja (
      id TINYINT UNSIGNED NOT NULL PRIMARY KEY DEFAULT 1,
      nome_loja VARCHAR(255) NULL,
      descricao TEXT NULL,
      email VARCHAR(255) NULL,
      whatsapp VARCHAR(30) NULL,
      instagram VARCHAR(255) NULL,
      endereco TEXT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
    )
  `);
}

export async function down(connection) {
  await connection.query('DROP TABLE IF EXISTS configuracoes_loja');
}
