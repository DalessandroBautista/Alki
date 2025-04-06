const Category = require('../models/Category');

class CategoryService {
  // Obtener todas las categorías
  async getAllCategories() {
    try {
      return await Category.find().sort({ nombre: 1 });
    } catch (error) {
      throw new Error(`Error al obtener categorías: ${error.message}`);
    }
  }
  
  // Obtener categoría por ID
  async getCategoryById(categoryId) {
    try {
      const category = await Category.findById(categoryId);
      
      if (!category) {
        const error = new Error('Categoría no encontrada');
        error.statusCode = 404;
        throw error;
      }
      
      return category;
    } catch (error) {
      if (error.statusCode) throw error;
      throw new Error(`Error al obtener categoría: ${error.message}`);
    }
  }
  
  // Crear categoría
  async createCategory(categoryData) {
    try {
      // Verificar si ya existe una categoría con el mismo nombre
      const existingCategory = await Category.findOne({ 
        nombre: { $regex: new RegExp('^' + categoryData.nombre + '$', 'i') } 
      });
      
      if (existingCategory) {
        const error = new Error('Ya existe una categoría con este nombre');
        error.statusCode = 400;
        throw error;
      }
      
      const category = new Category(categoryData);
      await category.save();
      return category;
    } catch (error) {
      if (error.statusCode) throw error;
      throw new Error(`Error al crear categoría: ${error.message}`);
    }
  }
}

module.exports = new CategoryService();
