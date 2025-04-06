import axios from 'axios';
import { API_URL, ENDPOINTS } from './apiConfig';
import authService from './authService';

const messageService = {
  // Obtener todas las conversaciones
  getConversations: async () => {
    try {
      const token = await authService.getToken();
      const response = await axios.get(
        `${API_URL}${ENDPOINTS.messages.conversations}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al obtener conversaciones' };
    }
  },

  // Crear nueva conversación
  createConversation: async (conversationData) => {
    try {
      const token = await authService.getToken();
      const response = await axios.post(
        `${API_URL}${ENDPOINTS.messages.createConversation}`,
        conversationData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al crear conversación' };
    }
  },

  // Obtener mensajes de una conversación
  getConversationMessages: async (conversationId) => {
    try {
      const token = await authService.getToken();
      const response = await axios.get(
        `${API_URL}${ENDPOINTS.messages.conversationDetails(conversationId)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al obtener mensajes' };
    }
  },

  // Enviar mensaje
  sendMessage: async (messageData) => {
    try {
      const token = await authService.getToken();
      const response = await axios.post(
        `${API_URL}${ENDPOINTS.messages.sendMessage}`,
        messageData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al enviar mensaje' };
    }
  },

  // Marcar mensaje como leído
  markAsRead: async (messageId) => {
    try {
      const token = await authService.getToken();
      const response = await axios.put(
        `${API_URL}${ENDPOINTS.messages.markAsRead(messageId)}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al marcar mensaje como leído' };
    }
  }
};

export default messageService; 