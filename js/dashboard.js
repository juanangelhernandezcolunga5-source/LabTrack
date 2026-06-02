/**
 * dashboard.js — Lógica protegida para el Dashboard de LabTrack
 * Verifica sesión, carga datos desde /api/inicio y permite cerrar sesión.
 */

const API    = 'http://localhost:3000/api';
const token  = sessionStorage.getItem('token');
const nombre = sessionStorage.getItem('nombre');

// 1. Verificar sesión al cargar la página
// Si no hay token, redirigir al login inmediatamente
if (!token) {
    window.location.href = 'login.html';
}

// 2. Mostrar el nombre del usuario logueado en el sidebar
document.getElementById('nombreUsuario').textContent = nombre || 'Usuario';
document.getElementById('correoUsuario').textContent = 'Sesión Activa';

// 3. Cargar los datos de la página de inicio
function cargarInicio() {
    // Mostrar spinner inicialmente
    document.getElementById('spinner').style.display = 'block';
    document.getElementById('contenido').style.display = 'none';

    fetch(`${API}/inicio`, {
        headers: {
            'Authorization': `Bearer ${token}` // Enviar token en el header (Vital)
        }
    })
    .then(res => {
        // 4. Si el token expiró o es inválido, redirigir al login
        if (res.status === 401 || res.status === 403) {
            sessionStorage.clear();
            window.location.href = 'login.html';
            throw new Error('No autorizado');
        }
        return res.json();
    })
    .then(data => {
        if (!data) return;

        // 5. Ocultar spinner y mostrar contenido
        document.getElementById('spinner').style.display = 'none';
        document.getElementById('contenido').style.display = 'block';

        // 6. Actualizar las tarjetas de resumen operativo con datos reales
        if (data.resumen) {
            // Actualizar Préstamos Activos
            const prestamosEl = document.getElementById('prestamosActivos');
            if (prestamosEl) prestamosEl.textContent = data.resumen.prestamos_activos || '0';

            // Actualizar En Mantenimiento
            const mantEl = document.getElementById('mantenimiento');
            if (mantEl) mantEl.textContent = data.resumen.en_mantenimiento || '0';

            // (Opcional) Podemos actualizar 'devoluciones' y 'retrasos' si el backend nos los diera en un futuro.
            // Por ahora ponemos un valor estático para limpiar los hardcodeados del HTML original.
            const devolucionesEl = document.getElementById('devoluciones');
            if (devolucionesEl) devolucionesEl.textContent = '0';
            
            const retrasosEl = document.getElementById('retrasos');
            if (retrasosEl) retrasosEl.textContent = '0';
        }
    })
    .catch(err => {
        if (err.message !== 'No autorizado') {
            document.getElementById('spinner').style.display = 'none';
            mostrarAlerta('Error al cargar datos del servidor.', 'error');
        }
    });
}

// 7. Cerrar sesión
function cerrarSesion() {
    if (!confirm('¿Seguro que deseas cerrar sesión?')) return;
    sessionStorage.clear(); // Elimina token y nombre
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

// Iniciar la carga
cargarInicio();
