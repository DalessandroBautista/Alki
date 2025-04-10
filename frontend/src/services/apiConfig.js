import { Platform } from 'react-native';

// Valores por defecto según el entorno
const getDefaultApiUrl = () => {
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  if (__DEV__) {
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:8000/api';  // Android emulator
    } else if (Platform.OS === 'ios') {
      return 'http://localhost:8000/api';  // iOS simulator
    } else {
      return 'http://localhost:8000/api';  // Web
    }
  } else {
    return 'http://tudominio.com/api'; // Para producción
  }
};

export const API_URL = getDefaultApiUrl();
console.log('🔧 API_URL configurada como:', API_URL);

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