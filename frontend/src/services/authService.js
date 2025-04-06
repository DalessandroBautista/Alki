import axios from 'axios';
import { API_URL, ENDPOINTS } from './apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const authService = {
  // Registrar nuevo usuario
  register: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}${ENDPOINTS.auth.register}`, userData);
      if (response.data.token) {
        await AsyncStorage.setItem('token', response.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error en el servidor' };
    }
  },

  // Iniciar sesión
  login: async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}${ENDPOINTS.auth.login}`, credentials);
      if (response.data.token) {
        await AsyncStorage.setItem('token', response.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error en el servidor' };
    }
  },

  // Obtener perfil del usuario
  getProfile: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('No hay token');

      const response = await axios.get(`${API_URL}${ENDPOINTS.auth.profile}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error en el servidor' };
    }
  },

  // Cerrar sesión
  logout: async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
  },

  // Verificar si el usuario está autenticado
  isAuthenticated: async () => {
    const token = await AsyncStorage.getItem('token');
    return !!token;
  },

  // Obtener token
  getToken: async () => {
    return await AsyncStorage.getItem('token');
  }
};

export default authService; 