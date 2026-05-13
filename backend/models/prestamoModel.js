const db = require('../config/db');

const Prestamo = {
    // 1. Obtener todos los préstamos con nombres de usuario y equipo (JOIN)
    getAll: (callback) => {
        const sql = `
            SELECT p.*, u.nombre as usuario, e.nombre as equipo 
            FROM prestamos p 
            JOIN usuarios u ON p.usuario_id = u.id 
            JOIN inventario e ON p.equipo_id = e.id`;
        db.query(sql, callback);
    },

    // 2. Obtener un préstamo específico por su ID
    getById: (id, callback) => {
        db.query('SELECT * FROM prestamos WHERE id = ?', [id], callback);
    },

    // 3. Registrar un nuevo préstamo en la base de datos
    create: (data, callback) => {
        db.query('INSERT INTO prestamos SET ?', [data], callback);
    },

    // 4. Actualizar el estado de un préstamo (ej. de Activo a Completado)
    update: (id, estado, callback) => {
        db.query('UPDATE prestamos SET estado = ? WHERE id = ?', [estado, id], callback);
    },

    // 5. Eliminar un registro de préstamo
    delete: (id, callback) => {
        db.query('DELETE FROM prestamos WHERE id = ?', [id], callback);
    },

    // Endpoint Extra: Obtener solo préstamos con estado 'Retrasado'
    getRetrasados: (callback) => {
        db.query("SELECT * FROM prestamos WHERE estado = 'Retrasado'", callback);
    }
};

module.exports = Prestamo;