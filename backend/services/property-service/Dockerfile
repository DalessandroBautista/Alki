FROM node:18-alpine

WORKDIR /app


# Primero copia package.json y package-lock.json (si existe)
COPY package*.json ./

# Luego ejecuta npm install
RUN npm install

# Copiar código fuente
COPY . .

# Exponer puerto
EXPOSE 3002

# Configurar variables de entorno
ENV NODE_ENV=production
ENV PORT=3002

# Comando para iniciar el servicio
CMD ["npm", "start"]