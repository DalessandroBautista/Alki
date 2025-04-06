const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config');

class AuthService {
  // Registrar nuevo usuario
  async register(userData) {
    // Verificar si el email ya existe
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      const error = new Error('Este email ya está registrado');
      error.statusCode = 400;
      throw error;
    }
    
    // Crear usuario
    const user = new User({
      ...userData,
      roles: userData.roles || { buscador: true, propietario: false }
    });
    
    await user.save();
    
    // Generar token
    const token = this.generateToken(user._id);
    
    return { user: user.toJSON(), token };
  }
  
  // Login de usuario
  async login(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error('Credenciales inválidas');
      error.statusCode = 401;
      throw error;
    }
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      const error = new Error('Credenciales inválidas');
      error.statusCode = 401;
      throw error;
    }
    
    const token = this.generateToken(user._id);
    
    return { user: user.toJSON(), token };
  }
  
  // Obtener perfil de usuario
  async getProfile(userId) {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      const error = new Error('Usuario no encontrado');
      error.statusCode = 404;
      throw error;
    }
    
    return { user };
  }
  
  // Actualizar perfil de usuario
  async updateProfile(userId, userData) {
    // No permitir actualizar email o contraseña por este método
    const { nombre, apellido, telefono, descripcion, foto, roles } = userData;
    
    const updateData = {};
    if (nombre) updateData.nombre = nombre;
    if (apellido) updateData.apellido = apellido;
    if (telefono) updateData.telefono = telefono;
    if (descripcion) updateData.descripcion = descripcion;
    if (foto) updateData.foto = foto;
    if (roles) updateData.roles = roles;
    
    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      const error = new Error('Usuario no encontrado');
      error.statusCode = 404;
      throw error;
    }
    
    return { user };
  }
  
  // Cambiar contraseña
  async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findById(userId);
    
    if (!user) {
      const error = new Error('Usuario no encontrado');
      error.statusCode = 404;
      throw error;
    }
    
    // Verificar contraseña actual
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      const error = new Error('Contraseña actual incorrecta');
      error.statusCode = 401;
      throw error;
    }
    
    // Actualizar contraseña
    user.password = newPassword;
    await user.save();
    
    return { message: 'Contraseña actualizada con éxito' };
  }
  
  // Marcar/desmarcar propiedad como favorita
  async toggleFavorite(userId, propertyId) {
    const user = await User.findById(userId);
    
    if (!user) {
      const error = new Error('Usuario no encontrado');
      error.statusCode = 404;
      throw error;
    }
    
    // Verificar si ya es favorito
    const isFavorite = user.propiedadesFavoritas.includes(propertyId);
    
    if (isFavorite) {
      // Remover de favoritos
      user.propiedadesFavoritas = user.propiedadesFavoritas.filter(
        id => id.toString() !== propertyId.toString()
      );
    } else {
      // Agregar a favoritos
      user.propiedadesFavoritas.push(propertyId);
    }
    
    await user.save();
    
    return {
      isFavorite: !isFavorite,
      message: !isFavorite 
        ? 'Propiedad agregada a favoritos' 
        : 'Propiedad removida de favoritos'
    };
  }
  
  // Verificar si usuario tiene un rol específico (para comunicación entre servicios)
  async checkUserRole(userId, roleName) {
    const user = await User.findById(userId);
    
    if (!user) {
      const error = new Error('Usuario no encontrado');
      error.statusCode = 404;
      throw error;
    }
    
    // Verificar si tiene el rol
    const hasRole = user.roles && user.roles[roleName] === true;
    
    return { hasRole };
  }
  
  // Verificar si una propiedad está en favoritos (para comunicación entre servicios)
  async checkFavorite(userId, propertyId) {
    const user = await User.findById(userId);
    
    if (!user) {
      const error = new Error('Usuario no encontrado');
      error.statusCode = 404;
      throw error;
    }
    
    const isFavorite = user.propiedadesFavoritas.some(
      id => id.toString() === propertyId.toString()
    );
    
    return { isFavorite };
  }
  
  // Generar token JWT
  generateToken(userId) {
    return jwt.sign(
      { id: userId }, 
      config.jwt.secret, 
      { expiresIn: config.jwt.expiresIn }
    );
  }
}

module.exports = new AuthService();
