const Mantenimiento = require('../models/mantenimientoModel');
const db = require('../config/db'); 

const mantenimientoCtrl = {
    // 1. Obtener todos los reportes de mantenimiento
    getAll: (req, res) => {
        Mantenimiento.getAll((err, results) => {
            if (err) return res.status(500).json({ error: 'Error al obtener datos: ' + err.message });
            res.json(results);
        });
    },

    // 2. Obtener un reporte por ID
    getById: (req, res) => {
        const { id } = req.params;
        Mantenimiento.getById(id, (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if (results.length === 0) return res.status(404).json({ mensaje: 'Reporte no encontrado' });
            res.json(results[0]);
        });
    },

    // 3. Crear un nuevo reporte de falla
    create: (req, res) => {
        const { equipo_id, tipo, descripcion, tecnico_asignado } = req.body;

        // Validación de negocio (Punto 11 de la rúbrica)
        if (!equipo_id || !tipo || !descripcion) {
            return res.status(400).json({ mensaje: 'Campos obligatorios faltantes (equipo_id, tipo, descripcion)' });
        }

        const nuevoReporte = { equipo_id, tipo, descripcion, tecnico_asignado };

        Mantenimiento.create(nuevoReporte, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ mensaje: 'Reporte creado con éxito', id: result.insertId });
        });
    },

    // 4. Actualizar estado del mantenimiento
    update: (req, res) => {
        const { id } = req.params;
        const { estado } = req.body;

        if (!estado) return res.status(400).json({ mensaje: 'El nuevo estado es requerido' });

        Mantenimiento.update(id, { estado }, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Reporte no encontrado' });
            res.json({ mensaje: 'Estado actualizado correctamente' });
        });
    },

    // 5. Eliminar un reporte
    delete: (req, res) => {
        const { id } = req.params;
        Mantenimiento.delete(id, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Reporte no encontrado' });
            res.json({ mensaje: 'Reporte eliminado exitosamente' });
        });
    },


    // Endpoint Extra: Obtener mantenimiento por tipo (Preventivo o Correctivo)
    getByTipo: (req, res) => {
        const tipo = req.params.tipo || req.query.tipo;
        if (!tipo) return res.status(400).json({ mensaje: 'Tipo de mantenimiento requerido' });

        Mantenimiento.getByTipo(tipo, (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        });
    }
};

module.exports = mantenimientoCtrl;