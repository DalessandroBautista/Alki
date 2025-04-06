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
    const properties = await Property.find();
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener propiedades' });
  }
});

// Ruta de salud
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'property-service' });
});

// Conectar a MongoDB e iniciar servidor
mongoose.connect(process.env.MONGODB_URI || 'mongodb://mongodb:27017/property-db')
  .then(() => {
    console.log('Conectado a MongoDB');
    app.listen(config.port, () => {
      console.log(`Property Service corriendo en puerto ${config.port}`);
    });
  })
  .catch(err => {
    console.error('Error conectando a MongoDB:', err);
  }); 