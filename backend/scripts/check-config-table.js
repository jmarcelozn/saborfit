import mysql from 'mysql2/promise';
import { databaseConfig } from '../src/config/database.js';

const pool = mysql.createPool(databaseConfig);

pool.query('DESCRIBE configuracoes_loja')
  .then(([rows]) => {
    console.log('configuracoes_loja structure:');
    console.table(rows);
    pool.end();
  })
  .catch(err => {
    console.error('Error:', err);
    pool.end();
  });
