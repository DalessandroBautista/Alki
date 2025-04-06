const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');
const config = require('./config');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware básico
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
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

// Middleware de manejo de errores
app.use(errorHandler);

const PORT = config.port || 8000;
app.listen(PORT, () => {
  console.log(`API Gateway ejecutándose en el puerto ${PORT}`);
});

module.exports = app;
