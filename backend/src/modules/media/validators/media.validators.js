import { body } from 'express-validator';
import { validate } from '../../../shared/middleware/validate.js';

export const deleteImageValidator = validate([
  body('publicId').trim().notEmpty().withMessage('Public ID é obrigatório'),
]);
