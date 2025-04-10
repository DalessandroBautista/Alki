#!/bin/bash

echo "🔄 Reiniciando servicios..."

# Detener procesos previos (si existen)
echo "🛑 Deteniendo procesos existentes..."
pkill -f "node.*property-service"
pkill -f "node.*api-gateway"

# Esperar a que terminen los procesos
sleep 2

echo "🚀 Iniciando servicio de propiedades..."
cd /workspace/backend/services/property-service
node index.js > /tmp/property-service.log 2>&1 &
echo "✅ Servicio de propiedades iniciado (PID: $!)"

# Esperar antes de iniciar el siguiente servicio
sleep 3

echo "🚀 Iniciando API Gateway..."
cd /workspace/backend/services/api-gateway
node index.js > /tmp/api-gateway.log 2>&1 &
echo "✅ API Gateway iniciado (PID: $!)"

# Verificar que están ejecutándose
echo "📊 Verificando procesos..."
ps aux | grep node

echo "🔍 Puedes ver los logs con:"
echo "  tail -f /tmp/property-service.log"
echo "  tail -f /tmp/api-gateway.log"

echo "✅ Servicios reiniciados" 