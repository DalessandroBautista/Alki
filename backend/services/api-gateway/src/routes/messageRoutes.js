const express = require('express');
const axios = require('axios');
const config = require('../config');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const MESSAGING_SERVICE_URL = 'http://localhost:3003';

// Todas las rutas de mensajería requieren autenticación
router.use(authMiddleware);

// Enviar mensaje
router.post('/', async (req, res) => {
  try {
    const response = await axios.post(
      `${MESSAGING_SERVICE_URL}/messages`,
      req.body,
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
    handleAxiosError(error, res, 'enviar mensaje');
  }
});

// Obtener conversaciones
router.get('/conversations', async (req, res) => {
  try {
    const response = await axios.get(
      `${MESSAGING_SERVICE_URL}/messages/conversations`,
      {
        headers: {
          'Authorization': req.headers.authorization
        },
        timeout: 10000
      }
    );
    
    res.status(response.status).json(response.data);
  } catch (error) {
    handleAxiosError(error, res, 'obtener conversaciones');
  }
});

// Crear conversación
router.post('/conversations', async (req, res) => {
  try {
    const response = await axios.post(
      `${MESSAGING_SERVICE_URL}/messages/conversations`,
      req.body,
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
    handleAxiosError(error, res, 'crear conversación');
  }
});

// Obtener mensajes de una conversación
router.get('/conversations/:conversationId', async (req, res) => {
  try {
    const response = await axios.get(
      `${MESSAGING_SERVICE_URL}/messages/conversations/${req.params.conversationId}`,
      {
        headers: {
          'Authorization': req.headers.authorization
        },
        timeout: 10000
      }
    );
    
    res.status(response.status).json(response.data);
  } catch (error) {
    handleAxiosError(error, res, 'obtener mensajes de conversación');
  }
});

// Marcar mensaje como leído
router.put('/:messageId/read', async (req, res) => {
  try {
    const response = await axios.put(
      `${MESSAGING_SERVICE_URL}/messages/${req.params.messageId}/read`,
      {},
      {
        headers: {
          'Authorization': req.headers.authorization
        },
        timeout: 10000
      }
    );
    
    res.status(response.status).json(response.data);
  } catch (error) {
    handleAxiosError(error, res, 'marcar mensaje como leído');
  }
});

// Función para manejar errores
function handleAxiosError(error, res, operation) {
  console.error(`Error al ${operation}:`, error.message);
  
  if (error.response) {
    console.error('Respuesta del servidor:', error.response.data);
    return res.status(error.response.status).json(error.response.data);
  } else if (error.request) {
    console.error('No se recibió respuesta del servicio de mensajería');
    return res.status(503).json({ 
      error: `No se pudo conectar con el servicio de mensajería al ${operation}`
    });
  } else {
    return res.status(500).json({ 
      error: `Error al procesar la solicitud de ${operation}`,
      details: error.message
    });
  }
}

module.exports = router;
