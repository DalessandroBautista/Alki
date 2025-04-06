/**
 * Errores personalizados para la aplicación
 */

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Recurso no encontrado') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

class AuthenticationError extends AppError {
  constructor(message = 'No autorizado') {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

class ForbiddenError extends AppError {
  constructor(message = 'Acceso prohibido') {
    super(message, 403);
    this.name = 'ForbiddenError';
  }
}

class ValidationError extends AppError {
  constructor(message = 'Datos inválidos', errors = {}) {
    super(message, 400);
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

class ServiceUnavailableError extends AppError {
  constructor(message = 'Servicio no disponible temporalmente') {
    super(message, 503);
    this.name = 'ServiceUnavailableError';
  }
}

module.exports = {
  AppError,
  NotFoundError,
  AuthenticationError,
  ForbiddenError,
  ValidationError,
  ServiceUnavailableError
};
