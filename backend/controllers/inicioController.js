const db = require('../config/db');

const getInicio = (req, res) => {
    // Consulta 1: total de usuarios registrados
    db.query('SELECT COUNT(*) AS total_usuarios FROM usuarios', (err, resUsuarios) => {
        if (err) return res.status(500).json({ error: err.message });

        // Consulta 2: total de equipos en inventario
        db.query('SELECT COUNT(*) AS total_inventario FROM inventario', (err, resInventario) => {
            if (err) return res.status(500).json({ error: err.message });

            // Consulta 3: préstamos activos y devoluciones y retrasos
            db.query("SELECT estado, COUNT(*) as count FROM prestamos GROUP BY estado", (err, resPrestamos) => {
                if (err) return res.status(500).json({ error: err.message });

                let prestamos_activos = 0;
                let devoluciones = 0;
                let retrasos = 0;
                
                resPrestamos.forEach(row => {
                    if (row.estado === 'Activo') prestamos_activos = row.count;
                    if (row.estado === 'Completado') devoluciones = row.count;
                    if (row.estado === 'Retrasado') retrasos = row.count;
                });

                // Consulta 4: Últimos 5 préstamos
                const queryRecientes = `
                    SELECT p.id, p.fecha_prestamo, p.estado, u.nombre as usuario, e.nombre as equipo 
                    FROM prestamos p
                    JOIN usuarios u ON p.usuario_id = u.id
                    JOIN inventario e ON p.equipo_id = e.id
                    ORDER BY p.fecha_prestamo DESC
                    LIMIT 5
                `;
                
                db.query(queryRecientes, (err, resRecientes) => {
                    if (err) return res.status(500).json({ error: err.message });

                    res.json({
                        mensaje: 'Bienvenido al sistema LabTrack',
                        fecha: new Date().toISOString(),
                        resumen: {
                            total_usuarios:     resUsuarios[0].total_usuarios,
                            total_inventario:   resInventario[0].total_inventario,
                            prestamos_activos:  prestamos_activos,
                            devoluciones:       devoluciones,
                            retrasos:           retrasos,
                            en_mantenimiento:   0 // El usuario borró esta tabla temporalmente
                        },
                        recientes: resRecientes
                    });
                });
            });
        });
    });
};

module.exports = { getInicio };