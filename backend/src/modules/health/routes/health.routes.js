import { Router } from 'express';
import { getHealth } from '../controllers/health.controller.js';

/**
 * @swagger
 * tags:
 *   - name: Health
 *     description: Endpoints de verificação de saúde da aplicação
 */

/**
 * @swagger
 * /api/health:
 *   get:
 *     tags: [Health]
 *     summary: Verificar status do servidor
 *     responses:
 *       200:
 *         description: Serviço online
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 application:
 *                   type: string
 *                   example: SaborFit API
 *                 status:
 *                   type: string
 *                   example: online
 */

const router = Router();

router.get('/', getHealth);

export default router;
