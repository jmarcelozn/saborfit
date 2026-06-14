import bcrypt from 'bcrypt';
import { env } from '../../config/env.js';

export const name = '008_add_user_roles';

export async function up(connection) {
  const [columns] = await connection.query(`SHOW COLUMNS FROM usuarios LIKE 'role'`);

  if (columns.length === 0) {
    await connection.query(`ALTER TABLE usuarios ADD COLUMN role VARCHAR(50) NOT NULL DEFAULT 'user'`);
  }

  const [existingAdmin] = await connection.query(
    `SELECT id FROM usuarios WHERE email = ? LIMIT 1`,
    ['admin@saborfit.local'],
  );

  if (existingAdmin.length === 0) {
    const senhaHash = await bcrypt.hash('Admin123!', env.security.bcryptRounds);
    await connection.query(
      `INSERT INTO usuarios (nome, email, senha, role, email_verificado) VALUES (?, ?, ?, 'admin', TRUE)`,
      ['Administrador', 'admin@saborfit.local', senhaHash],
    );
  }
}

export async function down(connection) {
  await connection.query(`ALTER TABLE usuarios DROP COLUMN IF EXISTS role`);
}
