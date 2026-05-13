const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/authController');

// Estas rutas NO llevan middleware porque generan el token
router.post('/registro', ctrl.registro);
router.post('/login', ctrl.login);

module.exports = router;