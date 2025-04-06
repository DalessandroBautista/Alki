const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    lowercase: true
  },
  password: { 
    type: String, 
    required: true 
  },
  nombre: { 
    type: String, 
    required: true,
    trim: true 
  },
  apellido: { 
    type: String, 
    required: true,
    trim: true 
  },
  telefono: { 
    type: String,
    trim: true 
  },
  foto: { 
    type: String 
  },
  roles: {
    buscador: { 
      type: Boolean, 
      default: true 
    },
    propietario: { 
      type: Boolean, 
      default: false 
    }
  },
  fechaRegistro: { 
    type: Date, 
    default: Date.now 
  },
  propiedadesFavoritas: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Property' 
  }],
  descripcion: { 
    type: String 
  }
});

// Middleware para hashear contraseña antes de guardar
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Método para generar objeto JSON sin la contraseña
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
