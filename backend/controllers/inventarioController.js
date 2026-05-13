const Inventario = require('../models/inventarioModel');

const inventarioCtrl = {
    // Obtener todos
    getAll: (req, res) => {
        Inventario.getAll((err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        });
    },

    // Obtener por ID
    getById: (req, res) => {
        const id = req.params.id;
        Inventario.getById(id, (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if (results.length === 0) return res.status(404).json({ mensaje: 'Equipo no encontrado' });
            res.json(results[0]);
        });
    },

    // Crear
    create: (req, res) => {
        const { nombre, categoria, cantidad } = req.body;
        
        // Validación de error (Para tu captura de código 400 obligatoria)
        if (!nombre || !categoria || cantidad === undefined) {
            return res.status(400).json({ mensaje: 'Faltan datos obligatorios (nombre, categoria, cantidad)' });
        }

        // Determinamos el estado basado en la cantidad
        let estado = 'Disponible';
        if (cantidad == 0) estado = 'Agotado';
        else if (cantidad <= 3) estado = 'Stock Bajo';

        const nuevoEquipo = { nombre, categoria, cantidad, estado };

        Inventario.create(nuevoEquipo, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ mensaje: 'Equipo creado exitosamente', id: result.insertId });
        });
    },

    // Actualizar
    update: (req, res) => {
        const id = req.params.id;
        const datosActualizados = req.body;

        Inventario.update(id, datosActualizados, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Equipo no encontrado para actualizar' });
            res.json({ mensaje: 'Equipo actualizado exitosamente' });
        });
    },

    // Eliminar
    delete: (req, res) => {
        const id = req.params.id;
        Inventario.delete(id, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Equipo no encontrado para eliminar' });
            res.json({ mensaje: 'Equipo eliminado exitosamente' });
        });
    }
};

module.exports = inventarioCtrl;