const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  participantes: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    required: true 
  }],
  propiedad: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true 
  },
  ultimoMensaje: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Message' 
  },
  fechaUltimoMensaje: { 
    type: Date, 
    default: Date.now 
  },
  activa: { 
    type: Boolean, 
    default: true 
  }
}, {
  timestamps: true
});

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation; 