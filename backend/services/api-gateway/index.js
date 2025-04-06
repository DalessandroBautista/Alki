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
}); 