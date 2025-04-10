const express = require('express');
const axios = require('axios');
const config = require('../config');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const PROPERTY_SERVICE_URL = process.env.PROPERTY_SERVICE_URL || 'http://localhost:3002/api';

console.log('🔧 [API Gateway] Configurado para comunicarse con el servicio de propiedades en:', PROPERTY_SERVICE_URL);

// Middleware para logging (para depuración)
router.use((req, res, next) => {
  console.log(`[Property Routes] ${req.method} ${req.path}`);
  next();
});

// Obtener todas las propiedades
router.get('/', async (req, res) => {
  try {
    const propertyServiceUrl = `${config.services.property}/properties`;
    console.log(`🔄 Enviando solicitud a: ${propertyServiceUrl}`);
    
    const response = await axios.get(propertyServiceUrl);
    res.json(response.data);
  } catch (error) {
    console.error('Error al obtener propiedades:', error.message);
    if (error.response) {
      console.error('Detalles de la respuesta:', error.response.status, error.response.data);
    }
    res.status(500).json({ error: 'Error al recuperar propiedades' });
  }
});

// Propiedades destacadas
router.get('/featured', async (req, res) => {
  try {
    console.log('🔍 [API Gateway] Solicitando propiedades destacadas');
    
    const response = await axios.get(
      `${PROPERTY_SERVICE_URL}/properties/featured`,
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 5000
      }
    );
    
    console.log(`✅ [API Gateway] Recibidas ${response.data.length || 0} propiedades destacadas`);
    res.status(response.status).json(response.data);
  } catch (error) {
    handleAxiosError(error, res, 'obtener propiedades destacadas');
  }
});

// Obtener propiedad por ID
router.get('/:id', async (req, res) => {
  try {
    const response = await axios.get(
      `${PROPERTY_SERVICE_URL}/properties/${req.params.id}`,
      { timeout: 10000 }
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    handleAxiosError(error, res, 'obtener propiedad');
  }
});

// Búsqueda de propiedades
router.get('/search', async (req, res) => {
  try {
    const response = await axios.get(
      `${PROPERTY_SERVICE_URL}/properties/search`,
      {
        params: req.query,
        timeout: 10000
      }
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    handleAxiosError(error, res, 'buscar propiedades');
  }
});

// Crear propiedad (protegido)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const propertyData = { ...req.body, propietario: userId };
    
    const response = await axios.post(
      `${PROPERTY_SERVICE_URL}/properties`,
      propertyData,
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
    handleAxiosError(error, res, 'crear propiedad');
  }
});

// Actualizar propiedad (protegido)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const response = await axios.put(
      `${PROPERTY_SERVICE_URL}/properties/${req.params.id}`,
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
    handleAxiosError(error, res, 'actualizar propiedad');
  }
});

// Eliminar propiedad (protegido)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const response = await axios.delete(
      `${PROPERTY_SERVICE_URL}/properties/${req.params.id}`,
      {
        headers: {
          'Authorization': req.headers.authorization
        },
        timeout: 10000
      }
    );
    
    res.status(response.status).json(response.data);
  } catch (error) {
    handleAxiosError(error, res, 'eliminar propiedad');
  }
});

// Mis propiedades (protegido)
router.get('/user', authMiddleware, async (req, res) => {
  try {
    const response = await axios.get(
      `${PROPERTY_SERVICE_URL}/properties/user`,
      {
        headers: {
          'Authorization': req.headers.authorization
        },
        timeout: 10000
      }
    );
    
    res.status(response.status).json(response.data);
  } catch (error) {
    handleAxiosError(error, res, 'obtener mis propiedades');
  }
});

// Función para manejar errores
function handleAxiosError(error, res, operation) {
  console.error(`Error al ${operation}:`, error.message);
  
  if (error.response) {
    console.error('Respuesta del servidor:', error.response.data);
    return res.status(error.response.status).json(error.response.data);
  } else if (error.request) {
    console.error('No se recibió respuesta del servicio de propiedades');
    return res.status(503).json({ 
      error: `No se pudo conectar con el servicio de propiedades al ${operation}`
    });
  } else {
    return res.status(500).json({ 
      error: `Error al procesar la solicitud de ${operation}`,
      details: error.message
    });
  }
}

// Exportar router
module.exports = router;
