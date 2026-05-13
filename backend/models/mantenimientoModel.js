const db = require('../config/db');

const Mantenimiento = {
    // JOIN para traer el nombre del equipo
    getAll: (cb) => db.query('SELECT m.*, e.nombre as equipo FROM mantenimiento m JOIN inventario e ON m.equipo_id = e.id', cb),
    getById: (id, cb) => db.query('SELECT * FROM mantenimiento WHERE id = ?', [id], cb),
    create: (data, cb) => db.query('INSERT INTO mantenimiento SET ?', [data], cb),
    update: (id, data, cb) => db.query('UPDATE mantenimiento SET ? WHERE id = ?', [data, id], cb),
    delete: (id, cb) => db.query('DELETE FROM mantenimiento WHERE id = ?', [id], cb),
    getByTipo: (tipo, cb) => db.query('SELECT * FROM mantenimiento WHERE tipo = ?', [tipo], cb)
};
module.exports = Mantenimiento;
