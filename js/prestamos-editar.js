/**
 * prestamos-editar.js — Lógica para actualizar el estado de un préstamo
 * Obtiene el ID de la URL y hace PUT /api/prestamos/:id
 */

const API = 'http://localhost:3000/api/prestamos';
const token = sessionStorage.getItem('token');
const nombre = sessionStorage.getItem('nombre');

// 1. Obtener ID de la URL
const urlParams = new URLSearchParams(window.location.search);
const prestamoId = urlParams.get('id');

if (!token) {
    window.location.href = 'login.html';
}

if (!prestamoId) {
    window.location.href = 'prestamos.html';
}

document.getElementById('nombreUsuario').textContent = nombre || 'Usuario';
document.getElementById('correoUsuario').textContent = 'Sesión Activa';

// 2. Cargar datos del préstamo
// Para tener los nombres de usuario y equipo sin modificar el backend, traemos la lista completa y filtramos
function cargarDatosPrestamo() {
    fetch(API, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => {
        if (res.status === 401 || res.status === 403) {
            sessionStorage.clear();
            window.location.href = 'login.html';
            throw new Error('No autorizado');
        }
        return res.json();
    })
    .then(data => {
        const prestamo = data.find(p => p.id == prestamoId);
        
        if (!prestamo) {
            mostrarAlerta('El préstamo no existe.', 'error');
            setTimeout(() => { window.location.href = 'prestamos.html'; }, 2000);
            return;
        }

        // Mostrar datos de solo lectura
        document.getElementById('txtEquipo').value = prestamo.equipo || `ID Equipo: ${prestamo.equipo_id}`;
        document.getElementById('txtUsuario').value = prestamo.usuario || `ID Usuario: ${prestamo.usuario_id}`;
        
        // Poner estado actual
        document.getElementById('selectEstado').value = prestamo.estado;

        // Ocultar spinner y mostrar form
        document.getElementById('spinner').style.display = 'none';
        document.getElementById('formContainer').style.display = 'block';
    })
    .catch(err => {
        if (err.message !== 'No autorizado') {
            document.getElementById('spinner').style.display = 'none';
            mostrarAlerta('Error al cargar datos.', 'error');
        }
    });
}

// 3. Guardar Edición (PUT)
function guardarEdicion() {
    const nuevoEstado = document.getElementById('selectEstado').value;
    const btnGuardar  = document.getElementById('btnGuardar');

    btnGuardar.disabled = true;
    btnGuardar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';

    fetch(`${API}/${prestamoId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ estado: nuevoEstado })
    })
    .then(res => res.json())
    .then(data => {
        if (data.error || data.mensaje === 'Préstamo no encontrado para actualizar') {
            mostrarAlerta(data.mensaje || data.error, 'error');
            btnGuardar.disabled = false;
            btnGuardar.innerHTML = '<i class="fas fa-save"></i> Guardar Estado';
            return;
        }

        mostrarAlerta('Estado del préstamo actualizado exitosamente. Redirigiendo...', 'success');
        setTimeout(() => {
            window.location.href = 'prestamos.html';
        }, 1500);
    })
    .catch(() => {
        mostrarAlerta('Error de red al actualizar.', 'error');
        btnGuardar.disabled = false;
        btnGuardar.innerHTML = '<i class="fas fa-save"></i> Guardar Estado';
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
cargarDatosPrestamo();
