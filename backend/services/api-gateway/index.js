const express = require('express');
const cors = require('cors');
const routes = require('./src/routes');
const config = require('./src/config');

const app = express();

// Middleware básico
app.use(cors({
  origin: config.cors.origin,
  methods: config.cors.methods
}));
app.use(express.json());

// Middleware de logging para depuración
app.use((req, res, next) => {
  console.log(`🔍 [API Gateway] Recibida solicitud: ${req.method} ${req.originalUrl}`);
  next();
});

// Rutas principales
app.use('/api', routes);

// Ruta de salud básica
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

// Iniciar servidor
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`API Gateway corriendo en puerto ${PORT}`);
  console.log(`🔧 [API Gateway] Configurado para comunicarse con el servicio de propiedades en: ${config.services.property}`);
}); 