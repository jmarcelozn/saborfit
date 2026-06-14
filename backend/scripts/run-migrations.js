import { runMigrations } from '../src/database/migrate.js';
import pool from '../src/database/pool.js';

async function main() {
  console.log('Iniciando execução de migrations...');

  try {
    const result = await runMigrations();

    console.log('\nResumo:');
    console.log(`- Executadas: ${result.executed.length}`);
    console.log(`- Já existentes: ${result.skipped}`);

    if (result.executed.length > 0) {
      console.log('\nMigrations aplicadas:');
      result.executed.forEach((name) => console.log(`  ✓ ${name}`));
    }

    process.exit(0);
  } catch (error) {
    console.error('\nErro ao executar migrations:');
    console.error(error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
