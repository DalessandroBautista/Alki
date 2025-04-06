FROM node:18-alpine

WORKDIR /app


# Primero copia package.json y package-lock.json (si existe)
COPY package*.json ./

# Luego ejecuta npm install
RUN npm install

# Copiar código fuente
COPY . .

# Exponer puerto
EXPOSE 8000

# Configurar variables de entorno
ENV NODE_ENV=production
ENV PORT=8000

# Comando para iniciar el servicio
CMD ["node", "src/app.js"]