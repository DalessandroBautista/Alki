const { MongoClient, ObjectId } = require('mongodb');

// Configuración de MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongodb:27017/property-db';
const DB_NAME = MONGODB_URI.split('/').pop().split('?')[0];

async function createTestProperty() {
  console.log(`🔄 Conectando a MongoDB en: ${MONGODB_URI}`);
  console.log(`🔄 Base de datos: ${DB_NAME}`);
  
  const client = new MongoClient(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 30000
  });
  
  try {
    await client.connect();
    console.log('✅ Conectado a MongoDB');
    
    const db = client.db();
    const propertyCollection = db.collection('properties');
    
    // Crear ID de propietario único
    const ownerId = new ObjectId();
    
    // Propiedad de prueba simplificada
    const testProperty = {
      titulo: "Propiedad de Prueba Direct",
      descripcion: "Creada directamente con driver MongoDB",
      precio: 750,
      moneda: "USD",
      tipo: "departamento",
      tipoAlquiler: "permanente",
      habitaciones: 2,
      baños: 1,
      propietario: ownerId,
      direccion: {
        calle: "Calle Test",
        numero: "123",
        ciudad: "Ciudad Test",
        provincia: "Provincia Test",
        pais: "País Test"
      },
      imagenes: ["https://via.placeholder.com/300x200"],
      disponible: true,
      destacado: true,
      fechaCreacion: new Date()
    };
    
    console.log('💾 Insertando propiedad de prueba...');
    const result = await propertyCollection.insertOne(testProperty);
    
    console.log('✅ Propiedad insertada correctamente');
    console.log(`   ID: ${result.insertedId}`);
    
    // Verificar que se insertó
    const propertyCount = await propertyCollection.countDocuments();
    console.log(`📊 Total de propiedades en la colección: ${propertyCount}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('✅ Conexión cerrada');
  }
}

createTestProperty(); 