const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const axios = require('axios');
const config = require('../config');

class MessageService {
  // Enviar un mensaje
  async sendMessage(messageData, userId) {
    try {
      const { receptor, propiedad, asunto, contenido } = messageData;
      
      // Validar que el usuario receptor existe
      try {
        await axios.get(
          `${config.services.auth}/api/users/${receptor}`,
          { headers: { service: config.serviceName } }
        );
      } catch (error) {
        if (error.response && error.response.status === 404) {
          const error = new Error('Usuario receptor no encontrado');
          error.statusCode = 404;
          throw error;
        }
        throw new Error('Error al verificar usuario receptor');
      }
      
      // Validar que la propiedad existe
      try {
        await axios.get(
          `${config.services.property}/api/properties/${propiedad}`,
          { headers: { service: config.serviceName } }
        );
      } catch (error) {
        if (error.response && error.response.status === 404) {
          const error = new Error('Propiedad no encontrada');
          error.statusCode = 404;
          throw error;
        }
        throw new Error('Error al verificar propiedad');
      }
      
      // Buscar conversación existente o crear una nueva
      let conversation = await Conversation.findOne({
        participantes: { $all: [userId, receptor] },
        propiedad: propiedad
      });
      
      // Crear el mensaje
      const message = new Message({
        emisor: userId,
        receptor,
        propiedad,
        asunto,
        contenido
      });
      
      await message.save();
      
      // Actualizar o crear conversación
      if (conversation) {
        conversation.ultimoMensaje = message._id;
        conversation.fechaUltimoMensaje = new Date();
        conversation.activa = true;
        await conversation.save();
      } else {
        conversation = new Conversation({
          participantes: [userId, receptor],
          propiedad,
          ultimoMensaje: message._id,
          fechaUltimoMensaje: new Date()
        });
        await conversation.save();
      }
      
      // Enviar notificación (implementación básica)
      this.sendNotification(receptor, {
        type: 'nuevoMensaje',
        message: `Tienes un nuevo mensaje sobre una propiedad`,
        data: {
          messageId: message._id,
          conversationId: conversation._id,
          propertyId: propiedad
        }
      });
      
      return { message, conversation };
      
    } catch (error) {
      if (error.statusCode) throw error;
      throw new Error(`Error al enviar mensaje: ${error.message}`);
    }
  }
  
