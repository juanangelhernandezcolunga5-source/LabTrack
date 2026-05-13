const db = require('../config/db');

const Inventario = {
    // 1. Obtener todos los equipos (READ)
    getAll: (callback) => {
        db.query('SELECT * FROM inventario', callback);
    },

    // 2. Obtener un equipo por ID (READ ONE)
    getById: (id, callback) => {
        db.query('SELECT * FROM inventario WHERE id = ?', [id], callback);
    },

    // 3. Crear un nuevo equipo (CREATE)
    create: (data, callback) => {
        db.query('INSERT INTO inventario SET ?', [data], callback);
    },

    // 4. Actualizar un equipo (UPDATE)
    update: (id, data, callback) => {
        db.query('UPDATE inventario SET ? WHERE id = ?', [data, id], callback);
    },

    // 5. Eliminar un equipo (DELETE)
    delete: (id, callback) => {
        db.query('DELETE FROM inventario WHERE id = ?', [id], callback);
    }
};

module.exports = Inventario;