const Property = require('../models/Property');
const axios = require('axios');
const config = require('../config');

class PropertyService {
  // Obtener todas las propiedades (con filtros)
  async getProperties(filters = {}, sortOptions = {}, pagination = {}) {
    try {
      const { page = 1, limit = 10 } = pagination;
      const skip = (page - 1) * limit;
      
      // Por defecto solo mostrar disponibles a menos que se indique lo contrario
      const defaultFilters = { 
        ...filters,
        disponible: filters.disponible !== undefined ? filters.disponible : true
      };
      
      // Ordenar por defecto por fecha de publicación
      const defaultSort = Object.keys(sortOptions).length > 0 
        ? sortOptions 
        : { fechaPublicacion: -1 };
      
      const properties = await Property.find(defaultFilters)
        .populate('categorias', 'nombre icono')
        .sort(defaultSort)
        .skip(skip)
        .limit(limit);
      
      const total = await Property.countDocuments(defaultFilters);
      
      return {
        properties,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new Error(`Error al obtener propiedades: ${error.message}`);
    }
  }
  
  // Obtener propiedad por ID
  async getPropertyById(propertyId, userId = null) {
    try {
      const property = await Property.findById(propertyId)
        .populate('categorias', 'nombre descripcion icono');
      
      if (!property) {
        const error = new Error('Propiedad no encontrada');
        error.statusCode = 404;
        throw error;
      }
      
      // Si no está disponible, solo el propietario puede verla
      if (!property.disponible) {
        if (!userId || property.propietario.toString() !== userId) {
          const error = new Error('Esta propiedad no está disponible');
          error.statusCode = 403;
          throw error;
        }
      }
      
      // Incrementar vistas (excepto si el propietario la ve)
      if (!userId || property.propietario.toString() !== userId) {
        property.vistas += 1;
        await property.save();
      }
      
      // Obtener datos del propietario desde el servicio de autenticación
      let propietarioData = null;
      try {
        const response = await axios.get(
          `${config.services.auth}/api/users/${property.propietario}`,
          { headers: { service: config.serviceName } }
        );
        propietarioData = response.data.user;
      } catch (error) {
        console.error('Error al obtener datos del propietario:', error.message);
        // Continuar incluso sin los datos del propietario
      }
      
      // Verificar si es propiedad favorita para el usuario
      let isFavorite = false;
      if (userId) {
        try {
          const response = await axios.get(
            `${config.services.auth}/api/users/${userId}/check-favorite/${propertyId}`,
            { headers: { service: config.serviceName } }
          );
          isFavorite = response.data.isFavorite;
        } catch (error) {
          console.error('Error al verificar favoritos:', error.message);
          // No fallar completamente si no se puede verificar favoritos
        }
      }
      
      return { 
        property: {
          ...property.toObject(),
          propietario: propietarioData || property.propietario
        }, 
        isFavorite 
      };
    } catch (error) {
      if (error.statusCode) throw error;
      throw new Error(`Error al obtener propiedad: ${error.message}`);
    }
  }
  
  // Crear propiedad
  async createProperty(propertyData, userId) {
    try {
      // Verificar que el usuario tenga permisos de propietario
      try {
        const response = await axios.get(
          `${config.services.auth}/api/users/${userId}/check-role/propietario`,
          { headers: { service: config.serviceName } }
        );
        
        if (!response.data.hasRole) {
          const error = new Error('No tienes permisos para publicar propiedades');
          error.statusCode = 403;
          throw error;
        }
      } catch (error) {
        if (error.response && error.response.status) {
          const apiError = new Error(error.response.data.message || 'Error de autenticación');
          apiError.statusCode = error.response.status;
          throw apiError;
        }
        throw new Error('Error al verificar permisos de usuario');
      }
      
      // Validar datos mínimos
      if (!propertyData.titulo || !propertyData.descripcion || !propertyData.precio || 
          !propertyData.habitaciones || !propertyData.baños || !propertyData.tipo ||
          !propertyData.direccion || !propertyData.direccion.calle) {
        const error = new Error('Faltan datos obligatorios para crear la propiedad');
        error.statusCode = 400;
        throw error;  
      }
      
      // Crear propiedad
      const property = new Property({
        ...propertyData,
        propietario: userId
      });
      
      await property.save();
      return property;
    } catch (error) {
      if (error.statusCode) throw error;
      throw new Error(`Error al crear propiedad: ${error.message}`);
    }
  }
  
  // Actualizar propiedad
  async updateProperty(propertyId, updateData, userId) {
    try {
      const property = await Property.findById(propertyId);
      
      if (!property) {
        const error = new Error('Propiedad no encontrada');
        error.statusCode = 404;
        throw error;
      }
      
      // Verificar propiedad
      if (property.propietario.toString() !== userId) {
        const error = new Error('No tienes permisos para editar esta propiedad');
        error.statusCode = 403;
        throw error;
      }
      
      // Evitar actualizar campos protegidos
      delete updateData.propietario;
      delete updateData.fechaPublicacion;
      delete updateData.vistas;
      
      return Property.findByIdAndUpdate(
        propertyId,
        updateData,
        { new: true, runValidators: true }
      );
    } catch (error) {
      if (error.statusCode) throw error;
      throw new Error(`Error al actualizar propiedad: ${error.message}`);
    }
  }
  
  // Cambiar disponibilidad
  async toggleAvailability(propertyId, userId) {
    try {
      const property = await Property.findById(propertyId);
      
      if (!property) {
        const error = new Error('Propiedad no encontrada');
        error.statusCode = 404;
        throw error;
      }
      
      if (property.propietario.toString() !== userId) {
        const error = new Error('No tienes permisos para modificar esta propiedad');
        error.statusCode = 403;
        throw error;
      }
      
      property.disponible = !property.disponible;
      await property.save();
      
      return {
        disponible: property.disponible,
        message: property.disponible ? 'Propiedad habilitada' : 'Propiedad deshabilitada'
      };
    } catch (error) {
      if (error.statusCode) throw error;
      throw new Error(`Error al cambiar disponibilidad: ${error.message}`);
    }
  }
  
  // Eliminar propiedad
  async deleteProperty(propertyId, userId) {
    try {
      const property = await Property.findById(propertyId);
      
      if (!property) {
        const error = new Error('Propiedad no encontrada');
        error.statusCode = 404;
        throw error;
      }
      
      if (property.propietario.toString() !== userId) {
        const error = new Error('No tienes permisos para eliminar esta propiedad');
        error.statusCode = 403;
        throw error;
      }
      
      await Property.findByIdAndDelete(propertyId);
      return { message: 'Propiedad eliminada con éxito' };
    } catch (error) {
      if (error.statusCode) throw error;
      throw new Error(`Error al eliminar propiedad: ${error.message}`);
    }
  }
  
  // Buscar propiedades por proximidad
  async searchByProximity(latitude, longitude, radiusKm = 5) {
    try {
      const properties = await Property.find({
        disponible: true,
        'direccion.ubicacion': {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [longitude, latitude] // GeoJSON usa [lng, lat]
            },
            $maxDistance: radiusKm * 1000 // convertir a metros
          }
        }
      }).populate('categorias', 'nombre icono');
      
      return { properties };
    } catch (error) {
      throw new Error(`Error en búsqueda por proximidad: ${error.message}`);
    }
  }
}

module.exports = new PropertyService(); 