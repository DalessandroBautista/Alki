const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const config = require('../config');

const setupWebsocket = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: config.cors.origin,
      methods: ["GET", "POST"]
    }
  });
  
  // Middleware para autenticación de socket
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error'));
    }
    
    try {
      const decoded = jwt.verify(token, config.jwt.secret);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });
  
  // Manejar conexiones
  io.on('connection', (socket) => {
    console.log(`Usuario conectado: ${socket.userId}`);
    
    // Unirse a sala personal (para notificaciones directas)
    socket.join(`user:${socket.userId}`);
    
    // Escuchar cuando un usuario empieza a escribir
    socket.on('typing', (data) => {
      const { conversationId } = data;
      
      // Emitir a todos en la conversación excepto al emisor
      socket.to(`conversation:${conversationId}`).emit('userTyping', {
        conversationId,
        userId: socket.userId
      });
    });
    
    // Escuchar cuando se envía un nuevo mensaje
    socket.on('message', async (data) => {
      try {
        const { conversationId, message } = data;
        
        // El mensaje se guarda a través del API REST, aquí solo notificamos
        io.to(`conversation:${conversationId}`).emit('newMessage', {
          conversationId,
          message
        });
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });
    
    // Unirse a una sala de conversación
    socket.on('joinConversation', (conversationId) => {
      socket.join(`conversation:${conversationId}`);
      console.log(`Usuario ${socket.userId} unido a conversación ${conversationId}`);
    });
    
    // Desconexión
    socket.on('disconnect', () => {
      console.log(`Usuario desconectado: ${socket.userId}`);
    });
  });
  
  return io;
};

module.exports = setupWebsocket; 