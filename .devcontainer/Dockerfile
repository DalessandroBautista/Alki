FROM node:18

# Instalar dependencias generales
RUN apt-get update && apt-get install -y \
    git \
    curl \
    wget \
    unzip \
    python3 \
    build-essential \
    default-jdk \
    && rm -rf /var/lib/apt/lists/*

# Corregir la ruta de JAVA_HOME para apuntar a OpenJDK 17
ENV JAVA_HOME /usr/lib/jvm/java-17-openjdk-amd64

# Crear directorio de trabajo
WORKDIR /workspace

# Usar una versión específica de npm compatible con Node.js 18
RUN npm install -g npm@10.2.4 && \
    npm install -g expo-cli react-native-cli

# Cambiar al usuario node
USER node 