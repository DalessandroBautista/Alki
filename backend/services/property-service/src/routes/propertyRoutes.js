const express = require('express');
const propertyController = require('../controller/propertyController');
const authMiddleware = require('../../../../src/middleware/auth');
const Property = require('../models/Property');

const router = express.Router();

// Middleware para logging (para depuración)
router.use((req, res, next) => {
  console.log(`🔍 [Property Service] ${req.method} ${req.path}`);
  next();
});

// Rutas públicas
router.get('/', async (req, res) => {
  try {
    console.log('🔍 Buscando todas las propiedades');
    const properties = await Property.find({}).exec();
    console.log(`✅ Encontradas ${properties.length} propiedades`);
    res.json(properties);
  } catch (error) {
    console.error('❌ Error al obtener propiedades:', error);
    res.status(500).json({ error: 'Error al recuperar propiedades' });
  }
});

router.get('/featured', async (req, res) => {
  try {
    console.log('🔍 Buscando propiedades destacadas');
    const properties = await Property.find({ destacado: true }).exec();
    console.log(`✅ Encontradas ${properties.length} propiedades destacadas`);
    res.json(properties);
  } catch (error) {
    console.error('❌ Error al obtener propiedades destacadas:', error);
    res.status(500).json({ error: 'Error al recuperar propiedades destacadas' });
  }
});

router.get('/search', propertyController.searchByProximity);

router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).exec();
    if (!property) {
      return res.status(404).json({ error: 'Propiedad no encontrada' });
    }
    res.json(property);
  } catch (error) {
    console.error('❌ Error al obtener propiedad:', error);
    res.status(500).json({ error: 'Error al recuperar propiedad' });
  }
});

// Rutas protegidas
router.post('/', authMiddleware, propertyController.createProperty);
router.put('/:id', authMiddleware, propertyController.updateProperty);
router.delete('/:id', authMiddleware, propertyController.deleteProperty);
router.post('/:id/favorite', authMiddleware, propertyController.toggleFavorite);

module.exports = router;
