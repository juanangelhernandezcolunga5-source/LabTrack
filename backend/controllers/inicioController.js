const db = require('../config/db');

const getInicio = (req, res) => {
    db.query('SELECT COUNT(*) AS total FROM usuarios', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        
        res.json({
            mensaje: "Bienvenido al sistema LabTrack",
            sistema: "Gestión de Laboratorios",
            total_usuarios: results[0].total,
            fecha: new Date().toISOString(),
            modulos: [ // <--- AGREGA ESTO
                "Usuarios",
                "Inventario",
                "Préstamos",
                "Mantenimiento",
                "Laboratorios"
            ]
        });
    });
};

module.exports = { getInicio };