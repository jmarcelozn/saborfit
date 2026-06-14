export const name = '007_add_performance_indexes';

export async function up(connection) {
  await connection.query(`
    CREATE INDEX idx_password_resets_token ON password_resets(token)
  `);

  await connection.query(`
    CREATE INDEX idx_password_resets_usuario_id ON password_resets(usuario_id)
  `);

  await connection.query(`
    CREATE INDEX idx_login_logs_usuario_id ON login_logs(usuario_id)
  `);

  await connection.query(`
    CREATE INDEX idx_login_logs_created_at ON login_logs(created_at)
  `);

  await connection.query(`
    CREATE INDEX idx_usuarios_email ON usuarios(email)
  `);
}

export async function down(connection) {
  await connection.query('DROP INDEX idx_password_resets_token ON password_resets');
  await connection.query('DROP INDEX idx_password_resets_usuario_id ON password_resets');
  await connection.query('DROP INDEX idx_login_logs_usuario_id ON login_logs');
  await connection.query('DROP INDEX idx_login_logs_created_at ON login_logs');
  await connection.query('DROP INDEX idx_usuarios_email ON usuarios');
}
