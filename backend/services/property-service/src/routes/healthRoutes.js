const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Endpoint básico de salud
router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'property-service',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

// Endpoint detallado con estado de conexiones
router.get('/details', async (req, res) => {
  try {
    // Verificar conexión a MongoDB
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    // Verificar conexión a servicios dependientes
    let authServiceStatus = 'unknown';
    try {
      const response = await axios.get(`${config.services.auth}/api/health`, {
        timeout: 3000
      });
      authServiceStatus = response.data.status === 'ok' ? 'connected' : 'error';
    } catch (error) {
      authServiceStatus = 'disconnected';
    }
    
    res.json({
      status: 'ok',
      service: 'property-service',
      version: process.env.npm_package_version || '1.0.0',
      timestamp: new Date(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      dependencies: {
        database: dbStatus,
        authService: authServiceStatus
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

module.exports = router; 