import { Router } from 'express';
import { authRateLimiter } from '../../../shared/middleware/rateLimiter.js';
import {
  passwordChangeRateLimiter,
  emailVerificationRateLimiter,
  passwordResetRateLimiter,
} from '../../../shared/middleware/userRateLimiter.js';
import { preventMassAssignment } from '../../../shared/middleware/sanitizeBody.js';
import {
  register,
  login,
  getMe,
  forgotPassword,
  validateResetToken,
  resetPassword,
  changePassword,
  verifyEmail,
  resendVerification,
  logoutAll,
} from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  validateResetTokenValidator,
  resetPasswordValidator,
  changePasswordValidator,
  verifyEmailValidator,
  resendVerificationValidator,
} from '../validators/auth.validators.js';

const router = Router();

router.use(authRateLimiter);

router.post('/register', preventMassAssignment, registerValidator, register);
router.post('/login', preventMassAssignment, loginValidator, login);
router.post('/forgot-password', passwordResetRateLimiter, preventMassAssignment, forgotPasswordValidator, forgotPassword);
router.post('/validate-reset-token', preventMassAssignment, validateResetTokenValidator, validateResetToken);
router.post('/reset-password', preventMassAssignment, resetPasswordValidator, resetPassword);
router.post('/verify-email', preventMassAssignment, verifyEmailValidator, verifyEmail);
router.post('/resend-verification', authenticate, emailVerificationRateLimiter, resendVerificationValidator, resendVerification);
router.post('/logout-all', authenticate, logoutAll);
router.patch('/change-password', authenticate, passwordChangeRateLimiter, preventMassAssignment, changePasswordValidator, changePassword);
router.get('/me', authenticate, getMe);

export default router;
