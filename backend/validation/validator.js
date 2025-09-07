// validator.js
import { body, validationResult } from 'express-validator';

// ==========================
// USER VALIDATION
// ==========================
export const userValidation = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters long')
    .isString().withMessage('Name must be a string'),

  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Email format is incorrect'),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must contain 8 characters or more')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase alphabet')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase alphabet')
    .matches(/[0-9]/).withMessage('Password must contain at least one numeric value')
    .matches(/[@#$?_-]/).withMessage('Password must contain at least one special character'),
];

// ==========================
// PASSWORD VALIDATION
// ==========================
export const passwordValidation = [
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must contain 8 characters or more')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase alphabet')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase alphabet')
    .matches(/[0-9]/).withMessage('Password must contain at least one numeric value')
    .matches(/[@#$?_-]/).withMessage('Password must contain at least one special character'),
];

// ==========================
// VALIDATION RESULT HANDLER
// ==========================
export const validation = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  return res.status(400).json({ error: errors.array()[0].msg });
};