  // Obtener conversaciones del usuario
  async getConversations(userId, page = 1, limit = 20) {
    try {
      const skip = (page - 1) * limit;
      
      const conversations = await Conversation.find({
        participantes: userId,
        activa: true
      })
        .sort({ fechaUltimoMensaje: -1 })
        .skip(skip)
        .limit(limit)
        .populate('ultimoMensaje');
      
      const total = await Conversation.countDocuments({
        participantes: userId,
        activa: true
      });
      
      // Enriquecer las conversaciones con datos de usuarios y propiedades
      const enrichedConversations = await Promise.all(
        conversations.map(async (conversation) => {
          try {
            // Obtener datos del otro participante
            const otherParticipantId = conversation.participantes.find(
              id => id.toString() !== userId.toString()
            );
            
            let otherParticipant = null;
            try {
              const response = await axios.get(
                `${config.services.auth}/api/users/${otherParticipantId}`,
                { headers: { service: config.serviceName } }
              );
              otherParticipant = response.data.user;
            } catch (error) {
              console.error(`Error al obtener usuario ${otherParticipantId}:`, error.message);
            }
            
            // Obtener datos de la propiedad
            let property = null;
            try {
              const response = await axios.get(
                `${config.services.property}/api/properties/${conversation.propiedad}`,
                { headers: { service: config.serviceName } }
              );
              property = response.data.property;
            } catch (error) {
              console.error(`Error al obtener propiedad ${conversation.propiedad}:`, error.message);
            }
            
            // Contar mensajes no leídos
            const unreadCount = await Message.countDocuments({
              emisor: otherParticipantId,
              receptor: userId,
              leido: false
            });
            
            return {
              ...conversation.toObject(),
              otherParticipant,
              property,
              unreadCount
            };
          } catch (error) {
            console.error('Error al enriquecer conversación:', error);
            return conversation;
          }
        })
      );
      
      return {
        conversations: enrichedConversations,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new Error(`Error al obtener conversaciones: ${error.message}`);
    }
  }
  
  // Obtener mensajes de una conversación
  async getConversationMessages(conversationId, userId, page = 1, limit = 50) {
    try {
      // Verificar que el usuario es participante de la conversación
      const conversation = await Conversation.findById(conversationId);
      
      if (!conversation) {
        const error = new Error('Conversación no encontrada');
        error.statusCode = 404;
        throw error;
      }
      
      if (!conversation.participantes.includes(userId)) {
        const error = new Error('No tienes acceso a esta conversación');
        error.statusCode = 403;
        throw error;
      }
      
      const skip = (page - 1) * limit;
      
      const messages = await Message.find({
        $or: [
          { emisor: userId, eliminadoPorEmisor: false },
          { receptor: userId, eliminadoPorReceptor: false }
        ],
        $or: [
          { emisor: conversation.participantes[0], receptor: conversation.participantes[1] },
          { emisor: conversation.participantes[1], receptor: conversation.participantes[0] }
        ],
        propiedad: conversation.propiedad
      })
        .sort({ fechaEnvio: -1 })
        .skip(skip)
        .limit(limit);
      
      const total = await Message.countDocuments({
        $or: [
          { emisor: userId, eliminadoPorEmisor: false },
          { receptor: userId, eliminadoPorReceptor: false }
        ],
        $or: [
          { emisor: conversation.participantes[0], receptor: conversation.participantes[1] },
          { emisor: conversation.participantes[1], receptor: conversation.participantes[0] }
        ],
        propiedad: conversation.propiedad
      });
      
      // Marcar mensajes como leídos si el usuario es el receptor
      const unreadMessages = messages.filter(
        msg => msg.receptor.toString() === userId.toString() && !msg.leido
      );
      
      if (unreadMessages.length > 0) {
        await Promise.all(
          unreadMessages.map(msg => msg.marcarComoLeido())
        );
      }
      
      return {
        messages: messages.reverse(), // Orden cronológico para mostrar en chat
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      if (error.statusCode) throw error;
      throw new Error(`Error al obtener mensajes: ${error.message}`);
    }
  }
  
  // Marcar mensaje como leído
  async markMessageAsRead(messageId, userId) {
    try {
      const message = await Message.findById(messageId);
      
      if (!message) {
        const error = new Error('Mensaje no encontrado');
        error.statusCode = 404;
        throw error;
      }
      
      if (message.receptor.toString() !== userId.toString()) {
        const error = new Error('No tienes permisos para marcar este mensaje como leído');
        error.statusCode = 403;
        throw error;
      }
      
      if (!message.leido) {
        message.leido = true;
        message.fechaLectura = new Date();
        await message.save();
      }
      
      return { message };
    } catch (error) {
      if (error.statusCode) throw error;
      throw new Error(`Error al marcar mensaje como leído: ${error.message}`);
    }
  }
  
  // Eliminar mensaje para un usuario
  async deleteMessage(messageId, userId) {
    try {
      const message = await Message.findById(messageId);
      
      if (!message) {
        const error = new Error('Mensaje no encontrado');
        error.statusCode = 404;
        throw error;
      }
      
      // Verificar si el usuario es emisor o receptor
      const isEmisor = message.emisor.toString() === userId.toString();
      const isReceptor = message.receptor.toString() === userId.toString();
      
      if (!isEmisor && !isReceptor) {
        const error = new Error('No tienes permisos para eliminar este mensaje');
        error.statusCode = 403;
        throw error;
      }
      
      // Marcar como eliminado según el rol del usuario
      if (isEmisor) {
        message.eliminadoPorEmisor = true;
      }
      
      if (isReceptor) {
        message.eliminadoPorReceptor = true;
      }
      
      // Si ambos lo han eliminado, considerar eliminación real
      if (message.eliminadoPorEmisor && message.eliminadoPorReceptor) {
        await Message.findByIdAndDelete(messageId);
        return { message: 'Mensaje eliminado permanentemente' };
      } else {
        await message.save();
        return { message: 'Mensaje eliminado para ti' };
      }
    } catch (error) {
      if (error.statusCode) throw error;
      throw new Error(`Error al eliminar mensaje: ${error.message}`);
    }
  }
  
  // Enviar notificación (método simplificado)
  async sendNotification(userId, notification) {
    // Aquí se implementaría la integración con un servicio de notificaciones
    // como Firebase Cloud Messaging, OneSignal, etc.
    console.log(`Notificación para usuario ${userId}:`, notification);
    
    // También podría enviar un email
    if (config.notifications.email.enabled) {
      try {
        // Implementación de envío de email (usando nodemailer, SendGrid, etc.)
        console.log(`Enviando email a usuario ${userId}`);
      } catch (error) {
        console.error('Error al enviar email:', error);
      }
    }
  }
}

module.exports = new MessageService();
