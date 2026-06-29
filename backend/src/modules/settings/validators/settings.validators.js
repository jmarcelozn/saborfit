import { body } from 'express-validator';
import { validate } from '../../../shared/middleware/validate.js';

export const updateStoreSettingsValidator = validate([
  body('store_name')
    .optional({ values: 'falsy' })
    .isString()
    .withMessage('Nome da loja deve ser um texto')
    .isLength({ max: 255 })
    .withMessage('Nome da loja deve ter no máximo 255 caracteres'),
  body('description')
    .optional({ values: 'falsy' })
    .isString()
    .withMessage('Descrição deve ser um texto'),
  body('email')
    .optional({ values: 'falsy' })
    .isEmail()
    .withMessage('E-mail inválido')
    .normalizeEmail(),
  body('whatsapp')
    .optional({ values: 'falsy' })
    .isString()
    .withMessage('WhatsApp deve ser um texto')
    .isLength({ max: 30 })
    .withMessage('WhatsApp deve ter no máximo 30 caracteres'),
  body('instagram')
    .optional({ values: 'falsy' })
    .isString()
    .withMessage('Instagram deve ser um texto')
    .isLength({ max: 255 })
    .withMessage('Instagram deve ter no máximo 255 caracteres'),
  body('address')
    .optional({ values: 'falsy' })
    .isString()
    .withMessage('Endereço deve ser um texto'),
]);
