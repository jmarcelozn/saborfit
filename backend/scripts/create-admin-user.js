import bcrypt from 'bcrypt';
import pool from '../src/database/pool.js';
import { env } from '../src/config/env.js';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@saborfit.local';
const ADMIN_NAME = process.env.ADMIN_NAME || 'Administrador';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin123!';
const ADMIN_ROLE = 'admin';

async function main() {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [roleColumn] = await connection.query(`SHOW COLUMNS FROM usuarios LIKE 'role'`);

    if (roleColumn.length === 0) {
      await connection.query(`ALTER TABLE usuarios ADD COLUMN role VARCHAR(50) NOT NULL DEFAULT 'user'`);
      console.log('Coluna role criada na tabela usuarios.');
    }

    const [existing] = await connection.query(
      'SELECT id, role FROM usuarios WHERE email = ? LIMIT 1',
      [ADMIN_EMAIL],
    );

    if (existing.length > 0) {
      const user = existing[0];

      if (user.role === ADMIN_ROLE) {
        console.log(`Usuário admin já existe: ${ADMIN_EMAIL}`);
      } else {
        await connection.query(
          'UPDATE usuarios SET role = ? WHERE id = ?',
          [ADMIN_ROLE, user.id],
        );
        console.log(`Usuário existente atualizado para admin: ${ADMIN_EMAIL}`);
      }
    } else {
      const senhaHash = await bcrypt.hash(ADMIN_PASSWORD, env.security.bcryptRounds);

      await connection.query(
        'INSERT INTO usuarios (nome, email, senha, role, email_verificado, tentativas_login, token_version, created_at, updated_at) VALUES (?, ?, ?, ?, TRUE, 0, 1, NOW(), NOW())',
        [ADMIN_NAME, ADMIN_EMAIL, senhaHash, ADMIN_ROLE],
      );

      console.log(`Usuário admin criado: ${ADMIN_EMAIL}`);
      console.log(`Senha padrão: ${ADMIN_PASSWORD}`);
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    console.error('Erro ao criar usuário admin:', error.message);
    process.exit(1);
  } finally {
    connection.release();
    await pool.end();
  }
}

main();
