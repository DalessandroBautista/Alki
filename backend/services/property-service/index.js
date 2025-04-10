const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./src/config');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Esquema básico de propiedad
const propertySchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  precio: { type: Number, required: true },
  tipo: { type: String, required: true },
  direccion: {
    calle: { type: String, required: true },
    numero: { type: String, required: true },
    ciudad: { type: String, required: true }
  },
  propietario: { type: mongoose.Schema.Types.ObjectId, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Property = mongoose.model('Property', propertySchema);

// Rutas básicas
app.get('/properties', async (req, res) => {
  try {
    console.log('📦 [Property Service] Solicitando todas las propiedades');
    const properties = await Property.find();
    console.log(`📦 [Property Service] Se encontraron ${properties.length} propiedades`);
    // Mostrar la estructura de la primera propiedad para depuración
    if (properties.length > 0) {
      console.log('📦 [Property Service] Ejemplo de estructura:', JSON.stringify(properties[0], null, 2));
    }
    res.json(properties);
  } catch (error) {
    console.error('Error al obtener propiedades:', error);
    res.status(500).json({ message: 'Error al obtener propiedades' });
  }
});

// Ruta de salud
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'property-service' });
});

// Acceso directo a la configuración de puerto
const PORT = config.port || 3002;

// Conectar a MongoDB e iniciar servidor
mongoose.connect(process.env.MONGODB_URI || 'mongodb://mongodb:27017/property-db')
  .then(() => {
    console.log('Conectado a MongoDB');
    app.listen(PORT, () => {
      console.log(`Property Service corriendo en puerto ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error conectando a MongoDB:', err);
  }); 