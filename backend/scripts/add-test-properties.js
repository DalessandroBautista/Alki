const mongoose = require('mongoose');
const Property = require('../services/property-service/src/models/Property');

// Aumenta el timeout y usa opciones adicionales
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongodb:27017/property-db';

console.log('🔄 Intentando conectar a MongoDB en:', MONGODB_URI);

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 15000,
  socketTimeoutMS: 45000,
})
  .then(async () => {
    console.log('✅ Conectado a MongoDB');
    
    try {
      // Verificar si la colección existe
      console.log('🔍 Verificando colección de propiedades...');
      const collections = await mongoose.connection.db.listCollections().toArray();
      console.log('📋 Colecciones disponibles:', collections.map(c => c.name).join(', '));
      
      // Crear usuario de prueba con un ID específico
      const ownerId = new mongoose.Types.ObjectId();
      console.log('👤 ID de propietario de prueba creado:', ownerId.toString());
      
      // Una sola propiedad para prueba rápida
      const testProperty = {
        titulo: "Apartamento para prueba",
        descripcion: "Propiedad de prueba con datos básicos",
        precio: 500,
        moneda: "USD",
        tipo: "departamento",
        habitaciones: 2,
        baños: 1,
        propietario: ownerId,
        direccion: {
          calle: "Test",
          numero: "123",
          ciudad: "TestCity",
          provincia: "TestProvince",
          pais: "TestCountry"
        },
        disponible: true,
        destacado: true
      };
      
      console.log('💾 Guardando propiedad de prueba...');
      const prop = new Property(testProperty);
      await prop.save();
      
      console.log('✅ Propiedad guardada exitosamente:', prop._id.toString());
    } catch (error) {
      console.error('❌ Error detallado:', error);
    } finally {
      mongoose.disconnect();
      console.log('✅ Desconectado de MongoDB');
    }
  })
  .catch(err => {
    console.error('❌ Error al conectar a MongoDB:', err);
  }); 