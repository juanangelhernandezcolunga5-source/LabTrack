CREATE DATABASE labtrack_db;
USE labtrack_db;
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'estudiante') DEFAULT 'estudiante',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inventario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    cantidad INT NOT NULL DEFAULT 0,
    estado VARCHAR(20) DEFAULT 'Disponible'
);

INSERT INTO inventario (nombre, categoria, cantidad, estado) VALUES
('Router Cisco 2900', 'Redes', 5, 'Disponible'),
('Switch 24 Puertos', 'Redes', 8, 'Disponible'),
('Arduino UNO', 'Electrónica',1, 'Stock Bajo'),
('Raspberry Pi 4', 'Cómputo', 3, 'Stock Bajo'),
('Multímetro Digital', 'Electrónica', 12, 'Disponible');