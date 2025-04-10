const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');
const config = require('./config');
const errorHandler = require('./middleware/errorHandler');
const propertyRoutes = require('./routes/propertyRoutes');

const app = express();

// Middleware de registro detallado para todas las solicitudes
app.use(morgan('dev')); // Registra todas las solicitudes HTTP
app.use((req, res, next) => {
  console.log(`📥 [API Gateway] ${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  next();
});

// Middleware básico
app.use(cors({
  origin: '*', // En producción, limitar a dominios específicos
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Log tras CORS para verificar si las solicitudes pasan
app.use((req, res, next) => {
  console.log(`✅ [API Gateway] Solicitud pasó CORS: ${req.method} ${req.url}`);
  next();
});

app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Configuración de rutas proxy
app.use('/api/auth', createProxyMiddleware({ 
  target: config.services.auth,
  changeOrigin: true,
  pathRewrite: {'^/api/auth': ''}
}));

app.use('/api/properties', createProxyMiddleware({ 
  target: config.services.property,
  changeOrigin: true,
  pathRewrite: {'^/api/properties': ''}
}));

app.use('/api/messages', createProxyMiddleware({ 
  target: config.services.messaging,
  changeOrigin: true,
  pathRewrite: {'^/api/messages': ''}
}));

// Rutas
app.use('/api/properties', propertyRoutes);

// Ruta de health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

// Rutas básicas de prueba
app.get('/api/test', (req, res) => {
  res.json({
    message: 'API Gateway test endpoint working',
    timestamp: new Date()
  });
});

// Middleware de manejo de errores
app.use(errorHandler);

// Manejador de errores 404
app.use((req, res) => {
  console.log(`⚠️ Ruta no encontrada: ${req.method} ${req.url}`);
  res.status(404).json({ error: 'Ruta no encontrada' });
});

const PORT = config.port || 8000;
app.listen(PORT, () => {
  console.log(`API Gateway ejecutándose en el puerto ${PORT}`);
});

module.exports = app;
