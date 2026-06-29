import { Router } from 'express';
import {
  authenticate,
  authorize,
} from '../../auth/middlewares/auth.middleware.js';

import {
  getUsers,
  updateRole,
  deleteUser,
} from '../controllers/adminUsers.controller.js';

const router = Router();

router.get(
  '/users',
  authenticate,
  authorize('admin'),
  getUsers
);

router.patch(
  '/users/:id/role',
  authenticate,
  authorize('admin'),
  updateRole
);

router.delete(
  '/users/:id',
  authenticate,
  authorize('admin'),
  deleteUser
);

export default router;