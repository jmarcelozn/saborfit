import { AppError } from '../errors/AppError.js';

export function sanitizeBody(allowedFields) {
  return (req, _res, next) => {
    if (!req.body || typeof req.body !== 'object') {
      return next();
    }

    const sanitizedBody = {};
    const extraFields = [];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        sanitizedBody[field] = req.body[field];
      }
    }

    for (const field in req.body) {
      if (!allowedFields.includes(field)) {
        extraFields.push(field);
      }
    }

    if (extraFields.length > 0) {
      console.warn(`Campos não permitidos detectados: ${extraFields.join(', ')}`);
    }

    req.body = sanitizedBody;
    next();
  };
}

export function preventMassAssignment(req, _res, next) {
  if (!req.body || typeof req.body !== 'object') {
    return next();
  }

  const dangerousPatterns = [
    /\$where/i,
    /\$ne/i,
    /\$gt/i,
    /\$lt/i,
    /\$in/i,
    /\$or/i,
    /\$and/i,
    /\$not/i,
    /\$regex/i,
    /\$expr/i,
    /__proto__/i,
    /constructor/i,
    /prototype/i,
  ];

  const bodyString = JSON.stringify(req.body);

  for (const pattern of dangerousPatterns) {
    if (pattern.test(bodyString)) {
      throw new AppError('Conteúdo inválido detectado', 400);
    }
  }

  next();
}
