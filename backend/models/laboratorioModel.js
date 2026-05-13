const db = require('../config/db');

const Laboratorio = {
    // 1. Obtener todos los laboratorios
    getAll: (cb) => {
        db.query('SELECT * FROM laboratorios', cb);
    },
    
    // 2. Obtener un laboratorio por su ID
    getById: (id, cb) => {
        db.query('SELECT * FROM laboratorios WHERE id = ?', [id], cb);
    },
    
    // 3. Crear un nuevo laboratorio
    create: (data, cb) => {
        db.query('INSERT INTO laboratorios SET ?', [data], cb);
    },
    
    // 4. Actualizar un laboratorio
    update: (id, data, cb) => {
        db.query('UPDATE laboratorios SET ? WHERE id = ?', [data, id], cb);
    },
    
    // 5. Eliminar un laboratorio
    delete: (id, cb) => {
        db.query('DELETE FROM laboratorios WHERE id = ?', [id], cb);
    },
    
    // Extra: Buscar laboratorios por encargado (para ver qué áreas maneja cada Ing.)
    getByEncargado: (encargado, cb) => {
        db.query('SELECT * FROM laboratorios WHERE encargado LIKE ?', [`%${encargado}%`], cb);
    }
};

module.exports = Laboratorio;