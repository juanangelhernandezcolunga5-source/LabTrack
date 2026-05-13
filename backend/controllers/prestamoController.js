const Prestamo = require('../models/prestamoModel');

const prestamoCtrl = {
    getAll: (req, res) => {
        Prestamo.getAll((err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        });
    },
    // Nueva función para el controlador
    getById: (req, res) => {
        const { id } = req.params;
        Prestamo.getById(id, (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if (results.length === 0) return res.status(404).json({ mensaje: 'Préstamo no encontrado' });
            res.json(results[0]);
        });
    },

    create: (req, res) => {
        const { usuario_id, equipo_id } = req.body;
        
        // Validación: Verificar que vengan los datos obligatorios
        if (!usuario_id || !equipo_id) {
            return res.status(400).json({ mensaje: 'Faltan datos obligatorios (usuario_id, equipo_id)' });
        }

        Prestamo.create({ usuario_id, equipo_id, estado: 'Activo' }, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ mensaje: 'Préstamo creado con éxito', id: result.insertId });
        });
    },

    update: (req, res) => {
        const { id } = req.params;
        const { estado } = req.body;
        Prestamo.update(id, estado, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ mensaje: 'Estado del préstamo actualizado' });
        });
    },

    delete: (req, res) => {
        const { id } = req.params;
        Prestamo.delete(id, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ mensaje: 'Préstamo eliminado' });
        });
    },

    getRetrasados: (req, res) => {
        Prestamo.getRetrasados((err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        });
    }
};

module.exports = prestamoCtrl;