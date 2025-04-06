const express = require('express');
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Enviar mensaje
router.post('/', messageController.sendMessage);

// Obtener conversaciones
router.get('/conversations', messageController.getConversations);

// Obtener mensajes de una conversación
router.get('/conversations/:conversationId', messageController.getConversationMessages);

// Marcar mensaje como leído
router.put('/:messageId/read', messageController.markMessageAsRead);

// Eliminar mensaje
router.delete('/:messageId', messageController.deleteMessage);

module.exports = router; 