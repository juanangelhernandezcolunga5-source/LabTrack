const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db');

// Inicializamos el servidor
const app = express();

// Middlewares necesarios
app.use(cors());
app.use(express.json()); // Permite recibir datos en formato JSON [cite: 184]

// Ruta de bienvenida (Requisito del proyecto) [cite: 186-188]
app.get('/api/inicio', (req, res) => {
    res.json({ 
        mensaje: "Bienvenido al sistema LabTrack", 
        fecha: new Date().toISOString() 
    });
});

// Iniciamos el puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});