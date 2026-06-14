import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import pool from './pool.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationsDir = path.join(__dirname, 'migrations');

const MIGRATIONS_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS migrations (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`;

async function ensureMigrationsTable() {
  await pool.query(MIGRATIONS_TABLE_SQL);
}

async function getExecutedMigrations() {
  const [rows] = await pool.query('SELECT name FROM migrations ORDER BY name ASC');
  return new Set(rows.map((row) => row.name));
}

async function loadMigrationFiles() {
  const files = await readdir(migrationsDir);
  return files
    .filter((file) => file.endsWith('.js'))
    .sort((a, b) => a.localeCompare(b));
}

async function recordMigration(name, connection) {
  await connection.query('INSERT INTO migrations (name) VALUES (?)', [name]);
}

export async function runMigrations() {
  await ensureMigrationsTable();

  const executed = await getExecutedMigrations();
  const files = await loadMigrationFiles();
  const pending = files.filter((file) => !executed.has(file.replace('.js', '')));

  if (pending.length === 0) {
    console.log('Nenhuma migration pendente.');
    return { executed: [], skipped: files.length };
  }

  const executedNow = [];

  for (const file of pending) {
    const migrationPath = pathToFileURL(path.join(migrationsDir, file)).href;
    const migration = await import(migrationPath);
    const name = migration.name || file.replace('.js', '');

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();
      console.log(`Executando migration: ${name}`);
      await migration.up(connection);
      await recordMigration(name, connection);
      await connection.commit();
      executedNow.push(name);
      console.log(`Migration concluída: ${name}`);
    } catch (error) {
      await connection.rollback();
      throw new Error(`Falha na migration "${name}": ${error.message}`);
    } finally {
      connection.release();
    }
  }

  return { executed: executedNow, skipped: files.length - pending.length };
}
