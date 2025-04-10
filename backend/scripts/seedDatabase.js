const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const { ObjectId } = require('mongodb');

// URL de conexión a MongoDB para Docker
const MONGODB_URI = 'mongodb://mongodb:27017/test';

// Función para generar una contraseña hash
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Función principal
async function seedDatabase() {
  let client;
  
  try {
    // Opciones de conexión
    const options = {
      connectTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 30000,
    };
    
    console.log('Conectando a MongoDB...');
    client = new MongoClient(MONGODB_URI, options);
    await client.connect();
    console.log('Conexión exitosa a MongoDB');
    
    const db = client.db();
    
    // Limpiar colecciones existentes
    console.log('Limpiando colecciones...');
    const collections = ['users', 'properties', 'categories', 'messages', 'conversations'];
    
    for (const collection of collections) {
      try {
        await db.collection(collection).deleteMany({});
        console.log(`Colección ${collection} limpiada`);
      } catch (err) {
        console.log(`Error al limpiar colección ${collection}: ${err.message}`);
      }
    }
    
    // Crear usuarios
    console.log('Creando usuarios...');
    const adminPasswordHashed = await hashPassword('Admin123!');
    const passwordHashed = await hashPassword('Password123!');
    
    const usuarios = [
      {
        _id: new ObjectId(),
        email: 'admin@example.com',
        password: adminPasswordHashed,
        nombre: 'Admin',
        apellido: 'Sistema',
        telefono: '+1234567890',
        roles: {
          admin: true,
          propietario: true,
          buscador: true
        },
        verificado: true,
        propiedadesFavoritas: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new ObjectId(),
        email: 'propietario@example.com',
        password: passwordHashed,
        nombre: 'José',
        apellido: 'García',
        telefono: '+34612345678',
        roles: {
          admin: false,
          propietario: true,
          buscador: false
        },
        verificado: true,
        propiedadesFavoritas: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new ObjectId(),
        email: 'buscador@example.com',
        password: passwordHashed,
        nombre: 'María',
        apellido: 'López',
        telefono: '+34623456789',
        roles: {
          admin: false,
          propietario: false,
          buscador: true
        },
        verificado: true,
        propiedadesFavoritas: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new ObjectId(),
        email: 'ambos@example.com',
        password: passwordHashed,
        nombre: 'Carlos',
        apellido: 'Martínez',
        telefono: '+34634567890',
        roles: {
          admin: false,
          propietario: true,
          buscador: true
        },
        verificado: true,
        propiedadesFavoritas: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    await db.collection('users').insertMany(usuarios);
    console.log(`${usuarios.length} usuarios creados`);
    
    // Crear categorías
    console.log('Creando categorías...');
    const categorias = [
      {
        _id: new ObjectId(),
        nombre: 'Apartamentos',
        descripcion: 'Apartamentos y pisos',
        icono: 'apartment',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new ObjectId(),
        nombre: 'Casas',
        descripcion: 'Casas y chalets',
        icono: 'home',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new ObjectId(),
        nombre: 'Oficinas',
        descripcion: 'Espacios de trabajo',
        icono: 'business',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new ObjectId(),
        nombre: 'Locales',
        descripcion: 'Locales comerciales',
        icono: 'store',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new ObjectId(),
        nombre: 'Terrenos',
        descripcion: 'Solares y parcelas',
        icono: 'terrain',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    await db.collection('categories').insertMany(categorias);
    console.log(`${categorias.length} categorías creadas`);
    
    // Crear propiedades
    console.log('Creando propiedades...');
    const propiedades = [
      {
        _id: new ObjectId(),
        titulo: 'Apartamento céntrico de 2 habitaciones',
        descripcion: 'Bonito apartamento reformado en el centro de la ciudad con todas las comodidades.',
        precio: 800,
        moneda: 'EUR',
        tipo: 'departamento',
        tipoAlquiler: 'permanente',
        habitaciones: 2,
        baños: 1,
        superficie: 75,
        propietario: usuarios[1]._id, // Propietario
        direccion: {
          calle: 'Calle Mayor',
          numero: '15',
          ciudad: 'Madrid',
          provincia: 'Madrid',
          pais: 'España',
          codigoPostal: '28001',
          ubicacion: {
            type: 'Point',
            coordinates: [-3.703790, 40.416775]
          },
          direccionCompleta: 'Calle Mayor 15, 28001 Madrid, España'
        },
        imagenes: [
          'https://example.com/imagenes/apto1_1.jpg',
          'https://example.com/imagenes/apto1_2.jpg'
        ],
        categorias: [categorias[0]._id], // Apartamentos
        requisitos: {
          garantia: true,
          adelanto: 1,
          mascotas: false,
          niños: true
        },
        servicios: {
          agua: true,
          luz: true,
          internet: true,
          gas: true,
          calefaccion: true,
          aireAcondicionado: true
        },
        disponible: true,
        destacado: true,
        fechaPublicacion: new Date(),
        vistas: 45,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new ObjectId(),
        titulo: 'Casa adosada con jardín',
        descripcion: 'Amplia casa adosada con jardín privado en zona residencial tranquila.',
        precio: 1200,
        moneda: 'EUR',
        tipo: 'casa',
        tipoAlquiler: 'permanente',
        habitaciones: 3,
        baños: 2,
        superficie: 150,
        propietario: usuarios[1]._id, // Propietario
        direccion: {
          calle: 'Calle del Pinar',
          numero: '8',
          ciudad: 'Valencia',
          provincia: 'Valencia',
          pais: 'España',
          codigoPostal: '46010',
          ubicacion: {
            type: 'Point',
            coordinates: [-0.3763, 39.4699]
          },
          direccionCompleta: 'Calle del Pinar 8, 46010 Valencia, España'
        },
        imagenes: [
          'https://example.com/imagenes/casa1_1.jpg',
          'https://example.com/imagenes/casa1_2.jpg'
        ],
        categorias: [categorias[1]._id], // Casas
        requisitos: {
          garantia: true,
          adelanto: 2,
          mascotas: true,
          niños: true
        },
        servicios: {
          agua: true,
          luz: true,
          internet: true,
          gas: true,
          calefaccion: true,
          piscina: false,
          estacionamiento: true
        },
        disponible: true,
        destacado: false,
        fechaPublicacion: new Date(),
        vistas: 28,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new ObjectId(),
        titulo: 'Local comercial en avenida principal',
        descripcion: 'Local comercial a pie de calle en zona de alto tránsito peatonal.',
        precio: 1500,
        moneda: 'EUR',
        tipo: 'local',
        tipoAlquiler: 'permanente',
        habitaciones: 0,
        baños: 1,
        superficie: 120,
        propietario: usuarios[3]._id, // Usuario con ambos roles
        direccion: {
          calle: 'Avenida Diagonal',
          numero: '352',
          ciudad: 'Barcelona',
          provincia: 'Barcelona',
          pais: 'España',
          codigoPostal: '08013',
          ubicacion: {
            type: 'Point',
            coordinates: [2.1734, 41.3851]
          },
          direccionCompleta: 'Avenida Diagonal 352, 08013 Barcelona, España'
        },
        imagenes: [
          'https://example.com/imagenes/local1_1.jpg',
          'https://example.com/imagenes/local1_2.jpg'
        ],
        categorias: [categorias[3]._id], // Locales
        requisitos: {
          garantia: true,
          adelanto: 3,
          otros: 'Se requiere seguro de responsabilidad civil'
        },
        servicios: {
          agua: true,
          luz: true,
          internet: false,
          gas: false,
          aire_acondicionado: true
        },
        disponible: true,
        destacado: true,
        fechaPublicacion: new Date(),
        vistas: 32,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    await db.collection('properties').insertMany(propiedades);
    console.log(`${propiedades.length} propiedades creadas`);
    
    // Crear conversaciones y mensajes
    console.log('Creando conversaciones y mensajes...');
    const conversacion = {
      _id: new ObjectId(),
      participantes: [usuarios[2]._id, usuarios[1]._id], // Buscador y Propietario
      propiedad: propiedades[0]._id,
      activa: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const mensaje1 = {
      _id: new ObjectId(),
      emisor: usuarios[2]._id, // Buscador
      receptor: usuarios[1]._id, // Propietario
      propiedad: propiedades[0]._id,
      asunto: 'Consulta sobre disponibilidad',
      contenido: 'Hola, estoy interesado en este apartamento. ¿Podría visitarlo este fin de semana?',
      leido: true,
      fechaEnvio: new Date(Date.now() - 86400000), // 1 día atrás
      fechaLectura: new Date(Date.now() - 43200000), // 12 horas atrás
      createdAt: new Date(Date.now() - 86400000),
      updatedAt: new Date(Date.now() - 86400000)
    };
    
    const mensaje2 = {
      _id: new ObjectId(),
      emisor: usuarios[1]._id, // Propietario
      receptor: usuarios[2]._id, // Buscador
      propiedad: propiedades[0]._id,
      asunto: 'Re: Consulta sobre disponibilidad',
      contenido: '¡Hola! Sí, podría mostrarte el apartamento este sábado a las 12h. ¿Te viene bien?',
      leido: false,
      fechaEnvio: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Actualizar la conversación con referencia al último mensaje
    conversacion.ultimoMensaje = mensaje2._id;
    conversacion.fechaUltimoMensaje = mensaje2.createdAt;
    
    await db.collection('conversations').insertOne(conversacion);
    await db.collection('messages').insertMany([mensaje1, mensaje2]);
    console.log('1 conversación y 2 mensajes creados');
    
    // Agregar una propiedad a favoritos del buscador
    await db.collection('users').updateOne(
      { _id: usuarios[2]._id }, // Buscador
      { $set: { propiedadesFavoritas: [propiedades[0]._id] }}
    );
    console.log('Propiedad añadida a favoritos de un usuario');
    
    console.log('\n¡Base de datos cargada con éxito! 🚀');
    console.log('\nResumen:');
    console.log(`- Usuarios: ${usuarios.length} (incluyendo 1 administrador)`);
    console.log(`- Propiedades: ${propiedades.length}`);
    console.log(`- Categorías: ${categorias.length}`);
    console.log(`- Conversaciones: 1`);
    console.log(`- Mensajes: 2`);
    
    // Credenciales de acceso
    console.log('\nCredenciales de acceso:');
    console.log('- Administrador: admin@example.com / Admin123!');
    console.log('- Propietario: propietario@example.com / Password123!');
    console.log('- Buscador: buscador@example.com / Password123!');
    console.log('- Usuario con ambos roles: ambos@example.com / Password123!');
    
  } catch (error) {
    console.error('Error al cargar datos:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('Conexión a MongoDB cerrada');
    }
  }
}

// Ejecutar script
seedDatabase(); 