const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/inventarioController');
const verificarToken = require('../middlewares/authMiddleware'); // Importamos la protección


// TODAS las rutas de inventario estarán protegidas
router.use(verificarToken); 

router.get('/', ctrl.getAll);           // Leer todos
router.get('/:id', ctrl.getById);       // Leer uno
router.post('/', ctrl.create);          // Crear
router.put('/:id', ctrl.update);        // Actualizar
router.delete('/:id', ctrl.delete);     // Eliminar
router.get('/reporte/bajo-stock', ctrl.getByStockBajo); //Ruta para observar equipos con stock bajo (cantidad <= 3)

module.exports = router;