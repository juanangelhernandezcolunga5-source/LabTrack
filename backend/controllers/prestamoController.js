const Prestamo = require('../models/prestamoModel');

const prestamoCtrl = {
    getAll: (req, res) => {
        // Verificar el rol del usuario conectado
        if (req.usuario.rol === 'estudiante') {
            Prestamo.getByUsuarioId(req.usuario.id, (err, results) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json(results);
            });
        } else {
            Prestamo.getAll((err, results) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json(results);
            });
        }
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
        let { usuario_id, equipo_id } = req.body;
        
        // Si el usuario es estudiante o manda 'auto', forzamos que el usuario_id sea él mismo
        if (req.usuario.rol === 'estudiante' || usuario_id === 'auto') {
            usuario_id = req.usuario.id;
        }

        // Validación: Verificar que vengan los datos obligatorios
        if (!usuario_id || !equipo_id) {
            return res.status(400).json({ mensaje: 'Faltan datos obligatorios (usuario_id, equipo_id)' });
        }

        // Primero verificar stock del equipo
        const db = require('../config/db');
        db.query('SELECT cantidad FROM inventario WHERE id = ?', [equipo_id], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if (results.length === 0) return res.status(404).json({ mensaje: 'Equipo no encontrado' });
            
            if (results[0].cantidad <= 0) {
                return res.status(400).json({ mensaje: 'El equipo está agotado o no tiene stock.' });
            }

            // Crear el préstamo
            Prestamo.create({ usuario_id, equipo_id, estado: 'Activo' }, (err, result) => {
                if (err) return res.status(500).json({ error: err.message });
                
                // Restar 1 al inventario
                const nuevaCantidad = results[0].cantidad - 1;
                const nuevoEstado = nuevaCantidad > 0 ? (nuevaCantidad <= 3 ? 'Stock Bajo' : 'Disponible') : 'Agotado';
                
                db.query('UPDATE inventario SET cantidad = ?, estado = ? WHERE id = ?', [nuevaCantidad, nuevoEstado, equipo_id], (err) => {
                    if (err) console.error('Error al actualizar stock:', err);
                    res.status(201).json({ mensaje: 'Préstamo creado con éxito', id: result.insertId });
                });
            });
        });
    },

    update: (req, res) => {
        const { id } = req.params;
        const { estado } = req.body;
        const db = require('../config/db');
        
        // Obtener el estado actual del préstamo
        Prestamo.getById(id, (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if (results.length === 0) return res.status(404).json({ mensaje: 'Préstamo no encontrado' });
            
            const prestamo = results[0];
            const estadoAnterior = prestamo.estado;
            const equipo_id = prestamo.equipo_id;

            Prestamo.update(id, estado, (err, result) => {
                if (err) return res.status(500).json({ error: err.message });
                
                // Si cambia de Activo a Completado, sumar 1 al inventario
                if (estado === 'Completado' && estadoAnterior !== 'Completado') {
                    db.query('UPDATE inventario SET cantidad = cantidad + 1, estado = CASE WHEN cantidad + 1 > 3 THEN "Disponible" ELSE "Stock Bajo" END WHERE id = ?', [equipo_id], (err) => {
                        res.json({ mensaje: 'Estado del préstamo actualizado y stock restaurado' });
                    });
                } else {
                    res.json({ mensaje: 'Estado del préstamo actualizado' });
                }
            });
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