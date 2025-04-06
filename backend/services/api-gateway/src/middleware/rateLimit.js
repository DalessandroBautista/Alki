const rateLimit = require('express-rate-limit');
const config = require('../config');

// Limitador general de peticiones
exports.generalLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    message: 'Demasiadas solicitudes, por favor intenta más tarde.'
  }
});

// Limitador más estricto para endpoints críticos
exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // 10 intentos
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    message: 'Demasiados intentos de autenticación, por favor intenta más tarde.'
  }
}); 