import { body, param } from 'express-validator';

const VALID_STATUSES = [
  'NOVO',
  'AGUARDANDO_PAGAMENTO',
  'PAGO',
  'EM_PREPARO',
  'PRONTO',
  'ENTREGUE',
  'CANCELADO',
];

export const validateCreateOrder = [
  body('whatsapp')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 20 })
    .withMessage('WhatsApp inválido.'),

  body('endereco')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Endereço inválido.'),

  body('forma_pagamento')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Forma de pagamento inválida.'),

  body('observacoes')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Observações muito longas.'),
];

export const validateUpdateStatus = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID inválido.'),

  body('status')
    .notEmpty()
    .withMessage('Status é obrigatório.')
    .isIn(VALID_STATUSES)
    .withMessage(`Status inválido. Use: ${VALID_STATUSES.join(', ')}.`),
];

export const validateOrderId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID inválido.'),
];