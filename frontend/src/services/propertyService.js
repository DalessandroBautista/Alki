import axios from 'axios';
import { API_URL, ENDPOINTS } from './apiConfig';
import authService from './authService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const propertyService = {
  // Obtener todas las propiedades
  getAllProperties: async () => {
    try {
      const apiUrl = `${API_URL}/properties`;
      console.log('🔍 [Frontend] Solicitando propiedades desde:', apiUrl);
      
      // Agregar cabecera personalizada para seguimiento
      const requestId = `req-${Date.now()}`;
      const headers = {
        'Content-Type': 'application/json',
        'X-Request-ID': requestId
      };
      
      console.log(`🔍 [Frontend] Enviando solicitud con ID: ${requestId}`);
      
      const response = await axios.get(apiUrl, { 
        headers,
        timeout: 10000 // Aumentar timeout a 10 segundos
      });
      
      console.log(`✅ [Frontend] Respuesta recibida para solicitud ${requestId}`);
      console.log('✅ [Frontend] Estado:', response.status);
      console.log('✅ [Frontend] Cabeceras:', response.headers);
      console.log('📦 [Frontend] Propiedades recibidas:', Array.isArray(response.data) ? response.data.length : 'No es un array');
      
      if (!response.data || (Array.isArray(response.data) && response.data.length === 0)) {
        console.warn('⚠️ [Frontend] No se encontraron propiedades en la respuesta');
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ [Frontend] Error al obtener propiedades:', error.message);
      
      if (error.response) {
        console.error('❌ [Frontend] Respuesta de error del servidor:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
      } else if (error.request) {
        console.error('❌ [Frontend] No se recibió respuesta del servidor:', error.request);
      } else {
        console.error('❌ [Frontend] Error en la configuración de la solicitud:', error.message);
      }
      
      throw error.response?.data || { message: 'Error al cargar propiedades' };
    }
  },

  // Obtener propiedad por ID
  getPropertyById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}${ENDPOINTS.properties.details(id)}`);
      // Asegurar que datos inconsistentes sean adaptados
      const property = response.data.property || response.data;
      return {
        ...property,
        isFavorite: response.data.isFavorite || false
      };
    } catch (error) {
      throw error.response?.data || { error: 'Error al obtener la propiedad' };
    }
  },

  // Buscar propiedades
  searchProperties: async (searchParams) => {
    try {
      const response = await axios.get(`${API_URL}${ENDPOINTS.properties.search}`, {
        params: searchParams
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al buscar propiedades' };
    }
  },

  // Crear propiedad
  createProperty: async (propertyData) => {
    try {
      const token = await authService.getToken();
      const response = await axios.post(
        `${API_URL}${ENDPOINTS.properties.create}`,
        propertyData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al crear la propiedad' };
    }
  },

  // Actualizar propiedad
  updateProperty: async (id, propertyData) => {
    try {
      const token = await authService.getToken();
      const response = await axios.put(
        `${API_URL}${ENDPOINTS.properties.update(id)}`,
        propertyData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al actualizar la propiedad' };
    }
  },

  // Eliminar propiedad
  deleteProperty: async (id) => {
    try {
      const token = await authService.getToken();
      const response = await axios.delete(
        `${API_URL}${ENDPOINTS.properties.delete(id)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al eliminar la propiedad' };
    }
  },

  // Obtener mis propiedades
  getMyProperties: async () => {
    try {
      const token = await authService.getToken();
      const response = await axios.get(
        `${API_URL}${ENDPOINTS.properties.myProperties}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al obtener mis propiedades' };
    }
  },

  // Obtener propiedades destacadas
  getFeaturedProperties: async () => {
    try {
      console.log('Solicitando propiedades destacadas');
      const response = await axios.get(`${API_URL}/properties/featured`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener propiedades destacadas:', error);
      throw error.response?.data || { message: 'Error al cargar propiedades destacadas' };
    }
  }
};

export default propertyService; 