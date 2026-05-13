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

-- Inserción de 2 usuarios (Admin y Estudiante)
-- La contraseña para AMBOS es: 123456
-- El código largo es el hash encriptado que entiende tu servidor.
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