const express = require('express');
const axios = require('axios');
const config = require('../config');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const AUTH_SERVICE_URL = 'http://localhost:3001';

// Register (ya funciona)
router.post('/register', async (req, res) => {
  try {
    console.log('Enviando solicitud a auth service...');
    
    const response = await axios.post(
      `${AUTH_SERVICE_URL}/register`, 
      req.body,
      { 
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
      }
    );
    
    console.log('Respuesta recibida del auth service');
    res.status(response.status).json(response.data);
  } catch (error) {
    handleAxiosError(error, res, 'registro');
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const response = await axios.post(
      `${AUTH_SERVICE_URL}/login`, 
      req.body,
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
      }
    );
    
    res.status(response.status).json(response.data);
  } catch (error) {
    handleAxiosError(error, res, 'inicio de sesión');
  }
});

// Obtener perfil (protegido)
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const response = await axios.get(
      `${AUTH_SERVICE_URL}/profile`,
      {
        headers: {
          'Authorization': req.headers.authorization,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );
    
    res.status(response.status).json(response.data);
  } catch (error) {
    handleAxiosError(error, res, 'obtener perfil');
  }
});

// Cambiar contraseña (protegido)
router.post('/change-password', authMiddleware, async (req, res) => {
  try {
    const response = await axios.post(
      `${AUTH_SERVICE_URL}/change-password`,
      req.body,
      {
        headers: {
          'Authorization': req.headers.authorization,
          'Content-Type': 'application/json'
        },
        timeout: 5000
      }
    );
    
    res.status(response.status).json(response.data);
  } catch (error) {
    handleAxiosError(error, res, 'cambiar contraseña');
  }
});

// Verificación de usuario (para comunicación entre servicios)
router.get('/users/:userId', async (req, res) => {
  try {
    const response = await axios.get(
      `${AUTH_SERVICE_URL}/users/${req.params.userId}`,
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 5000
      }
    );
    
    res.status(response.status).json(response.data);
  } catch (error) {
    handleAxiosError(error, res, 'verificar usuario');
  }
});

// Función auxiliar para manejar errores de axios
function handleAxiosError(error, res, operation) {
  console.error(`Error al ${operation}:`, error.message);
  
  if (error.response) {
    console.error('Respuesta del servidor:', error.response.data);
    return res.status(error.response.status).json(error.response.data);
  } else if (error.request) {
    console.error('No se recibió respuesta del servicio de autenticación');
    return res.status(503).json({ 
      error: `No se pudo conectar con el servicio de autenticación al ${operation}`
    });
  } else {
    return res.status(500).json({ 
      error: `Error al procesar la solicitud de ${operation}`,
      details: error.message
    });
  }
}

module.exports = router;
