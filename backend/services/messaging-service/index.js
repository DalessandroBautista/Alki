const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const setupWebsocket = require('./src/websocket');
const config = require('./src/config');

const app = express();
const server = http.createServer(app);

// Configurar WebSocket
const io = setupWebsocket(server);

// Middleware
app.use(cors());
app.use(express.json());

// Esquema básico de mensaje
const messageSchema = new mongoose.Schema({
  conversacionId: { type: mongoose.Schema.Types.ObjectId, required: true },
  remitente: { type: mongoose.Schema.Types.ObjectId, required: true },
  receptor: { type: mongoose.Schema.Types.ObjectId, required: true },
  contenido: { type: String, required: true },
  leido: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

// Rutas básicas
app.get('/messages', async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({ message: 'Se requiere ID de usuario' });
    }
    
    const messages = await Message.find({
      $or: [{ remitente: userId }, { receptor: userId }]
    }).sort({ createdAt: -1 });
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener mensajes' });
  }
});

// Ruta de salud
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'messaging-service' });
});

// Conectar a MongoDB e iniciar servidor
mongoose.connect(process.env.MONGODB_URI || 'mongodb://mongodb:27017/messaging-db')
  .then(() => {
    console.log('Conectado a MongoDB');
    server.listen(config.port, () => {
      console.log(`Messaging Service corriendo en puerto ${config.port}`);
    });
  })
  .catch(err => {
    console.error('Error conectando a MongoDB:', err);
  }); 