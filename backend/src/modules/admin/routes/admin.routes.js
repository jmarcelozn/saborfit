import { Router } from 'express';
import { authenticate, authorize } from '../../auth/middlewares/auth.middleware.js';
import { getAdminDashboard } from '../controllers/admin.controller.js';

/**
 * @swagger
 * tags:
 *   - name: Admin
 *     description: Endpoints de administração restritos a usuários admin
 */

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     tags: [Admin]
 *     summary: Obter dados de dashboard administrativos
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Dados de dashboard retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *       401:
 *         description: Autenticação necessária
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Acesso negado para usuários sem permissão
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

const router = Router();

router.get('/dashboard', authenticate, authorize('admin'), getAdminDashboard);

export default router;
