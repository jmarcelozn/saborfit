import { Router } from 'express';

import authRoutes from '../modules/auth/routes/auth.routes.js';
import healthRoutes from '../modules/health/routes/health.routes.js';
import adminRoutes from '../modules/admin/routes/admin.routes.js';
import adminUsersRoutes from '../modules/admin-users/routes/adminUsers.routes.js';

import productRoutes from '../modules/products/routes/product.routes.js';
import mediaRoutes from '../modules/media/routes/media.routes.js';
import cartRoutes from '../modules/cart/routes/cart.routes.js';
import settingsRoutes from '../modules/settings/routes/settings.routes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);
router.use('/settings', settingsRoutes);
router.use('/media', mediaRoutes);

router.use('/admin', adminRoutes);
router.use('/admin', adminUsersRoutes);

export default router;