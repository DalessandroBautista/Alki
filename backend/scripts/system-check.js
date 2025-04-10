const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Función para ejecutar comandos shell
function runCommand(command) {
  return new Promise((resolve, reject) => {
    console.log(`🔧 Ejecutando: ${command}`);
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Error: ${error.message}`);
        return reject(error);
      }
      if (stderr) {
        console.warn(`⚠️ Stderr: ${stderr}`);
      }
      console.log(`✅ Resultado: ${stdout}`);
      resolve(stdout);
    });
  });
}

async function checkSystem() {
  console.log('🔍 INICIANDO VERIFICACIÓN DEL SISTEMA');
  
  // Verificar puertos en uso
  console.log('\n📊 Verificando puertos en uso:');
  try {
    await runCommand('netstat -tlnp | grep node');
  } catch (error) {
    console.log('No se encontraron procesos Node.js escuchando en puertos');
  }
  
  // Verificar Docker (si está disponible)
  console.log('\n🐳 Verificando contenedores Docker:');
  try {
    await runCommand('docker ps');
  } catch (error) {
    console.log('Docker no está disponible o no hay contenedores en ejecución');
  }
  
  // Verificar estructura de archivos
  console.log('\n📁 Verificando estructura de archivos del proyecto:');
  
  const checkPaths = [
    'services/api-gateway/src/routes/propertyRoutes.js',
    'services/property-service/src/routes/propertyRoutes.js',
    'services/property-service/src/models/Property.js'
  ];
  
  for (const filePath of checkPaths) {
    const fullPath = path.join(process.cwd(), filePath);
    try {
      fs.accessSync(fullPath, fs.constants.R_OK);
      console.log(`✅ Archivo existe: ${filePath}`);
    } catch (err) {
      console.error(`❌ No se puede acceder al archivo: ${filePath}`);
    }
  }
  
  console.log('\n🔍 VERIFICACIÓN DEL SISTEMA COMPLETADA');
}

checkSystem(); 