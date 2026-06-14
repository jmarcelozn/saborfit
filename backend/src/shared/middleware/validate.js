import { validationResult } from 'express-validator';
import { AppError } from '../errors/AppError.js';

export function validate(validations) {
  return async (req, _res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const details = errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
      }));

      return next(new AppError('Dados inválidos', 422, details));
    }

    next();
  };
}
