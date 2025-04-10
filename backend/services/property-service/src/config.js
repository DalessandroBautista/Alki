module.exports = {
  PORT: process.env.PORT || 3002,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://mongodb:27017/property-db',
  JWT_SECRET: process.env.JWT_SECRET || 'tu_secreto_jwt',
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Configuración de MongoDB
  MONGODB_OPTIONS: {
    connectTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    serverSelectionTimeoutMS: 30000,
  }
}; 