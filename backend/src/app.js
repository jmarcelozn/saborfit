import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';

import routes from './routes/index.js';
import { swaggerSpec } from './config/swagger.js';

import { notFound } from './shared/middleware/notFound.js';
import { errorHandler } from './shared/middleware/errorHandler.js';
import { globalRateLimiter } from './shared/middleware/rateLimiter.js';
import {
  logRequest,
  logError,
  healthCheck,
} from './shared/middleware/monitoring.js';

const app = express();

app.set('trust proxy', 1);

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  }),
);

app.use(
  express.json({
    limit: '10kb',
  }),
);

app.use(morgan('dev'));
app.use(logRequest);

app.use(globalRateLimiter);

/**
 * Root Endpoint
 */
app.get('/', (_req, res) => {
  return res.status(200).json({
    success: true,
    application: 'SaborFit API',
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    status: 'online',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/health',
      documentation: '/api/docs',
      auth: '/api/auth',
    },
  });
});

/**
 * Health Check
 */
app.get('/api/health', healthCheck);

/**
 * Swagger Documentation
 */
app.use(
  '/api/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customSiteTitle: 'SaborFit API Docs',
  }),
);

/**
 * Application Routes
 *
 * Todas as rotas ficam abaixo de /api
 *
 * Exemplos:
 * POST /api/auth/register
 * POST /api/auth/login
 * GET  /api/auth/me
 * GET  /api/health
 */
app.use('/api', routes);

/**
 * Error Handling
 */
app.use(notFound);
app.use(logError);
app.use(errorHandler);

export default app;