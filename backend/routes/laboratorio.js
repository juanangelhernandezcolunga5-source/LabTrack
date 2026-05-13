const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/laboratorioController');
const verificarToken = require('../middlewares/authMiddleware');

router.use(verificarToken);

// Extra: Buscar por encargado
router.get('/buscar/:nombre', ctrl.getByEncargado);

// CRUD Estándar
router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.delete);

module.exports = router;