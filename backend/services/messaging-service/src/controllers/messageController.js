const messageService = require('../services/messageService');

// Enviar un mensaje
exports.sendMessage = async (req, res, next) => {
  try {
    const { receptor, propiedad, asunto, contenido } = req.body;
    
    if (!receptor || !propiedad || !asunto || !contenido) {
      return res.status(400).json({ 
        message: 'Todos los campos son obligatorios' 
      });
    }
    
    const result = await messageService.sendMessage(
      { receptor, propiedad, asunto, contenido },
      req.userId
    );
    
    res.status(201).json({
      message: 'Mensaje enviado con éxito',
      data: result
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    next(error);
  }
};

// Obtener conversaciones
exports.getConversations = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    
    const result = await messageService.getConversations(req.userId, page, limit);
    
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// Obtener mensajes de una conversación
exports.getConversationMessages = async (req, res, next) => {
  try {
    const conversationId = req.params.conversationId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    
    const result = await messageService.getConversationMessages(
      conversationId,
      req.userId,
      page,
      limit
    );
    
    res.json(result);
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    next(error);
  }
};

// Marcar mensaje como leído
exports.markMessageAsRead = async (req, res, next) => {
  try {
    const messageId = req.params.messageId;
    
    const result = await messageService.markMessageAsRead(messageId, req.userId);
    
    res.json({
      message: 'Mensaje marcado como leído',
      data: result
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    next(error);
  }
};

// Eliminar mensaje
exports.deleteMessage = async (req, res, next) => {
  try {
    const messageId = req.params.messageId;
    
    const result = await messageService.deleteMessage(messageId, req.userId);
    
    res.json(result);
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    next(error);
  }
}; 