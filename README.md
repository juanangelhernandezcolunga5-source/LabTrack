# LabTrack Backend

## Integrantes
- Juan Angel Hernandez Colunga
- Miguel Angel Nuñez Torres

# LabTrack - API de Gestión de Laboratorios

Backend desarrollado en Node.js y Express para la gestión integral de recursos de laboratorio, control de inventario, registro de préstamos y seguimiento de mantenimiento.

## Tecnologías Utilizadas
* **Entorno:** Node.js
* **Framework:** Express.js
* **Base de Datos:** MySQL
* **Autenticación:** JSON Web Tokens (JWT)
* **Arquitectura:** MVC (Model-View-Controller)

---

## Cumplimiento de Rúbrica de Evaluación

Este proyecto fue desarrollado siguiendo estrictamente los lineamientos solicitados:

* **[Punto 9] Base de Datos:** Se incluyen los scripts SQL con tablas normalizadas, uso de llaves foráneas (ej. `prestamos` apuntando a `usuarios` e `inventario`) y la inserción de 5 registros de prueba coherentes por tabla.
* **[Punto 10] Modelos:** Cada modelo (Inventario, Prestamos, Mantenimiento, Laboratorios) cuenta con sus 5 funciones CRUD, implementando *Prepared Statements* (`?`) para prevenir inyecciones SQL.
* **[Punto 11] Controladores:** Lógica de negocio con validaciones estrictas (ej. no registrar un laboratorio sin nombre). Se manejan correctamente los códigos de estado HTTP (`200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`, `500 Internal Server Error`).
* **[Punto 12] Rutas:** Endpoints organizados y un endpoint *Extra* por cada módulo (búsquedas filtradas por estado, encargado, tipo, etc.).
* **[Punto 13] Documentación:** Las capturas de prueba de Postman (con JSON request/response y status codes) se encuentran en la carpeta `docs/capturas/`.

---

## Instalación y Configuración (Para el Equipo de Desarrollo)

Para clonar y correr este proyecto en tu entorno local, sigue estos pasos:

### 1. Clonar el repositorio
\`\`\`bash
git clone https://github.com/juanangelhernandezcolunga5-source/LabTrack.git
cd LabTrack
\`\`\`

### 2. Instalar dependencias
\`\`\`bash
npm install
\`\`\`

### 3. Configurar la Base de Datos
1. Abre MySQL Workbench.
2. Ejecuta los scripts SQL proporcionados para crear la base de datos `labtrack_db` y sus tablas.
3. Verifica que los datos de prueba de usuarios, inventario, préstamos, mantenimiento y laboratorios se hayan cargado.
4. (Si aplica) Configura tus credenciales de base de datos en el archivo `/config/db.js` o `.env`.

### 4. Ejecutar el Servidor
\`\`\`bash
# Modo producción
node server.js

# Modo desarrollo (si tienes nodemon instalado)
npm run dev
\`\`\`
El servidor iniciará en `http://localhost:3000` (o el puerto configurado).

---

## Módulos y Endpoints Principales

Todas las rutas están protegidas y requieren un **Bearer Token** obtenido en el login.

### Inventario (`/api/inventario`)
* `GET /` - Obtener todos los equipos.
* `POST /` - Registrar nuevo equipo.
* `GET /stock-bajo` - **[Extra]** Ver equipos con poco stock.

### Préstamos (`/api/prestamos`)
* `GET /` - Obtener historial de préstamos.
* `POST /` - Registrar un nuevo préstamo.
* `GET /retrasados` - **[Extra]** Ver préstamos fuera de tiempo.

### Mantenimiento (`/api/mantenimiento`)
* `GET /` - Ver todos los reportes.
* `PUT /:id` - Actualizar el estado de un reporte.
* `GET /preventivos` - **[Extra]** Filtrar por mantenimientos preventivos.

### Laboratorios (`/api/laboratorios`)
* `GET /` - Lista de laboratorios.
* `PUT /:id` - Cambiar encargado o estado.
* `GET /buscar/:nombre` - **[Extra]** Buscar laboratorios a cargo de un ingeniero específico.

---

## Flujo de Trabajo en Git (Colaboradores)
1. Antes de programar: `git pull origin main`
2. Hacer cambios y probar en Postman.
3. Guardar cambios: `git add .`
4. Documentar cambio: `git commit -m "feat: descripción de lo que hiciste"`
5. Subir al repositorio: `git push origin main`
