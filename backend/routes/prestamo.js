const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/prestamoController');
const verificarToken = require('../middlewares/authMiddleware');

router.use(verificarToken); // Protegemos todas las rutas con el token

router.get('/retrasados', ctrl.getRetrasados); // Endpoint Extra
router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.delete);

module.exports = router;