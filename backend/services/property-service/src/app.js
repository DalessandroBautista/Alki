const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const config = require('./config');
const propertyRoutes = require('./routes/propertyRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`📥 [Property Service] ${req.method} ${req.url}`);
  next();
});

// Rutas
app.use('/api/properties', propertyRoutes);
app.use('/api/categories', categoryRoutes);

// Ruta de health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'property-service',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

// Manejador de errores 404
app.use((req, res) => {
  console.log(`⚠️ Ruta no encontrada: ${req.method} ${req.url}`);
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || 'Error del servidor',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

// Iniciar el servidor después de conectarse a MongoDB
if (require.main === module) {
  mongoose
    .connect(config.mongodb.uri, config.mongodb.options)
    .then(() => {
      console.log('✅ Conectado a MongoDB');
      const PORT = config.port || 3002;
      app.listen(PORT, () => {
        console.log(`🚀 Servicio de propiedades ejecutándose en el puerto ${PORT}`);
        console.log(`📌 Rutas disponibles en: http://localhost:${PORT}/api/properties`);
      });
    })
    .catch((err) => {
      console.error('❌ Error al conectar a MongoDB:', err.message);
      process.exit(1);
    });
}

module.exports = app;
