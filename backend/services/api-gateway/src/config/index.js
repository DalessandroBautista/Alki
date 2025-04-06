module.exports = {
  port: process.env.PORT || 8000,
  services: {
    auth: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
    property: process.env.PROPERTY_SERVICE_URL || 'http://localhost:3002',
    messaging: process.env.MESSAGING_SERVICE_URL || 'http://localhost:3003'
  },
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'tu_clave_secreta',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100 // límite de solicitudes por ventana
  }
};
