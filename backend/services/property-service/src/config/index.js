module.exports = {
  port: process.env.PORT || 3002,
  mongodb: {
    uri: process.env.MONGO_URI || 'mongodb://localhost:27017/property-db',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  },
  services: {
    auth: process.env.AUTH_SERVICE_URL || 'http://auth-service:3001'
  },
  pagination: {
    defaultLimit: 10,
    maxLimit: 50
  },
  uploads: {
    baseUrl: process.env.UPLOADS_BASE_URL || 'http://localhost:3002/uploads',
    directory: process.env.UPLOADS_DIR || 'uploads'
  },
  serviceName: 'property-service'
};
