/**
 * inventario-registrar.js — Lógica para dar de alta un equipo
 * Se conecta a POST /api/inventario usando JWT.
 */

const API = 'http://localhost:3000/api/inventario';
const token = sessionStorage.getItem('token');
const nombre = sessionStorage.getItem('nombre');

// 1. Verificar sesión
if (!token) {
    window.location.href = 'login.html';
}

document.getElementById('nombreUsuario').textContent = nombre || 'Usuario';
document.getElementById('correoUsuario').textContent = 'Sesión Activa';

// 2. Función para registrar equipo
function registrarEquipo() {
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

    // 3. Petición POST
    fetch(API, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // <- Token enviado
        },
        body: JSON.stringify({
            nombre: inputNombre,
            categoria: selectCategoria,
            cantidad: cantidadNum
        })
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
        if (data.error) {
            mostrarAlerta(data.error, 'error');
            btnGuardar.disabled = false;
            btnGuardar.innerHTML = '<i class="fas fa-save"></i> Guardar Equipo';
            return;
        }

        // Éxito
        mostrarAlerta('Equipo creado exitosamente. Redirigiendo...', 'success');
        setTimeout(() => {
            window.location.href = 'inventario.html';
        }, 1500);
    })
    .catch(err => {
        if (err.message !== 'No autorizado') {
            mostrarAlerta('Error al conectar con el servidor.', 'error');
            btnGuardar.disabled = false;
            btnGuardar.innerHTML = '<i class="fas fa-save"></i> Guardar Equipo';
        }
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
