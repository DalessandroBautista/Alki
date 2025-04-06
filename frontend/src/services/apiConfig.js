// Usa esto para desarrollo en emulador Android
export const API_URL = __DEV__ 
  ? 'http://10.0.2.2:8000/api'  // Para emulador Android
  : 'http://tudominio.com/api'; // Para producción 

// Endpoints
export const ENDPOINTS = {
  auth: {
    register: '/auth/register',
    login: '/auth/login',
    profile: '/auth/profile'
  },
  properties: {
    list: '/properties',
    details: (id) => `/properties/${id}`,
    create: '/properties',
    update: (id) => `/properties/${id}`,
    delete: (id) => `/properties/${id}`,
    myProperties: '/properties/user',
    search: '/properties/search'
  },
  messages: {
    conversations: '/messages/conversations',
    createConversation: '/messages/conversations',
    conversationDetails: (id) => `/messages/conversations/${id}`,
    sendMessage: '/messages',
    markAsRead: (id) => `/messages/${id}/read`
  }
}; 