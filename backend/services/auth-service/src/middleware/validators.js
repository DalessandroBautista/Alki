const { body, validationResult } = require('express-validator');

exports.validateRegister = [
  body('email').isEmail().withMessage('Ingresa un email válido'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
  body('apellido').notEmpty().withMessage('El apellido es obligatorio'),
  
  // Middleware para manejar errores de validación
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

exports.validateLogin = [
  body('email').isEmail().withMessage('Ingresa un email válido'),
  body('password').notEmpty().withMessage('La contraseña es obligatoria'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
]; 