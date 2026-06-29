import mysql from 'mysql2/promise';
import { databaseConfig } from '../src/config/database.js';

const pool = mysql.createPool(databaseConfig);

pool.query('SHOW TABLES')
  .then(([rows]) => {
    console.log('Tables:', rows.map(r => Object.values(r)[0]));
    pool.end();
  })
  .catch(err => {
    console.error('Error:', err);
    pool.end();
  });
