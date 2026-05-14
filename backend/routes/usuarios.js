/**
 * Rutas de Usuarios para LabTrack
 * Define los endpoints de la API REST para la gestión de usuarios en el sistema de laboratorios.
 * Todas las rutas requieren autenticación mediante token JWT para acceder a funcionalidades de usuario.
 */

const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/usuarioController');
const verificarToken = require('../middlewares/authMiddleware');

// Middleware de autenticación aplicado a todas las rutas de usuarios
router.use(verificarToken);

// Endpoint para obtener la lista completa de usuarios registrados en LabTrack
router.get('/', ctrl.getAll);

// Endpoint para consultar los detalles de un usuario específico por su ID
router.get('/:id', ctrl.getById);

// Endpoint para registrar un nuevo usuario en el sistema
router.post('/', ctrl.create);

// Endpoint para actualizar la información de un usuario existente
router.put('/:id', ctrl.update);

// Endpoint para eliminar un usuario del sistema LabTrack
router.delete('/:id', ctrl.delete);

module.exports = router;