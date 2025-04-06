const categoryService = require('../services/categoryService');

// Obtener todas las categorías
exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.json({ categories });
  } catch (error) {
    next(error);
  }
};

// Obtener categoría por ID
exports.getCategoryById = async (req, res, next) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    res.json({ category });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    next(error);
  }
};

// Crear categoría
exports.createCategory = async (req, res, next) => {
  try {
    const { nombre, descripcion, icono } = req.body;
    
    if (!nombre) {
      return res.status(400).json({ message: 'El nombre es requerido' });
    }
    
    const category = await categoryService.createCategory({ nombre, descripcion, icono });
    
    res.status(201).json({
      message: 'Categoría creada con éxito',
      category
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    next(error);
  }
};

// Actualizar categoría
exports.updateCategory = async (req, res, next) => {
  try {
    const { nombre, descripcion, icono } = req.body;
    const category = await categoryService.updateCategory(
      req.params.id, 
      { nombre, descripcion, icono }
    );
    
    res.json({
      message: 'Categoría actualizada con éxito',
      category
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    next(error);
  }
};

// Eliminar categoría
exports.deleteCategory = async (req, res, next) => {
  try {
    await categoryService.deleteCategory(req.params.id);
    
    res.json({
      message: 'Categoría eliminada con éxito'
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    next(error);
  }
}; 