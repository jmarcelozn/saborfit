import { body } from 'express-validator';
import { validate } from '../../../shared/middleware/validate.js';

const passwordRules = body('senha')
  .notEmpty()
  .withMessage('Senha é obrigatória');

export const registerValidator = validate([
  body('nome')
    .trim()
    .notEmpty()
    .withMessage('Nome é obrigatório')
    .isLength({ min: 2, max: 120 })
    .withMessage('Nome deve ter entre 2 e 120 caracteres')
    .escape(),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('E-mail é obrigatório')
    .isEmail()
    .withMessage('E-mail inválido')
    .normalizeEmail(),

  passwordRules,
]);

export const loginValidator = validate([
  body('email')
    .trim()
    .notEmpty()
    .withMessage('E-mail é obrigatório')
    .isEmail()
    .withMessage('E-mail inválido')
    .normalizeEmail(),

  body('senha')
    .notEmpty()
    .withMessage('Senha é obrigatória'),
]);

export const forgotPasswordValidator = validate([
  body('email')
    .trim()
    .notEmpty()
    .withMessage('E-mail é obrigatório')
    .isEmail()
    .withMessage('E-mail inválido')
    .normalizeEmail(),
]);

export const validateResetTokenValidator = validate([
  body('token')
    .trim()
    .notEmpty()
    .withMessage('Token é obrigatório'),
]);

export const resetPasswordValidator = validate([
  body('token')
    .trim()
    .notEmpty()
    .withMessage('Token é obrigatório'),

  passwordRules,
]);

export const changePasswordValidator = validate([
  body('senhaAtual')
    .notEmpty()
    .withMessage('Senha atual é obrigatória'),

  body('novaSenha')
    .notEmpty()
    .withMessage('Nova senha é obrigatória'),
]);

export const verifyEmailValidator = validate([
  body('token')
    .trim()
    .notEmpty()
    .withMessage('Token é obrigatório'),
]);

export const resendVerificationValidator = validate([]);