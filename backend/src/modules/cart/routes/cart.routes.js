import { Router } from 'express';
import { authenticate } from '../../auth/middlewares/auth.middleware.js';
import { sanitizeBody, preventMassAssignment } from '../../../shared/middleware/sanitizeBody.js';
import {
  addCartItem,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from '../controllers/cart.controller.js';
import { checkout } from '../controllers/checkout.controller.js';
import {
  addCartItemValidator,
  cartItemIdValidator,
  updateCartItemValidator,
} from '../validators/cart.validators.js';

const router = Router();

const CART_ITEM_FIELDS = ['product_id', 'quantity'];

router.use(authenticate);

router.get('/', getCart);
router.post('/', preventMassAssignment, sanitizeBody(CART_ITEM_FIELDS), addCartItemValidator, addCartItem);
router.delete('/', clearCart);
router.patch('/items/:itemId', preventMassAssignment, sanitizeBody(['quantity']), updateCartItemValidator, updateCartItem);
router.delete('/items/:itemId', cartItemIdValidator, removeCartItem);
router.post('/checkout', checkout);

export default router;
