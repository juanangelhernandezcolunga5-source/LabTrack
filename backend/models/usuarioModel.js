/**
 * Modelo de Usuario para LabTrack
 * Gestiona las operaciones de base de datos relacionadas con los usuarios del sistema de gestión de laboratorios.
 * Incluye funcionalidades para consultar, crear, actualizar y eliminar usuarios registrados en la plataforma.
 */

const db = require('../config/db');

const Usuario = {
    // Obtiene todos los usuarios registrados en LabTrack, excluyendo información sensible como contraseñas
    getAll: (callback) => {
        db.query('SELECT id, nombre, email, rol, fecha_registro FROM usuarios', callback);
    },

    // Busca un usuario específico por su ID para operaciones de consulta individual
    getById: (id, callback) => {
        db.query('SELECT id, nombre, email, rol, fecha_registro FROM usuarios WHERE id = ?', [id], callback);
    },

    // Crea un nuevo usuario en el sistema LabTrack con los datos proporcionados
    create: (data, callback) => {
        db.query('INSERT INTO usuarios SET ?', [data], callback);
    },

    // Actualiza la información de un usuario existente identificado por su ID
    update: (id, data, callback) => {
        db.query('UPDATE usuarios SET ? WHERE id = ?', [data, id], callback);
    },

    // Elimina permanentemente un usuario del sistema LabTrack por su ID
    delete: (id, callback) => {
        db.query('DELETE FROM usuarios WHERE id = ?', [id], callback);
    }
};

module.exports = Usuario;