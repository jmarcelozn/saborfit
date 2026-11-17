import { body, param } from 'express-validator';
import { validate } from '../../../shared/middleware/validate.js';

export const addCartItemValidator = validate([
  body('product_id')
    .isInt({ gt: 0 })
    .withMessage('ID do produto inválido'),
  body('quantity')
    .optional()
    .isInt({ gt: 0 })
    .withMessage('Quantidade deve ser um número inteiro maior que 0'),
]);

export const updateCartItemValidator = validate([
  param('itemId')
    .isInt({ gt: 0 })
    .withMessage('ID do item inválido'),
  body('quantity')
    .isInt({ gt: 0 })
    .withMessage('Quantidade deve ser um número inteiro maior que 0'),
]);

export const cartItemIdValidator = validate([
  param('itemId')
    .isInt({ gt: 0 })
    .withMessage('ID do item inválido'),
]);

export const checkoutValidator = validate([
  body('endereco')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Endereço de entrega é obrigatório.')
    .isLength({ max: 500 })
    .withMessage('Endereço inválido.'),
]);
