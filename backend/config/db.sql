-- 1. Borrar y crear la base de datos
DROP DATABASE IF EXISTS labtrack_db;
CREATE DATABASE labtrack_db;
USE labtrack_db;

-- 2. Tabla de Usuarios
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'estudiante') DEFAULT 'estudiante',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


INSERT INTO usuarios (nombre, email, password, rol) VALUES 
('Administrador', 'admin@itsr.edu.mx', '$2b$10$76/XqF9kYxK6.K7W0e0fZeU5r.j9V6V9v.n2/q/V/5G6I7J8K9L0M', 'admin'),
('Juan Estudiante', 'estudiante@itsr.edu.mx', '$2b$10$76/XqF9kYxK6.K7W0e0fZeU5r.j9V6V9v.n2/q/V/5G6I7J8K9L0M', 'estudiante');

-- 3. Tabla de Inventario (Punto 9 de la rúbrica: 5 registros)
CREATE TABLE inventario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    cantidad INT NOT NULL DEFAULT 0,
    estado VARCHAR(20) DEFAULT 'Disponible'
);

INSERT INTO inventario (nombre, categoria, cantidad, estado) VALUES
('Router Cisco 2900', 'Redes', 5, 'Disponible'),
('Switch 24 Puertos', 'Redes', 8, 'Disponible'),
('Arduino UNO', 'Electrónica', 1, 'Stock Bajo'),
('Raspberry Pi 4', 'Cómputo', 3, 'Stock Bajo'),
('Multímetro Digital', 'Electrónica', 12, 'Disponible');

-- 4. Tabla de Préstamos (Punto 9 de la rúbrica: 5 registros)
CREATE TABLE prestamos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    equipo_id INT NOT NULL,
    fecha_prestamo DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('Activo', 'Completado', 'Retrasado') DEFAULT 'Activo',
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (equipo_id) REFERENCES inventario(id)
);

-- Registramos préstamos para el usuario 2 (el estudiante)
INSERT INTO prestamos (usuario_id, equipo_id, estado) VALUES
(2, 1, 'Activo'), 
(2, 2, 'Activo'), 
(2, 3, 'Completado'), 
(2, 4, 'Retrasado'), 
(2, 5, 'Activo');


CREATE TABLE IF NOT EXISTS mantenimiento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    equipo_id INT NOT NULL,
    tipo ENUM('Preventivo', 'Correctivo') NOT NULL,
    descripcion TEXT NOT NULL,
    tecnico_asignado VARCHAR(100) DEFAULT 'Sin Asignar',
    fecha_reporte DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('Pendiente', 'En Progreso', 'Completado') DEFAULT 'Pendiente',
    FOREIGN KEY (equipo_id) REFERENCES inventario(id)
);


INSERT INTO mantenimiento (equipo_id, tipo, descripcion, tecnico_asignado, fecha_reporte, estado) VALUES
(5, 'Correctivo', 'Pantalla con líneas horizontales', 'Carlos Mendoza', '2026-04-18 10:00:00', 'En Progreso'),
(4, 'Preventivo', 'Limpieza interna y cambio de pasta térmica', 'Carlos Mendoza', '2026-04-20 11:30:00', 'Pendiente'),
(3, 'Correctivo', 'Batería no carga', 'Roberto Sánchez', '2026-04-15 09:15:00', 'Completado'),
(1, 'Preventivo', 'Actualización de firmware y revisión de configuración', 'Roberto Sánchez', '2026-04-22 14:00:00', 'Pendiente'),
(2, 'Correctivo', 'Revisión de puertos dañados', 'Sin Asignar', CURRENT_TIMESTAMP, 'Pendiente');



CREATE TABLE IF NOT EXISTS laboratorios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    ubicacion VARCHAR(50) NOT NULL,
    encargado VARCHAR(100) DEFAULT 'Sin Asignar',
    estado ENUM('Disponible', 'En Mantenimiento', 'Cerrado') DEFAULT 'Disponible'
);


INSERT INTO laboratorios (nombre, ubicacion, encargado, estado) VALUES
('Laboratorio Cisco', 'Edificio K', 'Ing. Tello', 'Disponible'),
('Centro de Cómputo', 'Edificio K', 'ING. Armando', 'Disponible'),
('Laboratorio de Robotica', 'Edificio K', 'Ing. Salome', 'En Mantenimiento'),
('Laboratorio industrial', 'Edificio C', 'Ing. Javier', 'Disponible'),
('Laboratorio de Quimica', 'Edificio F', 'Sin Asignar', 'Cerrado');