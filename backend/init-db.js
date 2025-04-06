const { MongoClient } = require('mongodb');

// URL de conexión a MongoDB
const url = 'mongodb://mongodb:27017';
const client = new MongoClient(url);

async function initDatabases() {
  try {
    await client.connect();
    console.log('Conectado a MongoDB');
    
    // Inicializar base de datos de autenticación
    const authDb = client.db('auth-db');
    if (!(await authDb.listCollections({name: 'users'}).hasNext())) {
      await authDb.createCollection('users');
      console.log('Colección "users" creada en auth-db');
    }
    
    // Inicializar base de datos de propiedades
    const propertyDb = client.db('property-db');
    if (!(await propertyDb.listCollections({name: 'properties'}).hasNext())) {
      await propertyDb.createCollection('properties');
      console.log('Colección "properties" creada en property-db');
    }
    if (!(await propertyDb.listCollections({name: 'categories'}).hasNext())) {
      await propertyDb.createCollection('categories');
      console.log('Colección "categories" creada en property-db');
      
      // Insertar categorías iniciales
      await propertyDb.collection('categories').insertMany([
        { nombre: 'Apartamentos', descripcion: 'Departamentos y unidades en edificios', icono: 'apartment' },
        { nombre: 'Casas', descripcion: 'Viviendas unifamiliares', icono: 'house' },
        { nombre: 'Oficinas', descripcion: 'Espacios de trabajo comerciales', icono: 'office' },
        { nombre: 'Locales', descripcion: 'Espacios comerciales', icono: 'store' }
      ]);
      console.log('Categorías iniciales creadas');
    }
    
    // Inicializar base de datos de mensajería
    const messagingDb = client.db('messaging-db');
    if (!(await messagingDb.listCollections({name: 'messages'}).hasNext())) {
      await messagingDb.createCollection('messages');
      console.log('Colección "messages" creada en messaging-db');
    }
    if (!(await messagingDb.listCollections({name: 'conversations'}).hasNext())) {
      await messagingDb.createCollection('conversations');
      console.log('Colección "conversations" creada en messaging-db');
    }
    
    console.log('Inicialización completada');
  } catch (err) {
    console.error('Error durante la inicialización:', err);
  } finally {
    await client.close();
  }
}

initDatabases(); 