import { config } from 'dotenv';
import crypto from 'node:crypto';

config();

function requireEnv(key, fallback) {
  const value = process.env[key] ?? fallback;

  if (value === undefined || value === '') {
    throw new Error(`Variável de ambiente obrigatória não definida: ${key}`);
  }

  return value;
}

function validateJwtSecret(secret) {
  if (typeof secret !== 'string') {
    throw new Error('JWT_SECRET deve ser uma string');
  }

  if (secret.length < 32) {
    throw new Error('JWT_SECRET deve ter no mínimo 32 caracteres para segurança adequada');
  }

  const entropy = crypto.randomBytes(32).toString('hex').length;
  if (secret.length < entropy) {
    console.warn('⚠️  JWT_SECRET pode ter baixa entropia. Use um segredo mais forte e aleatório.');
  }

  return secret;
}

function validateBcryptRounds(rounds) {
  const numRounds = Number(rounds);

  if (isNaN(numRounds)) {
    throw new Error('BCRYPT_ROUNDS deve ser um número');
  }

  if (numRounds < 10) {
    throw new Error('BCRYPT_ROUNDS deve ser no mínimo 10 para segurança adequada');
  }

  if (numRounds > 14) {
    console.warn('⚠️  BCRYPT_ROUNDS acima de 14 pode causar lentidão excessiva. Recomendado: 12-14');
  }

  return numRounds;
}

const jwtSecret = validateJwtSecret(requireEnv('JWT_SECRET'));
const bcryptRounds = validateBcryptRounds(process.env.BCRYPT_ROUNDS || 12);

export const env = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',

  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    database: requireEnv('DB_NAME', 'saborfit_db'),
    user: requireEnv('DB_USER', 'root'),
    password: process.env.DB_PASSWORD || '',
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 10,
  },

  jwt: {
    secret: jwtSecret,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    issuer: process.env.JWT_ISSUER || 'saborfit-api',
    audience: process.env.JWT_AUDIENCE || 'saborfit-client',
  },

  security: {
    bcryptRounds,
    maxLoginAttempts: Number(process.env.MAX_LOGIN_ATTEMPTS) || 5,
    lockoutMinutes: Number(process.env.LOCKOUT_MINUTES) || 15,
    passwordResetExpiresHours: Number(process.env.PASSWORD_RESET_EXPIRES_HOURS) || 1,
  },

  rateLimit: {
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: Number(process.env.RATE_LIMIT_MAX) || 100,
    authMax: Number(process.env.RATE_LIMIT_AUTH_MAX) || 20,
  },

  email: {
    service: process.env.EMAIL_SERVICE || 'console',
    from: process.env.EMAIL_FROM || 'noreply@saborfit.com',
    awsSesRegion: process.env.AWS_SES_REGION || 'us-east-1',
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sendgridApiKey: process.env.SENDGRID_API_KEY,
    smtpHost: process.env.SMTP_HOST,
    smtpPort: Number(process.env.SMTP_PORT) || 587,
    smtpUser: process.env.SMTP_USER,
    smtpPass: process.env.SMTP_PASS,
  },
};
