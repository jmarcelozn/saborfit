import { Router } from 'express';
import { authenticate, authorize } from '../../auth/middlewares/auth.middleware.js';
import { getAdminDashboard } from '../controllers/admin.controller.js';

const router = Router();

router.get('/dashboard', authenticate, authorize('admin'), getAdminDashboard);

export default router;
