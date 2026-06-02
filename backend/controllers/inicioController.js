const db = require('../config/db');

const getInicio = (req, res) => {
    // Consulta 1: total de usuarios registrados
    db.query('SELECT COUNT(*) AS total_usuarios FROM usuarios', (err, resUsuarios) => {
        if (err) return res.status(500).json({ error: err.message });

        // Consulta 2: total de equipos en inventario
        db.query('SELECT COUNT(*) AS total_inventario FROM inventario', (err, resInventario) => {
            if (err) return res.status(500).json({ error: err.message });

            // Consulta 3: préstamos activos
            db.query("SELECT COUNT(*) AS prestamos_activos FROM prestamos WHERE estado = 'activo'", (err, resPrestamos) => {
                if (err) return res.status(500).json({ error: err.message });

                // Consulta 4: equipos en mantenimiento
                db.query("SELECT COUNT(*) AS en_mantenimiento FROM mantenimiento WHERE estado = 'pendiente'", (err, resMant) => {
                    if (err) return res.status(500).json({ error: err.message });

                    res.json({
                        mensaje: 'Bienvenido al sistema LabTrack',
                        fecha: new Date().toISOString(),
                        modulos: [
                            'inventario',
                            'prestamos',
                            'mantenimiento',
                            'laboratorios',
                            'usuarios'
                        ],
                        resumen: {
                            total_usuarios:     resUsuarios[0].total_usuarios,
                            total_inventario:   resInventario[0].total_inventario,
                            prestamos_activos:  resPrestamos[0].prestamos_activos,
                            en_mantenimiento:   resMant[0].en_mantenimiento
                        }
                    });
                });
            });
        });
    });
};

module.exports = { getInicio };