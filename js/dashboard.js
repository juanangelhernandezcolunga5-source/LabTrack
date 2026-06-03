/**
 * dashboard.js — Lógica protegida para el Dashboard de LabTrack
 * Verifica sesión, carga datos desde /api/inicio y permite cerrar sesión.
 */

const API    = '/api';
const token  = sessionStorage.getItem('token');
const nombre = sessionStorage.getItem('nombre');

// 1. Verificar sesión al cargar la página
// Si no hay token, o el rol no es admin, redirigir
if (!token || sessionStorage.getItem('rol') !== 'admin') {
    if (!token) {
        window.location.href = 'login.html';
    } else {
        window.location.href = 'inventario.html';
    }
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

            // Actualizar devoluciones y retrasos
            const devolucionesEl = document.getElementById('devoluciones');
            if (devolucionesEl) devolucionesEl.textContent = data.resumen.devoluciones || '0';
            
            const retrasosEl = document.getElementById('retrasos');
            if (retrasosEl) retrasosEl.textContent = data.resumen.retrasos || '0';
        }

        // 7. Renderizar tabla de actividad reciente
        if (data.recientes) {
            renderizarActividadReciente(data.recientes);
        }
    })
    .catch(err => {
        if (err.message !== 'No autorizado') {
            document.getElementById('spinner').style.display = 'none';
            mostrarAlerta('Error al cargar datos del servidor.', 'error');
        }
    });
}

// 7. Renderizar actividad reciente
function renderizarActividadReciente(recientes) {
    const tbody = document.querySelector('.recent-activity tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    if (recientes.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No hay actividad reciente</td></tr>';
        return;
    }

    recientes.forEach(loan => {
        let badgeClass = 'badge-success';
        if (loan.estado === 'Completado') badgeClass = 'badge-info';
        else if (loan.estado === 'Retrasado') badgeClass = 'badge-danger';
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>#${loan.id}</td>
            <td>${loan.equipo}</td>
            <td>${loan.usuario}</td>
            <td>${new Date(loan.fecha_prestamo).toLocaleDateString('es-MX')}</td>
            <td><span class="badge ${badgeClass}">${loan.estado}</span></td>
        `;
        tbody.appendChild(tr);
    });
}

// 8. Botones rápidos
document.addEventListener('DOMContentLoaded', () => {
    const btnPrestamo = document.querySelector('button[data-action="nuevo-prestamo"]');
    if (btnPrestamo) btnPrestamo.onclick = () => window.location.href = 'prestamos-registrar.html';
    
    const btnEquipo = document.querySelector('button[data-action="agregar-equipo"]');
    if (btnEquipo) btnEquipo.onclick = () => window.location.href = 'inventario-registrar.html';
});

// 9. Cerrar sesión
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
