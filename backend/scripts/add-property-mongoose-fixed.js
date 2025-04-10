const mongoose = require('mongoose');
const { Schema, model } = mongoose;

// Creamos una versión simplificada del modelo directamente (sin importar)
const PropertySchema = new Schema({
  titulo: String,
  descripcion: String,
  precio: Number,
  moneda: String,
  tipo: String,
  habitaciones: Number,
  baños: Number,
  propietario: Schema.Types.ObjectId,
  direccion: {
    calle: String,
    numero: String,
    ciudad: String,
    provincia: String,
    pais: String
  },
  disponible: Boolean,
  destacado: Boolean,
  fechaCreacion: { type: Date, default: Date.now }
});

// Compilamos el modelo directamente
const Property = model('Property', PropertySchema);

// Conectar a MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongodb:27017/property-db';

console.log('🔄 Conectando a MongoDB en:', MONGODB_URI);
mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('✅ Conectado a MongoDB');
    
    try {
      // Verificar que podemos acceder a la colección
      const count = await Property.countDocuments();
      console.log(`🔢 Propiedades existentes: ${count}`);
      
      // Imprimir las propiedades existentes
      const props = await Property.find().limit(2);
      console.log('📋 Ejemplos de propiedades existentes:', 
        props.map(p => ({id: p._id, titulo: p.titulo})));
      
      // Crear una propiedad de prueba
      const newProperty = new Property({
        titulo: 'Apartamento de prueba Mongoose',
        descripcion: 'Creado con Mongoose directamente',
        precio: 650,
        moneda: 'EUR',
        tipo: 'departamento',
        habitaciones: 2,
        baños: 1,
        propietario: new mongoose.Types.ObjectId(),
        direccion: {
          calle: 'Calle Mongoose',
          numero: '123',
          ciudad: 'MongooseCity',
          provincia: 'MongooseProvince',
          pais: 'MongooseLand'
        },
        disponible: true,
        destacado: true
      });
      
      console.log('💾 Guardando propiedad de prueba...');
      const saved = await newProperty.save();
      
      console.log('✅ Propiedad guardada correctamente:', saved._id.toString());
    } catch (error) {
      console.error('❌ Error:', error);
    } finally {
      await mongoose.disconnect();
      console.log('✅ Desconectado de MongoDB');
    }
  })
  .catch(err => {
    console.error('❌ Error al conectar a MongoDB:', err);
  }); 