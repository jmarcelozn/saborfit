import { Router } from 'express';
import { authenticate, authorize } from '../../auth/middlewares/auth.middleware.js';
import { sanitizeBody, preventMassAssignment } from '../../../shared/middleware/sanitizeBody.js';
import {
  getStoreSettings,
  updateStoreSettings,
} from '../controllers/settings.controller.js';
import { updateStoreSettingsValidator } from '../validators/settings.validators.js';

const router = Router();

const SETTINGS_FIELDS = [
  'store_name',
  'description',
  'email',
  'whatsapp',
  'instagram',
  'address',
];

router.get('/', getStoreSettings);

router.put(
  '/',
  authenticate,
  authorize('admin'),
  preventMassAssignment,
  sanitizeBody(SETTINGS_FIELDS),
  updateStoreSettingsValidator,
  updateStoreSettings,
);

export default router;
