const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Rutas públicas
router.post('/register', authController.register);
router.post('/login', authController.login);

// Rutas protegidas (requieren token)
router.get('/profile', authMiddleware, authController.getProfile);

// Rutas para comunicación entre servicios
router.get('/users/:userId/check-role/:role', authController.checkRole);
router.get('/users/:userId/check-favorite/:propertyId', authController.checkFavorite);

module.exports = router;
