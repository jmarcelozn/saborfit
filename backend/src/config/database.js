import { env } from './env.js';

export const databaseConfig = {
  host: env.db.host,
  port: env.db.port,
  database: env.db.database,
  user: env.db.user,
  password: env.db.password,
  waitForConnections: true,
  connectionLimit: env.db.connectionLimit,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
};
