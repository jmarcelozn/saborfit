import app from './app.js';
import { env } from './config/env.js';
import pool from './database/pool.js';

const server = app.listen(env.port, () => {
  console.log(`Servidor rodando em http://localhost:${env.port}`);
  console.log(`Ambiente: ${env.nodeEnv}`);
});

async function shutdown(signal) {
  console.log(`\nRecebido ${signal}. Encerrando servidor...`);

  server.close(async () => {
    try {
      await pool.end();
      console.log('Pool de conexões encerrado.');
    } catch (error) {
      console.error('Erro ao encerrar pool:', error.message);
    }

    console.log('Servidor encerrado.');
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
