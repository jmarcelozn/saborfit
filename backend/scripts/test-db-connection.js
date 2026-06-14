import { env } from '../src/config/env.js';
import pool, { testConnection } from '../src/database/pool.js';

async function main() {
  console.log('Testando conexão com MySQL...');
  console.log(`Host: ${env.db.host}:${env.db.port}`);
  console.log(`Database: ${env.db.database}`);
  console.log(`User: ${env.db.user}`);

  try {
    await testConnection();
    const [rows] = await pool.query('SELECT VERSION() AS version, NOW() AS serverTime');
    const info = rows[0];

    console.log('Conexão estabelecida com sucesso!');
    console.log(`MySQL version: ${info.version}`);
    console.log(`Server time: ${info.serverTime}`);
    process.exit(0);
  } catch (error) {
    console.error('Falha ao conectar ao MySQL:');
    console.error(error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
