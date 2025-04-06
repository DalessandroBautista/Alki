module.exports = {
  port: process.env.PORT || 3003,
  mongodb: {
    uri: process.env.MONGO_URI || 'mongodb://localhost:27017/messaging-db',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  },
  services: {
    auth: process.env.AUTH_SERVICE_URL || 'http://auth-service:3001',
    property: process.env.PROPERTY_SERVICE_URL || 'http://property-service:3002'
  },
  pagination: {
    defaultLimit: 20,
    maxLimit: 100
  },
  notifications: {
    email: {
      enabled: process.env.EMAIL_NOTIFICATIONS_ENABLED === 'true' || false,
      from: process.env.EMAIL_FROM || 'notificaciones@alquileresapp.com'
    },
    push: {
      enabled: process.env.PUSH_NOTIFICATIONS_ENABLED === 'true' || false
    }
  },
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'tu_clave_secreta',
    expiresIn: '7d'
  },
  serviceName: 'messaging-service'
};
