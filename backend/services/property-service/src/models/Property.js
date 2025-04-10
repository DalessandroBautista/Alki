const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  titulo: { 
    type: String, 
    required: true,
    trim: true 
  },
  descripcion: { 
    type: String, 
    required: true 
  },
  precio: { 
    type: Number, 
    required: true 
  },
  moneda: { 
    type: String, 
    enum: ['USD', 'EUR', 'ARS', 'MXN'], 
    default: 'USD' 
  },
  tipo: {
    type: String,
    enum: ['casa', 'departamento', 'ph', 'terreno', 'local', 'oficina', 'otro'],
    required: true
  },
  tipoAlquiler: {
    type: String,
    enum: ['permanente', 'temporario'],
    default: 'permanente'
  },
  habitaciones: { 
    type: Number, 
    required: true 
  },
  baños: { 
    type: Number, 
    required: true 
  },
  superficie: { 
    type: Number 
  },
  propietario: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  direccion: {
    calle: { type: String, required: true },
    numero: { type: String, required: true },
    ciudad: { type: String, required: true },
    provincia: { type: String, required: true },
    pais: { type: String, required: true },
    codigoPostal: { type: String },
    ubicacion: {
      type: { type: String, default: 'Point' },
      coordinates: [Number] // [longitud, latitud] - formato GeoJSON
    },
    direccionCompleta: { type: String } // Dirección formateada para Google Maps
  },
  imagenes: [{ 
    type: String 
  }],
  categorias: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  requisitos: {
    garantia: { type: Boolean, default: true },
    adelanto: { type: Number }, // cantidad de meses de adelanto
    mascotas: { type: Boolean, default: false },
    niños: { type: Boolean, default: true },
    otros: { type: String }
  },
  servicios: {
    agua: { type: Boolean, default: true },
    luz: { type: Boolean, default: true },
    internet: { type: Boolean, default: false },
    gas: { type: Boolean, default: false },
    calefaccion: { type: Boolean, default: false },
    aireAcondicionado: { type: Boolean, default: false },
    ascensor: { type: Boolean, default: false },
    estacionamiento: { type: Boolean, default: false },
    piscina: { type: Boolean, default: false },
    gimnasio: { type: Boolean, default: false },
    seguridad: { type: Boolean, default: false },
    amueblado: { type: Boolean, default: false }
  },
  disponible: { 
    type: Boolean, 
    default: true 
  },
  destacado: { 
    type: Boolean,
    default: false
  },
  fechaPublicacion: { 
    type: Date, 
    default: Date.now 
  },
  vistas: { 
    type: Number, 
    default: 0 
  }
}, {
  timestamps: true
});

// Índice geoespacial para búsquedas por proximidad
propertySchema.index({ "direccion.ubicacion": "2dsphere" });

// Incrementar contador de vistas
propertySchema.methods.incrementarVistas = function() {
  this.vistas += 1;
  return this.save();
};

const Property = mongoose.model('Property', propertySchema);

module.exports = Property;
