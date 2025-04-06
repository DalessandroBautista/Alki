const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  nombre: { 
    type: String, 
    required: true,
    unique: true,
    trim: true 
  },
  descripcion: { 
    type: String,
    trim: true 
  },
  icono: { 
    type: String 
  }
}, {
  timestamps: true
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category; 