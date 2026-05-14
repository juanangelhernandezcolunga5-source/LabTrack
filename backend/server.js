const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db');

// Inicializamos el servidor
const app = express();

// Middlewares necesarios
app.use(cors());
app.use(express.json()); // Permite recibir datos en formato JSON


const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Ruta de bienvenida (Requisito del proyecto) 
const inicioController = require('./controllers/inicioController');
app.get('/api/inicio', inicioController.getInicio);

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