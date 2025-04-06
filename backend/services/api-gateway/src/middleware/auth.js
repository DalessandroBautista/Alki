const jwt = require('jsonwebtoken');
const axios = require('axios');
const config = require('../config');

module.exports = async (req, res, next) => {
  try {
    // Obtener token del header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        status: 'error',
        message: 'Acceso denegado. Token requerido' 
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verificar token localmente
    try {
      const decoded = jwt.verify(token, config.jwt.secret);
      req.userId = decoded.id;
      
      // Verificar si el token es válido con el servicio de autenticación
      try {
        await axios.get(`${config.services.auth}/api/auth/verify-token`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'x-gateway-source': 'api-gateway'
          }
        });
      } catch (verifyError) {
        // Si el servicio de auth dice que el token es inválido
        if (verifyError.response && verifyError.response.status === 401) {
          return res.status(401).json({ 
            status: 'error',
            message: 'Token inválido o expirado' 
          });
        }
        // Si es otro error del servicio, continuamos con la verificación local
        console.error('Error verificando token con auth service:', verifyError.message);
      }
      
      next();
    } catch (jwtError) {
      return res.status(401).json({ 
        status: 'error',
        message: 'Token inválido o expirado' 
      });
    }
  } catch (error) {
    next(error);
  }
}; 