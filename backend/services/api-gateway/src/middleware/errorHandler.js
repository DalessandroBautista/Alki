module.exports = (err, req, res, next) => {
  console.error(err);
  
  // Errores de proxy
  if (err.code === 'ECONNREFUSED') {
    return res.status(503).json({
      status: 'error',
      message: 'El servicio solicitado no está disponible en este momento'
    });
  }
  
  if (err.response) {
    // El servicio respondió con un error
    return res.status(err.response.status || 500).json(err.response.data || {
      status: 'error',
      message: 'Error en el servicio'
    });
  }
  
  // Errores genéricos
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';
  
  res.status(statusCode).json({
    status: 'error',
    message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
}; 