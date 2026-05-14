/**
 * Controlador de Usuarios para LabTrack
 * Maneja las solicitudes HTTP relacionadas con la gestión de usuarios en el sistema de laboratorios.
 * Incluye validaciones de autenticación, encriptación de contraseñas y operaciones CRUD para usuarios.
 */

const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuarioModel');
const Auth = require('../models/authModel');

const usuarioCtrl = {
    // Recupera todos los usuarios del sistema LabTrack para administración
    getAll: (req, res) => {
        Usuario.getAll((err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        });
    },

    // Obtiene los detalles de un usuario específico por ID para consultas individuales
    getById: (req, res) => {
        const id = req.params.id;
        Usuario.getById(id, (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if (results.length === 0) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
            res.json(results[0]);
        });
    },

    // Registra un nuevo usuario en LabTrack, validando email único y encriptando contraseña
    create: (req, res) => {
        const { nombre, email, password, rol } = req.body;
        if (!nombre || !email || !password) {
            return res.status(400).json({ mensaje: 'Nombre, email y password son requeridos' });
        }

        Auth.findByEmail(email, (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if (results.length > 0) return res.status(400).json({ mensaje: 'Este email ya está registrado' });

            const passwordEncriptada = bcrypt.hashSync(password, 10);
            const nuevoUsuario = { nombre, email, password: passwordEncriptada, rol: rol || 'estudiante' };

            Usuario.create(nuevoUsuario, (err, result) => {
                if (err) return res.status(500).json({ error: err.message });
                res.status(201).json({ mensaje: 'Usuario creado correctamente', id: result.insertId });
            });
        });
    },

    // Actualiza la información de un usuario existente, validando cambios de email
    update: (req, res) => {
        const id = req.params.id;
        const { nombre, email, password, rol } = req.body;
        const datosActualizados = {};

        if (nombre) datosActualizados.nombre = nombre;
        if (email) datosActualizados.email = email;
        if (rol) datosActualizados.rol = rol;
        if (password) datosActualizados.password = bcrypt.hashSync(password, 10);

        if (nombre) datosActualizados.nombre = nombre;
        if (email) datosActualizados.email = email;
        if (rol) datosActualizados.rol = rol;
        if (password) datosActualizados.password = bcrypt.hashSync(password, 10);

        if (Object.keys(datosActualizados).length === 0) {
            return res.status(400).json({ mensaje: 'Debe enviar al menos un campo para actualizar' });
        }

        // Función auxiliar para verificar si el email ya está en uso por otro usuario
        const revisarEmail = (callback) => {
            if (!email) return callback();

            Auth.findByEmail(email, (err, results) => {
                if (err) return res.status(500).json({ error: err.message });
                if (results.length > 0 && results[0].id !== Number(id)) {
                    return res.status(400).json({ mensaje: 'El email ya está en uso por otro usuario' });
                }
                callback();
            });
        };

        revisarEmail(() => {
            Usuario.update(id, datosActualizados, (err, result) => {
                if (err) return res.status(500).json({ error: err.message });
                if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Usuario no encontrado para actualizar' });
                res.json({ mensaje: 'Usuario actualizado correctamente' });
            });
        });
    },

    // Elimina un usuario del sistema LabTrack, liberando recursos asociados
    delete: (req, res) => {
        const id = req.params.id;
        Usuario.delete(id, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Usuario no encontrado para eliminar' });
            res.json({ mensaje: 'Usuario eliminado correctamente' });
        });
    }
};

module.exports = usuarioCtrl;