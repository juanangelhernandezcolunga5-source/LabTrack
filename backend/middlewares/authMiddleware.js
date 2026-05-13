const jwt = require('jsonwebtoken');
require('dotenv').config();

const verificarToken = (req, res, next) => {
    // 1. Leer el header Authorization
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ mensaje: 'Acceso denegado. No se envió un token.' });
    }

    // 2. Extraer el token
    const token = authHeader.split(' ')[1]; // El formato es 'Bearer TOKEN'
    
    // 3. Verificar el token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded; // Guardamos el usuario para usarlo después
        next();
    } catch (err) {
        return res.status(401).json({ mensaje: 'Token inválido o expirado' });
    }
};

module.exports = verificarToken;