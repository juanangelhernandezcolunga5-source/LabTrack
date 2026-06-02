/**
 * inventario.js — Lógica para listar, filtrar y eliminar equipos
 * Se conecta a /api/inventario usando JWT.
 */

const API = 'http://localhost:3000/api/inventario';
const token = sessionStorage.getItem('token');
const nombre = sessionStorage.getItem('nombre');

let inventarioData = []; // Para filtros locales

// 1. Verificar sesión
if (!token) {
    window.location.href = 'login.html';
}

document.getElementById('nombreUsuario').textContent = nombre || 'Usuario';
document.getElementById('correoUsuario').textContent = 'Sesión Activa';

// 2. Redirigir a Crear Equipo
document.getElementById('btnAgregarEquipo').onclick = () => {
    window.location.href = 'inventario-registrar.html';
};

// 3. Cargar todos los equipos
function cargarInventario() {
    document.getElementById('spinner').style.display = 'block';
    document.getElementById('productGrid').style.display = 'none';

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
        inventarioData = data;
        document.getElementById('spinner').style.display = 'none';
        document.getElementById('productGrid').style.display = 'grid';
        renderizarEquipos(data);
    })
    .catch(err => {
        if (err.message !== 'No autorizado') {
            document.getElementById('spinner').style.display = 'none';
            mostrarAlerta('Error al cargar inventario.', 'error');
        }
    });
}

// 4. Renderizar tarjetas de equipos
function renderizarEquipos(equipos) {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = ''; // Limpiar

    if (equipos.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: var(--text-light);">No se encontraron equipos.</p>';
        return;
    }

    equipos.forEach(eq => {
        // Asignar iconos según categoría
        let icon = 'fa-box';
        if (eq.categoria === 'Redes') icon = 'fa-network-wired';
        else if (eq.categoria === 'Electrónica') icon = 'fa-microchip';
        else if (eq.categoria === 'Cómputo') icon = 'fa-laptop';

        // Asignar color de stock según estado
        let badgeClass = 'available';
        if (eq.estado === 'Agotado') badgeClass = 'out';
        else if (eq.estado === 'Stock Bajo') badgeClass = 'low';

        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image">
                <i class="fas ${icon}"></i>
            </div>
            <div class="product-info">
                <div class="product-category">${eq.categoria}</div>
                <h3 class="product-name">${eq.nombre}</h3>
                <div class="product-stock">
                    <span class="stock-badge ${badgeClass}">${eq.estado}</span>
                    <span>${eq.cantidad} unidades</span>
                </div>
                <div class="product-actions">
                    <button class="edit-btn" onclick="editarEquipo(${eq.id})">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="delete-btn" onclick="eliminarEquipo(${eq.id})">
                        <i class="fas fa-trash"></i> Baja
                    </button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// 5. Filtros y Búsqueda
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const estadoFilter = document.getElementById('estadoFilter');

function filtrar() {
    const term = searchInput.value.toLowerCase();
    const cat = categoryFilter.value;
    const est = estadoFilter.value;

    const filtrados = inventarioData.filter(eq => {
        const matchName = eq.nombre.toLowerCase().includes(term);
        const matchCat = cat === 'all' || eq.categoria === cat;
        // Para estado, el value en HTML es 'disponible', 'no_disponible'
        // pero la BD devuelve 'Disponible', 'Agotado', 'Stock Bajo'
        let matchEst = true;
        if (est === 'disponible') matchEst = (eq.estado === 'Disponible');
        else if (est === 'no_disponible') matchEst = (eq.estado === 'Agotado' || eq.estado === 'Stock Bajo');
        
        return matchName && matchCat && matchEst;
    });

    renderizarEquipos(filtrados);
}

searchInput.addEventListener('input', filtrar);
categoryFilter.addEventListener('change', filtrar);
estadoFilter.addEventListener('change', filtrar);

// 6. Eliminar (Baja)
function eliminarEquipo(id) {
    if (!confirm('¿Estás seguro de eliminar este equipo? Esta acción no se puede deshacer.')) return;

    fetch(`${API}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
        if (data.mensaje === 'Equipo eliminado exitosamente') {
            mostrarAlerta('Equipo dado de baja.', 'success');
            cargarInventario(); // Recargar lista
        } else {
            mostrarAlerta(data.mensaje || 'Error al eliminar', 'error');
        }
    })
    .catch(() => mostrarAlerta('Error de conexión', 'error'));
}

// 7. Redirigir a Editar
function editarEquipo(id) {
    window.location.href = `inventario-editar.html?id=${id}`;
}

// 8. Cerrar Sesión
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
    setTimeout(() => { document.getElementById('alerta').innerHTML = ''; }, 3000);
}

// Iniciar
cargarInventario();
