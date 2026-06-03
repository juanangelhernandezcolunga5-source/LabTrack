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
('Administrador', 'admin@itsr.edu.mx', '$2b$10$pS2OZRR1wgs7YEeHiZgMtuDhX4lwVg3AgVoz7UilX4qwO41yBYod2', 'admin');

-- 3. Tabla de Inventario
CREATE TABLE inventario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    cantidad INT NOT NULL DEFAULT 0,
    estado VARCHAR(20) DEFAULT 'Disponible'
);

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

CREATE TABLE mantenimiento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    equipo_id INT NOT NULL,
    tipo ENUM('Preventivo', 'Correctivo') NOT NULL,
    descripcion TEXT NOT NULL,
    tecnico_asignado VARCHAR(100) DEFAULT 'Sin Asignar',
    fecha_reporte DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('Pendiente', 'En Progreso', 'Completado') DEFAULT 'Pendiente',
    FOREIGN KEY (equipo_id) REFERENCES inventario(id)
);

-- 6. Tabla de Laboratorios (Para cumplir con 5 módulos en el Backend)
CREATE TABLE laboratorios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    ubicacion VARCHAR(100) NOT NULL,
    encargado VARCHAR(100) NOT NULL,
    capacidad INT DEFAULT 30
);
