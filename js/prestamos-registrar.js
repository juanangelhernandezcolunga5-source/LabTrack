/**
 * prestamos-registrar.js — Lógica para registrar un préstamo
 * Carga usuarios y equipos en select, luego hace POST /api/prestamos
 */

const API_PRESTAMOS   = 'http://localhost:3000/api/prestamos';
const API_USUARIOS    = 'http://localhost:3000/api/usuarios';
const API_INVENTARIO  = 'http://localhost:3000/api/inventario';

const token = sessionStorage.getItem('token');
const nombre = sessionStorage.getItem('nombre');

// 1. Verificar sesión
if (!token) {
    window.location.href = 'login.html';
}

document.getElementById('nombreUsuario').textContent = nombre || 'Usuario';
document.getElementById('correoUsuario').textContent = 'Sesión Activa';

// 2. Cargar listas (Usuarios y Equipos) simultáneamente
function cargarDatos() {
    const headers = { 'Authorization': `Bearer ${token}` };

    Promise.all([
        fetch(API_USUARIOS, { headers }).then(r => {
            if (r.status === 401 || r.status === 403) throw new Error('No autorizado');
            return r.json();
        }),
        fetch(API_INVENTARIO, { headers }).then(r => r.json())
    ])
    .then(([usuarios, equipos]) => {
        const selectUsuario = document.getElementById('selectUsuario');
        const selectEquipo  = document.getElementById('selectEquipo');

        // Llenar Usuarios
        usuarios.forEach(u => {
            const option = document.createElement('option');
            option.value = u.id;
            option.textContent = `${u.nombre} (${u.email})`;
            selectUsuario.appendChild(option);
        });

        // Llenar Equipos (Solo los disponibles, idealmente > 0 cantidad)
        equipos.forEach(e => {
            if (e.cantidad > 0) {
                const option = document.createElement('option');
                option.value = e.id;
                option.textContent = `${e.nombre} - Stock: ${e.cantidad} (${e.estado})`;
                selectEquipo.appendChild(option);
            }
        });

        // Ocultar spinner y mostrar formulario
        document.getElementById('spinner').style.display = 'none';
        document.getElementById('formContainer').style.display = 'block';
    })
    .catch(err => {
        if (err.message === 'No autorizado') {
            sessionStorage.clear();
            window.location.href = 'login.html';
        } else {
            document.getElementById('spinner').style.display = 'none';
            mostrarAlerta('Error al cargar datos del servidor.', 'error');
        }
    });
}

// 3. Registrar Préstamo (POST)
function registrarPrestamo() {
    const usuarioId = document.getElementById('selectUsuario').value;
    const equipoId  = document.getElementById('selectEquipo').value;
    const btnGuardar= document.getElementById('btnGuardar');

    if (!usuarioId || !equipoId) {
        mostrarAlerta('Debes seleccionar un usuario y un equipo.', 'warning');
        return;
    }

    btnGuardar.disabled = true;
    btnGuardar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';

    fetch(API_PRESTAMOS, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            usuario_id: usuarioId,
            equipo_id: equipoId
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.error || data.mensaje === 'Faltan datos obligatorios (usuario_id, equipo_id)') {
            mostrarAlerta(data.error || data.mensaje, 'error');
            btnGuardar.disabled = false;
            btnGuardar.innerHTML = '<i class="fas fa-hand-holding"></i> Confirmar Préstamo';
            return;
        }

        mostrarAlerta('Préstamo registrado exitosamente. Redirigiendo...', 'success');
        setTimeout(() => {
            window.location.href = 'prestamos.html';
        }, 1500);
    })
    .catch(() => {
        mostrarAlerta('Error de red al registrar el préstamo.', 'error');
        btnGuardar.disabled = false;
        btnGuardar.innerHTML = '<i class="fas fa-hand-holding"></i> Confirmar Préstamo';
    });
}

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

// Iniciar carga de catálogos
cargarDatos();
