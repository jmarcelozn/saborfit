import { env } from '../../config/env.js';

export function logRequest(req, res, next) {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logData = {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent'),
    };

    if (res.statusCode >= 500) {
      console.error('❌ ERROR:', logData);
    } else if (res.statusCode >= 400) {
      console.warn('⚠️  WARN:', logData);
    } else {
      console.log('✅ INFO:', logData);
    }
  });

  next();
}

export function logError(err, req, res, next) {
  const logData = {
    message: err.message,
    method: req.method,
    path: req.path,
    ip: req.ip,
    status: err.statusCode || res.statusCode,
  };

  if (err instanceof Error && err.name === 'AppError') {
    console.warn('⚠️ Handled AppError:', logData);
  } else {
    console.error('💥 Unhandled Error:', {
      ...logData,
      stack: err.stack,
    });
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
