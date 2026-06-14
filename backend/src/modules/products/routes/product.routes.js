import { Router } from 'express';
import { authenticate, authorize } from '../../auth/middlewares/auth.middleware.js';
import { sanitizeBody, preventMassAssignment } from '../../../shared/middleware/sanitizeBody.js';
import {
  createProduct,
  deleteProduct,
  getProduct,
  listProducts,
  updateProduct,
} from '../controllers/product.controller.js';
import {
  createProductValidator,
  updateProductValidator,
  productIdValidator,
} from '../validators/product.validators.js';

const router = Router();

const PRODUCT_FIELDS = [
  'name',
  'description',
  'price',
  'cost_price',
  'category_id',
  'stock_quantity',
  'is_active',
];

router.use(authenticate, authorize('admin'));

router.get('/', listProducts);
router.get('/:id', productIdValidator, getProduct);
router.post('/', preventMassAssignment, sanitizeBody(PRODUCT_FIELDS), createProductValidator, createProduct);
router.put('/:id', productIdValidator, preventMassAssignment, sanitizeBody(PRODUCT_FIELDS), updateProductValidator, updateProduct);
router.delete('/:id', productIdValidator, deleteProduct);

export default router;
