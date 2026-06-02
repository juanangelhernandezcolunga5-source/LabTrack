/**
 * inventario-editar.js — Lógica para editar un equipo existente
 * Obtiene el ID de la URL, carga los datos con GET /api/inventario/:id
 * y envía las actualizaciones con PUT /api/inventario/:id usando JWT.
 */

const API = 'http://localhost:3000/api/inventario';
const token = sessionStorage.getItem('token');
const nombre = sessionStorage.getItem('nombre');

// 1. Obtener ID de la URL (?id=...)
const urlParams = new URLSearchParams(window.location.search);
const equipoId = urlParams.get('id');

// 2. Verificar sesión y validar ID
if (!token) {
    window.location.href = 'login.html';
}

if (!equipoId) {
    // Si no hay ID en la URL, devolvemos al usuario al inventario
    window.location.href = 'inventario.html';
}

document.getElementById('nombreUsuario').textContent = nombre || 'Usuario';
document.getElementById('correoUsuario').textContent = 'Sesión Activa';

// 3. Cargar datos del equipo
function cargarDatosEquipo() {
    fetch(`${API}/${equipoId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => {
        if (res.status === 401 || res.status === 403) {
            sessionStorage.clear();
            window.location.href = 'login.html';
            throw new Error('No autorizado');
        }
        if (res.status === 404) {
            mostrarAlerta('El equipo no existe.', 'error');
            setTimeout(() => { window.location.href = 'inventario.html'; }, 2000);
            throw new Error('No encontrado');
        }
        return res.json();
    })
    .then(data => {
        if (data) {
            // Rellenar formulario
            document.getElementById('inputNombre').value = data.nombre;
            document.getElementById('selectCategoria').value = data.categoria;
            document.getElementById('inputCantidad').value = data.cantidad;

            // Mostrar formulario, ocultar spinner
            document.getElementById('spinner').style.display = 'none';
            document.getElementById('formContainer').style.display = 'block';
        }
    })
    .catch(err => {
        if (err.message !== 'No autorizado' && err.message !== 'No encontrado') {
            document.getElementById('spinner').style.display = 'none';
            mostrarAlerta('Error al cargar los datos del servidor.', 'error');
        }
    });
}

// 4. Guardar edición (PUT)
function guardarEdicion() {
    const inputNombre    = document.getElementById('inputNombre').value.trim();
    const selectCategoria= document.getElementById('selectCategoria').value;
    const inputCantidad  = document.getElementById('inputCantidad').value;
    const btnGuardar     = document.getElementById('btnGuardar');

    // Validación
    if (!inputNombre || !selectCategoria || inputCantidad === '') {
        mostrarAlerta('Por favor completa todos los campos.', 'warning');
        return;
    }

    const cantidadNum = parseInt(inputCantidad);
    if (cantidadNum < 0) {
        mostrarAlerta('La cantidad no puede ser negativa.', 'warning');
        return;
    }

    btnGuardar.disabled = true;
    btnGuardar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';

    // Petición PUT
    fetch(`${API}/${equipoId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            nombre: inputNombre,
            categoria: selectCategoria,
            cantidad: cantidadNum
            // El backend calcula automáticamente el 'estado' basándose en 'cantidad'
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.error || data.mensaje === 'Equipo no encontrado para actualizar') {
            mostrarAlerta(data.mensaje || data.error, 'error');
            btnGuardar.disabled = false;
            btnGuardar.innerHTML = '<i class="fas fa-save"></i> Guardar Cambios';
            return;
        }

        // Éxito
        mostrarAlerta('Equipo actualizado exitosamente. Redirigiendo...', 'success');
        setTimeout(() => {
            window.location.href = 'inventario.html';
        }, 1500);
    })
    .catch(() => {
        mostrarAlerta('Error al conectar con el servidor.', 'error');
        btnGuardar.disabled = false;
        btnGuardar.innerHTML = '<i class="fas fa-save"></i> Guardar Cambios';
    });
}

// Cerrar sesión
function cerrarSesion() {
    if (!confirm('¿Seguro que deseas cerrar sesión?')) return;
    sessionStorage.clear();
    window.location.href = 'login.html';
}

function mostrarAlerta(mensaje, tipo) {
    const colores = { success: 'var(--primary-green)', error: 'var(--danger)', warning: 'var(--warning)' };
    const iconos = { success: 'fa-check-circle', error: 'fa-exclamation-circle', warning: 'fa-exclamation-triangle' };
    
    const color = colores[tipo] || colores.error;
    const icono = iconos[tipo]  || iconos.error;

    document.getElementById('alerta').innerHTML = `
        <div style="background: ${color}18; border: 1px solid ${color}; border-radius: 8px; padding: 10px 14px; margin-bottom: 16px; color: ${color}; font-size: 0.9rem; display: flex; align-items: center; gap: 8px;">
            <i class="fas ${icono}"></i><span>${mensaje}</span>
        </div>
    `;
}

// Iniciar carga
cargarDatosEquipo();
