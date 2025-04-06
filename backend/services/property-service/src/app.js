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

// Rutas
app.use('/api/properties', propertyRoutes);
app.use('/api/categories', categoryRoutes);

// Error 404
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
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

// Conexión a MongoDB
mongoose
  .connect(config.mongodb.uri)
  .then(() => {
    console.log('Conectado a MongoDB');
    const PORT = config.port || 3002;
    app.listen(PORT, () => {
      console.log(`Servicio de propiedades ejecutándose en el puerto ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error al conectar a MongoDB:', err.message);
    process.exit(1);
  });

module.exports = app;
