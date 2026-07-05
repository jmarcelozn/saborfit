import { Router } from 'express';
import authenticate from '../../../shared/middlewares/authenticate.js';
import authorize from '../../../shared/middlewares/authorize.js';
import validate from '../../../shared/middlewares/validate.js';
import ordersController from '../controllers/orders.controller.js';
import {
  validateCreateOrder,
  validateUpdateStatus,
  validateOrderId,
} from '../validators/orders.validators.js';

const router = Router();

router.post(
  '/',
  authenticate,
  validateCreateOrder,
  validate,
  ordersController.createOrder
);

router.get(
  '/my-orders',
  authenticate,
  ordersController.getMyOrders
);

router.get(
  '/admin',
  authenticate,
  authorize('admin'),
  ordersController.adminGetAllOrders
);

router.get(
  '/admin/:id',
  authenticate,
  authorize('admin'),
  validateOrderId,
  validate,
  ordersController.adminGetOrderById
);

router.patch(
  '/admin/:id/status',
  authenticate,
  authorize('admin'),
  validateUpdateStatus,
  validate,
  ordersController.adminUpdateStatus
);

router.get(
  '/:id',
  authenticate,
  validateOrderId,
  validate,
  ordersController.getOrderById
);

export default router;