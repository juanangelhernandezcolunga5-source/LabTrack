/**
 * prestamos.js — Lógica para listar, filtrar y gestionar préstamos
 * Se conecta a /api/prestamos usando JWT.
 */

const API = '/api/prestamos';
const token = sessionStorage.getItem('token');
const nombre = sessionStorage.getItem('nombre');

let prestamosData = [];

// 1. Verificar sesión
if (!token) {
    window.location.href = 'login.html';
}

document.getElementById('nombreUsuario').textContent = nombre || 'Usuario';
document.getElementById('correoUsuario').textContent = 'Sesión Activa';

// Redirigir a crear préstamo (Disponible para admin y estudiante)
const btnNuevo = document.getElementById('btnNuevoPrestamo');
if (btnNuevo) {
    btnNuevo.onclick = () => {
        window.location.href = 'prestamos-registrar.html';
    };
}

// 2. Cargar datos
function cargarPrestamos() {
    document.getElementById('spinner').style.display = 'block';
    document.getElementById('contentHeader').style.display = 'none';
    const tbody = document.getElementById('prestamosTableBody');
    if (tbody) tbody.innerHTML = '';

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
        prestamosData = data;
        document.getElementById('spinner').style.display = 'none';
        document.getElementById('contentHeader').style.display = 'flex';
        renderizarTabla(data);
    })
    .catch(err => {
        if (err.message !== 'No autorizado') {
            document.getElementById('spinner').style.display = 'none';
            mostrarAlerta('Error al cargar préstamos.', 'error');
        }
    });
}

// 3. Renderizar tabla
function renderizarTabla(prestamos) {
    const tbody = document.getElementById('prestamosTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (prestamos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;">No se encontraron préstamos.</td></tr>';
        return;
    }

    prestamos.forEach(p => {
        // Formatear fechas
        const fechaPrestamo = p.fecha_prestamo ? new Date(p.fecha_prestamo).toLocaleDateString('es-MX') : 'N/A';
        const fechaDevolucion = p.fecha_devolucion ? new Date(p.fecha_devolucion).toLocaleDateString('es-MX') : 'N/A';

        // Estilos de estado
        let badgeClass = 'badge-success';
        let dotClass = 'active';
        if (p.estado === 'Completado') {
            badgeClass = 'badge-info';
            dotClass = 'completed';
        } else if (p.estado === 'Retrasado') {
            badgeClass = 'badge-danger';
            dotClass = 'overdue';
        }

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>#${p.id}</td>
            <td>${p.equipo || 'Equipo Desconocido'}</td>
            <td>${p.usuario || 'Usuario Desconocido'}</td>
            <td>N/A</td> <!-- El backend no trae matrícula por ahora -->
            <td>${fechaPrestamo}</td>
            <td>${fechaDevolucion}</td>
            <td class="status-cell">
                <span class="status-dot ${dotClass}"></span>
                <span class="badge ${badgeClass}">${p.estado}</span>
            </td>
            <td style="display: ${sessionStorage.getItem('rol') === 'estudiante' ? 'none' : 'table-cell'};">
                <div class="loan-actions">
                    <button class="return-btn" onclick="editarPrestamo(${p.id})">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="report-btn" onclick="eliminarPrestamo(${p.id})">
                        <i class="fas fa-trash"></i> Borrar
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// 4. Eliminar (Borrar)
function eliminarPrestamo(id) {
    if (!confirm('¿Seguro que deseas borrar este préstamo?')) return;

    fetch(`${API}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
        if (data.mensaje === 'Préstamo eliminado') {
            mostrarAlerta('Préstamo eliminado.', 'success');
            cargarPrestamos();
        } else {
            mostrarAlerta(data.mensaje || data.error, 'error');
        }
    })
    .catch(() => mostrarAlerta('Error de conexión', 'error'));
}

function editarPrestamo(id) {
    window.location.href = `prestamos-editar.html?id=${id}`;
}

// 5. Filtros locales
const searchInput = document.getElementById('searchInput');
const filterTabs = document.querySelectorAll('.filter-tab');
let estadoActual = 'all';

if (searchInput) {
    searchInput.addEventListener('input', aplicarFiltros);
}

filterTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
        filterTabs.forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        estadoActual = e.target.getAttribute('data-status');
        aplicarFiltros();
    });
});

function aplicarFiltros() {
    const term = searchInput ? searchInput.value.toLowerCase() : '';
    
    const filtrados = prestamosData.filter(p => {
        // Buscar por equipo o usuario
        const equipoMatch = p.equipo && p.equipo.toLowerCase().includes(term);
        const usuarioMatch = p.usuario && p.usuario.toLowerCase().includes(term);
        const matchBusqueda = equipoMatch || usuarioMatch;

        let matchEstado = true;
        if (estadoActual === 'activo') matchEstado = (p.estado === 'Activo');
        else if (estadoActual === 'retrasado') matchEstado = (p.estado === 'Retrasado');
        else if (estadoActual === 'completado') matchEstado = (p.estado === 'Completado');

        return matchBusqueda && matchEstado;
    });

    renderizarTabla(filtrados);
}

// Cerrar sesión y alertas
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

    const alertaDiv = document.getElementById('alerta');
    if (alertaDiv) {
        alertaDiv.innerHTML = `
            <div style="background: ${color}18; border: 1px solid ${color}; border-radius: 8px; padding: 10px 14px; margin-bottom: 16px; color: ${color}; font-size: 0.9rem; display: flex; align-items: center; gap: 8px;">
                <i class="fas ${icono}"></i><span>${mensaje}</span>
            </div>
        `;
        setTimeout(() => { alertaDiv.innerHTML = ''; }, 3000);
    }
}

// Iniciar
cargarPrestamos();
