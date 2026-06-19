import { Router } from 'express';

import authRoutes from '../modules/auth/routes/auth.routes.js';
import healthRoutes from '../modules/health/routes/health.routes.js';
import adminRoutes from '../modules/admin/routes/admin.routes.js';
import productRoutes from '../modules/products/routes/product.routes.js';
import mediaRoutes from '../modules/media/routes/media.routes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/media', mediaRoutes);
router.use('/admin', adminRoutes);

export default router;