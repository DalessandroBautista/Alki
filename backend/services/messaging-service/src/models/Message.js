const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  emisor: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true 
  },
  receptor: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true 
  },
  propiedad: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true 
  },
  asunto: { 
    type: String, 
    required: true 
  },
  contenido: { 
    type: String, 
    required: true 
  },
  leido: { 
    type: Boolean, 
    default: false 
  },
  fechaEnvio: { 
    type: Date, 
    default: Date.now 
  },
  fechaLectura: { 
    type: Date 
  },
  eliminadoPorEmisor: { 
    type: Boolean, 
    default: false 
  },
  eliminadoPorReceptor: { 
    type: Boolean, 
    default: false 
  }
}, {
  timestamps: true
});

// Método para marcar como leído
messageSchema.methods.marcarComoLeido = function() {
  if (!this.leido) {
    this.leido = true;
    this.fechaLectura = new Date();
  }
  return this.save();
};

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
