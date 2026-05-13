const Laboratorio = require('../models/laboratorioModel');

const laboratorioCtrl = {
    getAll: (req, res) => {
        Laboratorio.getAll((err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        });
    },

    getById: (req, res) => {
        const { id } = req.params;
        Laboratorio.getById(id, (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if (results.length === 0) return res.status(404).json({ mensaje: 'Laboratorio no encontrado' });
            res.json(results[0]);
        });
    },

    create: (req, res) => {
        const { nombre, ubicacion, encargado, estado } = req.body;

        // Validación: nombre y ubicación son obligatorios
        if (!nombre || !ubicacion) {
            return res.status(400).json({ mensaje: 'Faltan datos obligatorios (nombre, ubicacion)' });
        }

        const nuevoLab = { nombre, ubicacion, encargado, estado };

        Laboratorio.create(nuevoLab, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ mensaje: 'Laboratorio creado', id: result.insertId });
        });
    },

    update: (req, res) => {
        const { id } = req.params;
        const datos = req.body;

        Laboratorio.update(id, datos, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Laboratorio no encontrado' });
            res.json({ mensaje: 'Laboratorio actualizado correctamente' });
        });
    },

    delete: (req, res) => {
        const { id } = req.params;
        Laboratorio.delete(id, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Laboratorio no encontrado' });
            res.json({ mensaje: 'Laboratorio eliminado' });
        });
    },

    // Endpoint extra: Filtrar por nombre de encargado
    getByEncargado: (req, res) => {
        const { nombre } = req.params;
        Laboratorio.getByEncargado(nombre, (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        });
    }
};

module.exports = laboratorioCtrl;