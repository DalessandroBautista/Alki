const winston = require('winston');
const { format, transports } = winston;

// Formato personalizado
const customFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.errors({ stack: true }),
  format.splat(),
  format.json()
);

// Niveles de log personalizados
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Obtener nivel según entorno
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  return env === 'development' ? 'debug' : 'info';
};

// Crear instancia de logger
const logger = winston.createLogger({
  level: level(),
  levels,
  format: customFormat,
  transports: [
    // Error logs
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    // Todos los logs
    new transports.File({ filename: 'logs/combined.log' }),
    // Logs en consola (solo en desarrollo)
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple()
      )
    })
  ],
});

// Añadir datos del servicio
const attachServiceInfo = (serviceName) => {
  return {
    log: (level, message, meta = {}) => {
      logger[level](message, { 
        service: serviceName, 
        ...meta 
      });
    },
    error: (message, meta = {}) => {
      logger.error(message, { 
        service: serviceName, 
        ...meta 
      });
    },
    warn: (message, meta = {}) => {
      logger.warn(message, { 
        service: serviceName, 
        ...meta 
      });
    },
    info: (message, meta = {}) => {
      logger.info(message, { 
        service: serviceName, 
        ...meta 
      });
    },
    debug: (message, meta = {}) => {
      logger.debug(message, { 
        service: serviceName, 
        ...meta 
      });
    },
    http: (message, meta = {}) => {
      logger.http(message, { 
        service: serviceName, 
        ...meta 
      });
    }
  };
};

module.exports = {
  logger,
  attachServiceInfo
}; 