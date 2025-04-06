const authService = require('../services/authService');

// Registro de usuario
exports.register = async (req, res, next) => {
  try {
    const { email, password, nombre, apellido, telefono, roles } = req.body;
    
    // Validar datos mínimos
    if (!email || !password || !nombre || !apellido) {
      return res.status(400).json({ 
        message: 'Todos los campos obligatorios deben ser completados' 
      });
    }
    
    const result = await authService.register({
      email,
      password,
      nombre,
      apellido,
      telefono,
      roles
    });
    
    res.status(201).json({
      message: 'Usuario registrado con éxito',
      token: result.token,
      user: result.user
    });
    
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    next(error);
  }
};

// Login de usuario
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Validar datos
    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son requeridos' });
    }
    
    const result = await authService.login(email, password);
    
    res.json({
      message: 'Login exitoso',
      token: result.token,
      user: result.user
    });
    
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    next(error);
  }
};

// Obtener perfil del usuario
exports.getProfile = async (req, res, next) => {
  try {
    const userId = req.userId;
    const result = await authService.getProfile(userId);
    
    res.json(result);
    
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    next(error);
  }
};

// Verificar si usuario tiene un rol específico (para comunicación entre servicios)
exports.checkRole = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const roleName = req.params.role;
    
    const result = await authService.checkUserRole(userId, roleName);
    
    res.json(result);
    
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    next(error);
  }
};

// Verificar si una propiedad está en favoritos (para comunicación entre servicios)
exports.checkFavorite = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const propertyId = req.params.propertyId;
    
    const result = await authService.checkFavorite(userId, propertyId);
    
    res.json(result);
    
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    next(error);
  }
}; 