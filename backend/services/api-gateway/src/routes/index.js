const express = require('express');
const authRoutes = require('./authRoutes');
const propertyRoutes = require('./propertyRoutes');
const messageRoutes = require('./messageRoutes');

const router = express.Router();

// Montar todas las rutas
router.use('/auth', authRoutes);
router.use('/properties', propertyRoutes);
router.use('/messages', messageRoutes);

// Ruta para verificar estado del API Gateway
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

module.exports = router;
