#!/bin/bash

# Inicia MongoDB (si está instalado localmente)
# mongod --dbpath /data/db &

# Inicia el servicio de autenticación
cd /workspace/backend/services/auth-service
PORT=8001 node src/server.js &

# Inicia el servicio de propiedades
cd /workspace/backend/services/property-service
PORT=8002 node src/server.js &

# Inicia el servicio de mensajería
cd /workspace/backend/services/messaging-service
PORT=8003 node src/server.js &

# Inicia el API Gateway
cd /workspace/backend/services/api-gateway
PORT=8000 node src/server.js &

echo "Todos los servicios iniciados. Presiona Ctrl+C para detener."
wait
