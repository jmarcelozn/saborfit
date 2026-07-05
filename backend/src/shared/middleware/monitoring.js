import { env } from '../../config/env.js';

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  gray: '\x1b[90m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
};

function formatDuration(ms) {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

function getStatusEmoji(status) {
  if (status >= 500) return '❌';
  if (status >= 400) return 'ℹ️ ';
  if (status >= 300) return '↪️ ';
  return '✅';
}

function getStatusLevel(status) {
  if (status >= 500) return 'ERROR';
  if (status === 401 || status === 403) return 'AUTH';
  if (status >= 400) return 'WARN';
  return 'INFO';
}

export function logRequest(req, res, next) {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const status = res.statusCode;
    const level = getStatusLevel(status);
    const emoji = getStatusEmoji(status);
    
    // Ignore health check logs
    if (req.path === '/api/health') return;

    const statusColor = status >= 500 ? colors.red : status >= 400 ? colors.yellow : colors.green;
    const logLine = `${emoji} [${level}] ${colors.cyan}${req.method}${colors.reset} ${req.path} ${statusColor}${status}${colors.reset} ${colors.gray}${formatDuration(duration)}${colors.reset}`;
    
    if (level === 'ERROR') {
      console.error(logLine);
    } else if (level === 'AUTH' || level === 'WARN') {
      console.warn(logLine);
    } else {
      console.log(logLine);
    }
  });

  next();
}

export function logError(err, req, res, next) {
  // Ignore health check errors
  if (req.path === '/api/health') return next(err);

  const status = err.statusCode || res.statusCode || 500;
  const isAuthError = status === 401 || status === 403;
  
  if (isAuthError) {
    // Silent for known auth issues (expired token, invalid credentials, etc)
    if (env.nodeEnv !== 'production') {
      const authMsg = `ℹ️  [AUTH] ${req.method} ${req.path} - ${err.message}`;
      console.debug(colors.gray + authMsg + colors.reset);
    }
  } else {
    // Log real errors with full details
    const errorData = {
      timestamp: new Date().toISOString(),
      level: status >= 500 ? 'ERROR' : 'WARN',
      status,
      method: req.method,
      path: req.path,
      message: err.message,
      ip: req.ip,
      ...(env.nodeEnv !== 'production' && { stack: err.stack }),
    };

    if (status >= 500) {
      console.error(`\n${'='.repeat(60)}`);
      console.error(`❌ [ERROR] Internal Server Error`);
      console.error(JSON.stringify(errorData, null, 2));
      console.error(`${'='.repeat(60)}\n`);
    } else {
      console.warn(`\n${'-'.repeat(60)}`);
      console.warn(`⚠️  [WARN] ${err.message}`);
      console.warn(JSON.stringify({
        method: req.method,
        path: req.path,
        status,
        ip: req.ip,
      }, null, 2));
      console.warn(`${'-'.repeat(60)}\n`);
    }
  }

  next(err);
}

export function healthCheck(req, res) {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: env.nodeEnv,
    memory: {
      used: process.memoryUsage().heapUsed / 1024 / 1024,
      total: process.memoryUsage().heapTotal / 1024 / 1024,
    },
  };

  res.json(health);
}

export function logSecurityEvent(event, data) {
  const logData = {
    timestamp: new Date().toISOString(),
    event,
    ...data,
  };

  console.log('🔒 SECURITY:', JSON.stringify(logData));
}
