const express = require('express');
const propertyController = require('../controller/propertyController');
const authMiddleware = require('../../../../src/middleware/auth');

const router = express.Router();

// Rutas públicas
router.get('/', propertyController.getAllProperties);
router.get('/search', propertyController.searchByProximity);
router.get('/:id', propertyController.getPropertyById);

// Rutas protegidas
router.post('/', authMiddleware, propertyController.createProperty);
router.put('/:id', authMiddleware, propertyController.updateProperty);
router.delete('/:id', authMiddleware, propertyController.deleteProperty);
router.post('/:id/favorite', authMiddleware, propertyController.toggleFavorite);

module.exports = router;
