import { body, param } from 'express-validator';
import { validate } from '../../../shared/middleware/validate.js';

const productFields = [
  'name',
  'description',
  'price',
  'cost_price',
  'category_id',
  'stock_quantity',
  'is_active',
];

export const createProductValidator = validate([
  body('name').trim().notEmpty().withMessage('Nome é obrigatório'),
  body('description').optional().isString().withMessage('Descrição deve ser um texto'),
  body('price').isFloat({ gt: 0 }).withMessage('Preço deve ser um número maior que 0'),
  body('cost_price').isFloat({ min: 0 }).withMessage('Preço de custo deve ser um número maior ou igual a 0'),
  body('category_id')
    .optional({ nullable: true })
    .isInt({ gt: 0 })
    .withMessage('category_id inválido'),
  body('stock_quantity').optional().isInt({ min: 0 }).withMessage('Quantidade em estoque deve ser um número inteiro maior ou igual a 0'),
  body('is_active').optional().isBoolean().withMessage('is_active deve ser booleano'),
]);

export const updateProductValidator = validate([
  body('name').optional().trim().notEmpty().withMessage('Nome não pode ficar vazio'),
  body('description').optional().isString().withMessage('Descrição deve ser um texto'),
  body('price').optional().isFloat({ gt: 0 }).withMessage('Preço deve ser um número maior que 0'),
  body('cost_price').optional().isFloat({ min: 0 }).withMessage('Preço de custo deve ser um número maior ou igual a 0'),
  body('category_id')
    .optional({ nullable: true })
    .isInt({ gt: 0 })
    .withMessage('category_id inválido'),
  body('stock_quantity').optional().isInt({ min: 0 }).withMessage('Quantidade em estoque deve ser um número inteiro maior ou igual a 0'),
  body('is_active').optional().isBoolean().withMessage('is_active deve ser booleano'),
]);

export const productIdValidator = validate([
  param('id').isInt({ gt: 0 }).withMessage('ID do produto inválido'),
]);
