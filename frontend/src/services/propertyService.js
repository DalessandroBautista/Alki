import axios from 'axios';
import { API_URL, ENDPOINTS } from './apiConfig';
import authService from './authService';

const propertyService = {
  // Obtener todas las propiedades
  getAllProperties: async (filters = {}) => {
    try {
      const response = await axios.get(`${API_URL}${ENDPOINTS.properties.list}`, {
        params: filters
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error al obtener propiedades' };
    }
  },

  // Obtener propiedad por ID
  getPropertyById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}${ENDPOINTS.properties.details(id)}`);
      return response.data;
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
  }
};

export default propertyService; 