const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Configuración básica
const config = {
  port: process.env.PORT || 3001,
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://mongodb:27017/auth-db'
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'tu_clave_secreta',
    expiresIn: '7d'
  }
};

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Activa el logging de todas las solicitudes para depuración
app.use((req, res, next) => {
  console.log(`Recibida solicitud: ${req.method} ${req.path}`);
  console.log('Headers:', JSON.stringify(req.headers));
  if (req.body) console.log('Body:', JSON.stringify(req.body));
  next();
});

// Modelo básico de usuario (temporal)
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  roles: {
    buscador: { type: Boolean, default: true },
    propietario: { type: Boolean, default: false },
    admin: { type: Boolean, default: false }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Rutas básicas
app.post('/register', async (req, res) => {
  try {
    console.log("Datos recibidos:", req.body); // Añade este log para depuración
    
    const { email, password, nombre, apellido } = req.body;
    
    // Verifica que todos los campos existan
    if (!email || !password || !nombre || !apellido) {
      return res.status(400).json({ 
        success: false, 
        message: 'Todos los campos son requeridos' 
      });
    }
    
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }
    
    // Crear nuevo usuario
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      password: hashedPassword,
      nombre,
      apellido
    });
    
    await newUser.save();
    
    // Generar token JWT
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );
    
    res.status(201).json({
      message: 'Usuario registrado correctamente',
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        nombre: newUser.nombre,
        apellido: newUser.apellido,
        roles: newUser.roles
      }
    });
    
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ success: false, message: 'Error al registrar el usuario' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Buscar usuario
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    
    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    
    // Generar token JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );
    
    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: user._id,
        email: user.email,
        nombre: user.nombre,
        apellido: user.apellido,
        roles: user.roles
      }
    });
    
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Ruta de salud
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'auth-service' });
});

// Conectar a MongoDB y iniciar servidor
mongoose.connect(process.env.MONGODB_URI || 'mongodb://mongodb:27017/auth-db')
  .then(() => {
    console.log('Conectado a MongoDB');
    app.listen(config.port, () => {
      console.log(`Auth Service corriendo en puerto ${config.port}`);
    });
  })
  .catch(err => {
    console.error('Error conectando a MongoDB:', err);
  }); 