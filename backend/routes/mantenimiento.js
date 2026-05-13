const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/mantenimientoController');
const verificarToken = require('../middlewares/authMiddleware');

router.use(verificarToken);


router.get('/', ctrl.getAll);
router.get('/preventivos', (req, res) => {req.params.tipo = 'preventivo';
    ctrl.getByTipo(req, res);
});
router.get('/:id', ctrl.getById);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.delete);

module.exports = router;