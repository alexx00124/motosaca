const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRegister, validateLogin, validateId } = require('../middleware/validate');

// POST /api/auth/register - Registrar nuevo usuario
router.post('/register', validateRegister, authController.register);

// POST /api/auth/login - Login de usuario
router.post('/login', validateLogin, authController.login);

// GET /api/auth/user/:id - Obtener información del usuario (opcional)
router.get('/user/:id', validateId, authController.getUser);

module.exports = router;