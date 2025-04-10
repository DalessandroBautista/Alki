const http = require('http');
const https = require('https');

function testEndpoint(url, description) {
  console.log(`\n🧪 Probando: ${description} (${url})`);
  
  return new Promise((resolve) => {
    const start = Date.now();
    const isHttps = url.startsWith('https');
    const client = isHttps ? https : http;
    
    const parsedUrl = new URL(url);
    
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (isHttps ? 443 : 80),
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const req = client.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const timeMs = Date.now() - start;
        
        console.log(`✅ Éxito (${timeMs}ms) - Estado: ${res.statusCode}`);
        try {
          const jsonData = JSON.parse(data);
          console.log(`📦 Datos recibidos: ${JSON.stringify(jsonData).substring(0, 100)}...`);
        } catch (e) {
          console.log(`📦 Datos recibidos (texto): ${data.substring(0, 100)}...`);
        }
        resolve(true);
      });
    });
    
    req.on('error', (error) => {
      console.error(`❌ Error: ${error.message}`);
      resolve(false);
    });
    
    req.end();
  });
}

async function runTests() {
  console.log('🧪 INICIANDO PRUEBAS DE API 🧪');
  
  const API_GATEWAY_URL = 'http://localhost:8000/api';
  const PROPERTY_SERVICE_URL = 'http://localhost:3002/api';
  
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