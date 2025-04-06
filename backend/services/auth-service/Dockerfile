FROM node:18-alpine

WORKDIR /app

# Primero copia package.json y package-lock.json
COPY package*.json ./

# Instala dependencias
RUN npm install

# Luego copia el resto del código
COPY . .

# Expone el puerto (adaptar según el servicio)
EXPOSE 3001

# Configurar variables de entorno
ENV NODE_ENV=production
ENV PORT=8000

# Comando para iniciar el servicio
CMD ["npm", "start"]
