const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db');

// Inicializamos el servidor
const app = express();

// Middlewares necesarios
app.use(cors());
app.use(express.json()); // Permite recibir datos en formato JSON

// Servir el frontend (la carpeta principal que está un nivel arriba)
const path = require('path');
app.use(express.static(path.join(__dirname, '..', 'frontend')));

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Ruta protegida de inicio — requiere token JWT válido (Requisito del proyecto)
const verificarToken = require('./middlewares/authMiddleware');
const inicioController = require('./controllers/inicioController');
app.get('/api/inicio', verificarToken, inicioController.getInicio);


const inventarioRoutes = require('./routes/inventario');
app.use('/api/inventario', inventarioRoutes);

const prestamoRoutes = require('./routes/prestamo');
app.use('/api/prestamos', prestamoRoutes);

const mantenimiento = require('./routes/mantenimiento'); 

app.use('/api/mantenimiento', mantenimiento);

const laboratorio = require('./routes/laboratorio');
app.use('/api/laboratorios', laboratorio);

const usuarioRoutes = require('./routes/usuarios');
app.use('/api/usuarios', usuarioRoutes);

// Iniciamos el puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});