const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongodb:27017/property-db';

// Diagnóstico con el driver nativo de MongoDB
async function testNativeDriver() {
  console.log('\n🔍 Probando con driver nativo de MongoDB...');
  
  try {
    const client = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 15000
    });
    
    await client.connect();
    console.log('✅ Conectado a MongoDB con driver nativo');
    
    const db = client.db();
    console.log('✅ Bases de datos disponibles:', await client.db().admin().listDatabases());
    
    // Intentar insertar directamente
    console.log('💾 Intentando insertar documento directamente...');
    const result = await db.collection('test_collection').insertOne({
      test: true,
      timestamp: new Date()
    });
    
    console.log('✅ Documento insertado con éxito:', result.insertedId);
    
    await client.close();
    console.log('✅ Conexión cerrada correctamente');
    return true;
  } catch (error) {
    console.error('❌ Error con driver nativo:', error);
    return false;
  }
}

// Verificar puerto de MongoDB
async function checkMongoPort() {
  console.log('\n🔌 Verificando puerto de MongoDB...');
  try {
    const { execSync } = require('child_process');
    const result = execSync('netstat -tlnp | grep 27017').toString();
    console.log('✅ Puerto 27017 en uso:\n', result);
  } catch (error) {
    console.error('❌ No se pudo verificar el puerto 27017:', error.message);
  }
}

async function main() {
  console.log('🔄 DIAGNÓSTICO DE MONGODB');
  console.log('MongoDB URI:', MONGODB_URI);
  
  await checkMongoPort();
  await testNativeDriver();
  
  console.log('\n🔄 DIAGNÓSTICO COMPLETADO');
}

main(); 