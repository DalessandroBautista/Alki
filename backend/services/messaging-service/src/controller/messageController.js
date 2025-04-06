const Message = require('../../../../src/models/Message');
const User = require('../../../auth-service/src/models/User');
const Property = require('../../../property-service/src/models/Property');

// Enviar un mensaje
exports.sendMessage = async (req, res) => {
  try {
    const { propiedadId, contenido } = req.body;
    
    // Verificar que la propiedad exista
    const property = await Property.findById(propiedadId);
    if (!property) {
      return res.status(404).json({ message: 'Propiedad no encontrada' });
    }
    
    // No permitir enviar mensaje a uno mismo
    if (property.propietario.toString() === req.userId) {
      return res.status(400).json({ 
        message: 'No puedes enviar un mensaje a tu propia propiedad' 
      });
    }
    
    // Crear mensaje
    const message = new Message({
      emisor: req.userId,
      receptor: property.propietario,
      propiedad: propiedadId,
      contenido
    });
    
    await message.save();
    
    res.status(201).json({
      message: 'Mensaje enviado con éxito',
      data: message
    });
    
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al enviar mensaje', 
      error: error.message 
    });
  }
};

// Obtener mensajes recibidos
exports.getInbox = async (req, res) => {
  try {
    const messages = await Message.find({ receptor: req.userId })
      .populate('emisor', 'nombre apellido foto')
      .populate('propiedad', 'titulo imagenes')
      .sort({ fechaEnvio: -1 });
    
    res.json({ messages });
    
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al obtener mensajes', 
      error: error.message 
    });
  }
};

// Obtener mensajes enviados
exports.getSent = async (req, res) => {
  try {
    const messages = await Message.find({ emisor: req.userId })
      .populate('receptor', 'nombre apellido foto')
      .populate('propiedad', 'titulo imagenes')
      .sort({ fechaEnvio: -1 });
    
    res.json({ messages });
    
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al obtener mensajes enviados', 
      error: error.message 
    });
  }
};

// Marcar mensaje como leído
exports.markAsRead = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({ message: 'Mensaje no encontrado' });
    }
    
    // Verificar que el usuario sea el receptor
    if (message.receptor.toString() !== req.userId) {
      return res.status(403).json({ 
        message: 'No tienes permisos para modificar este mensaje' 
      });
    }
    
    // Marcar como leído
    await message.marcarLeido();
    
    res.json({
      message: 'Mensaje marcado como leído',
      data: message
    });
    
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al marcar mensaje como leído', 
      error: error.message 
    });
  }
};

// Eliminar mensaje
exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({ message: 'Mensaje no encontrado' });
    }
    
    // Verificar que el usuario sea el emisor o receptor
    if (message.emisor.toString() !== req.userId && 
        message.receptor.toString() !== req.userId) {
      return res.status(403).json({ 
        message: 'No tienes permisos para eliminar este mensaje' 
      });
    }
    
    await Message.findByIdAndDelete(req.params.id);
    
    res.json({
      message: 'Mensaje eliminado con éxito'
    });
    
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al eliminar mensaje', 
      error: error.message 
    });
  }
}; 