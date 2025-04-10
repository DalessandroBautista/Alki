const axios = require('axios');

const API_GATEWAY_URL = 'http://localhost:8000/api';
const PROPERTY_SERVICE_URL = 'http://localhost:3002/api';

async function testEndpoint(url, description) {
  console.log(`\n🧪 Probando: ${description} (${url})`);
  try {
    const start = Date.now();
    const response = await axios.get(url, {
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const timeMs = Date.now() - start;
    
    console.log(`✅ Éxito (${timeMs}ms) - Estado: ${response.status}`);
    console.log(`📦 Datos recibidos: ${JSON.stringify(response.data).substring(0, 100)}...`);
    return true;
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    if (error.response) {
      console.error(`   Estado: ${error.response.status}`);
      console.error(`   Datos: ${JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      console.error('   No se recibió respuesta del servidor');
    }
    return false;
  }
}

async function runTests() {
  console.log('🧪 INICIANDO PRUEBAS DE API 🧪');
  
  // Probar API Gateway
  await testEndpoint(`${API_GATEWAY_URL}/health`, 'Estado del API Gateway');
  await testEndpoint(`${API_GATEWAY_URL}/properties`, 'Propiedades en el API Gateway');
  await testEndpoint(`${API_GATEWAY_URL}/properties/featured`, 'Propiedades destacadas en API Gateway');
  
  // Probar servicio de propiedades directamente
  await testEndpoint(`${PROPERTY_SERVICE_URL}/properties`, 'Propiedades en el servicio directo');
  await testEndpoint(`${PROPERTY_SERVICE_URL}/properties/featured`, 'Propiedades destacadas en servicio directo');
  
  console.log('\n🧪 PRUEBAS COMPLETADAS 🧪');
}

runTests(); 