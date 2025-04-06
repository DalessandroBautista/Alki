import axios from 'axios';
import { API_URL } from '../config';

// Endpoints
const AUTH_URL = `${API_URL}/api/auth`;

// Login
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${AUTH_URL}/login`, {
      email,
      password
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      'Error al iniciar sesión. Verifica tus credenciales.'
    );
  }
};

// Registro
export const register = async (userData) => {
  try {
    const response = await axios.post(`${AUTH_URL}/register`, userData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 
      'Error al registrarse. Inténtalo de nuevo.'
    );
  }
};

// Verificar token
export const verifyToken = async (token) => {
  try {
    const response = await axios.get(`${AUTH_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error('Token inválido');
  }
}; 