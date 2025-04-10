const express = require('express');
const app = express();
const PORT = 3002;

// Ruta básica
app.get('/test', (req, res) => {
  res.json({ status: 'ok', message: 'Servicio de prueba funcionando!' });
});

// Iniciar servidor con manejo de errores
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor de prueba ejecutándose en http://0.0.0.0:${PORT}`);
}).on('error', (err) => {
  console.error('Error al iniciar el servidor:', err);
}); 