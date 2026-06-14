import { env } from '../../../config/env.js';

export function getHealth(_req, res) {
  res.json({
    success: true,
    data: {
      status: 'ok',
      service: 'saborfit-api',
      environment: env.nodeEnv,
      timestamp: new Date().toISOString(),
    },
  });
}
