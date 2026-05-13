const db = require('../config/db');

const Auth = {
    // Busca un usuario por email para el login
    findByEmail: (email, callback) => {
        db.query('SELECT * FROM usuarios WHERE email = ?', [email], callback);
    },
    // Inserta un usuario nuevo al registrarse
    createUser: (data, callback) => {
        db.query('INSERT INTO usuarios SET ?', [data], callback);
    }
};

module.exports = Auth;