const propertyService = require('../services/propertyService');

// Obtener todas las propiedades
exports.getAllProperties = async (req, res, next) => {
  try {
    // Construir filtros desde query params
    const filters = {};
    
    if (req.query.tipo) filters.tipo = req.query.tipo;
    if (req.query.tipoAlquiler) filters.tipoAlquiler = req.query.tipoAlquiler;
    if (req.query.precioMin) filters.precio = { $gte: parseInt(req.query.precioMin) };
    if (req.query.precioMax) {
      filters.precio = { 
        ...filters.precio, 
        $lte: parseInt(req.query.precioMax) 
      };
    }
    if (req.query.habitaciones) filters.habitaciones = { $gte: parseInt(req.query.habitaciones) };
    if (req.query.ciudad) filters['direccion.ciudad'] = new RegExp(req.query.ciudad, 'i');
    
    // Propiedades deshabilitadas solo para propietario
    if (req.query.incluirDeshabilitadas === 'true' && req.userId) {
      if (req.query.propietarioId === req.userId) {
        filters.propietario = req.userId;
        delete filters.disponible;
      }
    }
    
    // Ordenamiento
    const sortOptions = {};
    if (req.query.sort) {
      if (req.query.sort === 'precio_asc') sortOptions.precio = 1;
      if (req.query.sort === 'precio_desc') sortOptions.precio = -1;
      if (req.query.sort === 'fecha_desc') sortOptions.fechaPublicacion = -1;
    }
    
    // Paginación
    const pagination = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10
    };
    
    // Delegar al servicio
    const result = await propertyService.getProperties(filters, sortOptions, pagination);
    
    res.json(result);
    
  } catch (error) {
    next(error);
  }
};

// Obtener propiedad por ID
exports.getPropertyById = async (req, res, next) => {
  try {
    const result = await propertyService.getPropertyById(req.params.id, req.userId);
    res.json(result);
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    next(error);
  }
};

// Crear propiedad
exports.createProperty = async (req, res, next) => {
  try {
    const property = await propertyService.createProperty(req.body, req.userId);
    res.status(201).json({
      message: 'Propiedad creada con éxito',
      property
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    next(error);
  }
};

// Actualizar propiedad
exports.updateProperty = async (req, res, next) => {
  try {
    const property = await propertyService.updateProperty(req.params.id, req.body, req.userId);
    res.json({
      message: 'Propiedad actualizada con éxito',
      property
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    next(error);
  }
};

// Cambiar disponibilidad (habilitar/deshabilitar)
exports.toggleAvailability = async (req, res, next) => {
  try {
    const result = await propertyService.toggleAvailability(req.params.id, req.userId);
    res.json(result);
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    next(error);
  }
};

// Eliminar propiedad
exports.deleteProperty = async (req, res, next) => {
  try {
    const result = await propertyService.deleteProperty(req.params.id, req.userId);
    res.json(result);
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    next(error);
  }
};

// Buscar propiedades por proximidad
exports.searchByProximity = async (req, res, next) => {
  try {
    const { lat, lng, radius = 5 } = req.query; // radio en km
    
    if (!lat || !lng) {
      return res.status(400).json({ message: 'Latitud y longitud son requeridas' });
    }
    
    const result = await propertyService.searchByProximity(
      parseFloat(lat),
      parseFloat(lng),
      parseFloat(radius)
    );
    
    res.json(result);
  } catch (error) {
    next(error);
  }
}; 