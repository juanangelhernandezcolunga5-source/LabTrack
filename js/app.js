/* ========================================
   LABTRACK - JavaScript
   Funcionalidad e Interactividad
   ======================================== */

// ========================================
// VARIABLES GLOBALES Y DATOS
// ========================================

// Datos iniciales - Administradores predefinidos
const defaultAdmins = [
    { id: 1, nombre: "Administrador Principal", correo: "admin@itsr.edu.mx", password: "admin123", rol: "admin" },
    { id: 2, nombre: "Saul Cruz Diaz", correo: "saul.cruz@itsr.edu.mx", password: "director123", rol: "admin" }
];

// Cargar datos del localStorage o usar datos por defecto
function getUsuarios() {
    const stored = localStorage.getItem('labtrack_usuarios');
    if (stored) {
        return JSON.parse(stored);
    }
    // Inicializar con administradores por defecto
    const usuarios = [...defaultAdmins];
    localStorage.setItem('labtrack_usuarios', JSON.stringify(usuarios));
    return usuarios;
}

function saveUsuarios(usuarios) {
    localStorage.setItem('labtrack_usuarios', JSON.stringify(usuarios));
}

// Datos de equipos
function getEquipos() {
    const stored = localStorage.getItem('labtrack_equipos');
    if (stored) {
        return JSON.parse(stored);
    }
    const equipos = [
        { id: 1, nombre: "Router Cisco 2900", categoria: "Redes", stock: 5, descripcion: "Router empresarial de alta velocidad", estado: "disponible" },
        { id: 2, nombre: "Switch 24 Puertos", categoria: "Redes", stock: 8, descripcion: "Switch gestionable 10/100/1000", estado: "disponible" },
        { id: 3, nombre: "Arduino UNO", categoria: "Electrónica", stock: 15, descripcion: "Placa de desarrollo microcontrolador", estado: "disponible" },
        { id: 4, nombre: "Raspberry Pi 4", categoria: "Cómputo", stock: 3, descripcion: "Computadora de placa única 8GB RAM", estado: "disponible" },
        { id: 5, nombre: "Multímetro Digital", categoria: "Electrónica", stock: 12, descripcion: "Multímetro profesional con auto rango", estado: "disponible" },
        { id: 6, nombre: "Cable Ethernet Cat6", categoria: "Redes", stock: 50, descripcion: "Cable de red 1 metro", estado: "disponible" },
        { id: 7, nombre: "Laptop Dell Inspiron", categoria: "Cómputo", stock: 2, descripcion: "Laptop 15.6\" i5 8GB RAM", estado: "disponible" },
        { id: 8, nombre: "Osciloscopio Digital", categoria: "Electrónica", stock: 0, descripcion: "Osciloscopio 2 canales 20MHz", estado: "no_disponible" }
    ];
    localStorage.setItem('labtrack_equipos', JSON.stringify(equipos));
    return equipos;
}

function saveEquipos(equipos) {
    localStorage.setItem('labtrack_equipos', JSON.stringify(equipos));
}

// Datos de préstamos
function getPrestamos() {
    const stored = localStorage.getItem('labtrack_prestamos');
    if (stored) {
        return JSON.parse(stored);
    }
    return [];
}

function savePrestamos(prestamos) {
    localStorage.setItem('labtrack_prestamos', JSON.stringify(prestamos));
}

// Datos de mantenimiento
function getMantenimiento() {
    const stored = localStorage.getItem('labtrack_mantenimiento');
    if (stored) {
        return JSON.parse(stored);
    }
    return [];
}

function saveMantenimiento(mantenimiento) {
    localStorage.setItem('labtrack_mantenimiento', JSON.stringify(mantenimiento));
}

// Sesión actual
function getCurrentUser() {
    const stored = localStorage.getItem('labtrack_currentUser');
    if (stored) {
        return JSON.parse(stored);
    }
    return null;
}

function setCurrentUser(user) {
    if (user) {
        localStorage.setItem('labtrack_currentUser', JSON.stringify(user));
    } else {
        localStorage.removeItem('labtrack_currentUser');
    }
}

function logout() {
    setCurrentUser(null);
    window.location.href = 'login.html';
}

// ========================================
// INICIALIZACIÓN
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

function initApp() {
    // Detectar qué página estamos
    const path = window.location.pathname;
    const page = path.split('/').pop().replace('.html', '') || 'index';
    
    // Verificar autenticación en páginas protegidas
    const protectedPages = ['dashboard', 'inventario', 'prestamos', 'mantenimiento', 'catalogo', 'configuracion', 'configuracion-admin', 'configuracion-estudiante', 'mis-prestamos'];
    const publicPages = ['index', 'registro', 'login', ''];
    
    const currentUser = getCurrentUser();
    
    // Si es página protegida y no hay sesión, redirigir a login
    if (protectedPages.includes(page) && !currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    // Si es página pública y ya hay sesión, redirigir según rol
    if (publicPages.includes(page) && currentUser) {
        if (currentUser.rol === 'admin') {
            window.location.href = 'dashboard.html';
        } else {
            window.location.href = 'catalogo.html';
        }
        return;
    }
    
    // Inicializar componentes según la página
    switch(page) {
        case 'index':
        case '':
            initLandingPage();
            break;
        case 'registro':
            initRegistroPage();
            break;
        case 'login':
            initLoginPage();
            break;
        case 'dashboard':
            if (currentUser?.rol !== 'admin') { window.location.href = 'login.html'; return; }
            initDashboardPage();
            break;
        case 'inventario':
            if (currentUser?.rol !== 'admin') { window.location.href = 'login.html'; return; }
            initInventarioPage();
            break;
        case 'prestamos':
            if (currentUser?.rol !== 'admin') { window.location.href = 'login.html'; return; }
            initPrestamosPage();
            break;
        case 'catalogo':
            if (currentUser?.rol === 'admin') { window.location.href = 'dashboard.html'; return; }
            initCatalogoPage();
            break;
        case 'mis-prestamos':
            if (currentUser?.rol === 'admin') { window.location.href = 'dashboard.html'; return; }
            initMisPrestamosPage();
            break;
        case 'mantenimiento':
            if (currentUser?.rol !== 'admin') { window.location.href = 'login.html'; return; }
            initMantenimientoPage();
            break;
        case 'configuracion':
        case 'configuracion-admin':
            if (currentUser?.rol !== 'admin') { window.location.href = 'login.html'; return; }
            initConfiguracionAdminPage();
            break;
        case 'configuracion-estudiante':
            if (currentUser?.rol !== 'estudiante') { window.location.href = 'login.html'; return; }
            initConfiguracionEstudiantePage();
            break;
    }

    // Inicializar componentes comunes
    initCommonComponents();
}

// ========================================
// COMPONENTES COMUNES
// ========================================

function initCommonComponents() {
    // Header scroll effect
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Actualizar enlaces de cerrar sesión
    const logoutLinks = document.querySelectorAll('a[href="login.html"]');
    logoutLinks.forEach(link => {
        if (link.textContent.includes('Cerrar Sesión') || link.querySelector('.menu-item-text')?.textContent === 'Cerrar Sesión') {
            link.href = '#';
            link.onclick = function(e) {
                e.preventDefault();
                logout();
                return false;
            };
        }
    });

    // Animaciones de entrada
    animateOnScroll();
}

function animateOnScroll() {
    const elements = document.querySelectorAll('.card, .feature-card, .stat-card, .product-card, .catalog-product-card, .maintenance-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ========================================
// LANDING PAGE (INDEX)
// ========================================

function initLandingPage() {
    // Animación del hero
    const heroTitle = document.querySelector('.hero-text h1');
    if (heroTitle) {
        heroTitle.style.opacity = '0';
        heroTitle.style.transform = 'translateY(30px)';
        setTimeout(() => {
            heroTitle.style.transition = 'all 0.8s ease';
            heroTitle.style.opacity = '1';
            heroTitle.style.transform = 'translateY(0)';
        }, 100);
    }

    // Contador animado para estadísticas
    animateCounters();
}

function animateCounters() {
    const counters = document.querySelectorAll('.stat-item h3');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                updateCounter();
                observer.disconnect();
            }
        });
        
        observer.observe(counter);
    });
}

// ========================================
// PÁGINA DE REGISTRO
// ========================================

function initRegistroPage() {
    const form = document.getElementById('registroForm');
    if (!form) return;

    // Validación en tiempo real
    const inputs = form.querySelectorAll('.form-input');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateInput(input));
        input.addEventListener('input', () => clearError(input));
    });

    // Envío del formulario
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateRegistroForm()) {
            registrarUsuario();
        }
    });
}

function validateInput(input) {
    const value = input.value.trim();
    const id = input.id;
    let isValid = true;
    let errorMessage = '';

    switch(id) {
        case 'nombre':
            if (value.length < 3) {
                isValid = false;
                errorMessage = 'El nombre debe tener al menos 3 caracteres';
            }
            break;
        case 'matricula':
            if (!/^\d{8}$/.test(value)) {
                isValid = false;
                errorMessage = 'La matrícula debe tener 8 dígitos';
            }
            break;
        case 'correo':
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                isValid = false;
                errorMessage = 'Ingresa un correo electrónico válido';
            }
            break;
        case 'password':
            if (value.length < 6) {
                isValid = false;
                errorMessage = 'La contraseña debe tener al menos 6 caracteres';
            }
            break;
    }

    if (!isValid) {
        showInputError(input, errorMessage);
    } else {
        clearError(input);
    }

    return isValid;
}

function showInputError(input, message) {
    input.classList.add('error');
    const formGroup = input.closest('.form-group');
    let errorEl = formGroup.querySelector('.form-error');
    
    if (!errorEl) {
        errorEl = document.createElement('div');
        errorEl.className = 'form-error';
        formGroup.appendChild(errorEl);
    }
    errorEl.textContent = message;
}

function clearError(input) {
    input.classList.remove('error');
    const formGroup = input.closest('.form-group');
    const errorEl = formGroup.querySelector('.form-error');
    if (errorEl) {
        errorEl.remove();
    }
}

function validateRegistroForm() {
    const form = document.getElementById('registroForm');
    const inputs = form.querySelectorAll('.form-input');
    let isValid = true;

    inputs.forEach(input => {
        if (!validateInput(input)) {
            isValid = false;
        }
    });

    // Validar términos
    const terminos = document.getElementById('terminos');
    if (!terminos.checked) {
        showAlert('warning', 'Debes aceptar los términos y condiciones');
        isValid = false;
    }

    return isValid;
}

function registrarUsuario() {
    const nombre = document.getElementById('nombre').value.trim();
    const matricula = document.getElementById('matricula').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const password = document.getElementById('password').value;

    // Verificar si el correo ya existe
    const usuarios = getUsuarios();
    if (usuarios.some(u => u.correo === correo)) {
        showAlert('danger', 'El correo electrónico ya está registrado');
        return;
    }

    // Verificar si la matrícula ya existe
    if (usuarios.some(u => u.matricula === matricula)) {
        showAlert('danger', 'La matrícula ya está registrada');
        return;
    }

    // Crear nuevo usuario
    const nuevoUsuario = {
        id: Date.now(),
        nombre: nombre,
        matricula: matricula,
        correo: correo,
        password: password,
        rol: 'estudiante'
    };

    usuarios.push(nuevoUsuario);
    saveUsuarios(usuarios);

    showAlert('success', '¡Cuenta creada exitosamente! Redirigiendo...');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 2000);
}

// ========================================
// PÁGINA DE LOGIN
// ========================================

function initLoginPage() {
    const form = document.getElementById('loginForm');
    if (!form) return;

    // Tabs para tipo de usuario
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });

    // Envío
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const correo = document.getElementById('correo').value.trim();
        const password = document.getElementById('password').value;
        const tipoUsuario = document.querySelector('.tab-btn.active').dataset.type;

        if (!correo || !password) {
            showAlert('danger', 'Por favor completa todos los campos');
            return;
        }

        // Buscar usuario
        const usuarios = getUsuarios();
        const usuario = usuarios.find(u => u.correo === correo && u.password === password);

        if (!usuario) {
            showAlert('danger', 'Credenciales incorrectas. Verifica tu correo y contraseña.');
            return;
        }

        // Verificar que el tipo de usuario coincida
        if (tipoUsuario === 'admin' && usuario.rol !== 'admin') {
            showAlert('danger', 'Esta cuenta no es de administrador');
            return;
        }

        if (tipoUsuario === 'estudiante' && usuario.rol !== 'estudiante') {
            showAlert('danger', 'Esta cuenta no es de estudiante');
            return;
        }

        // Iniciar sesión
        setCurrentUser(usuario);
        
        if (usuario.rol === 'admin') {
            showAlert('success', '¡Bienvenido Administrador!');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        } else {
            showAlert('success', '¡Bienvenido ' + usuario.nombre + '!');
            setTimeout(() => {
                window.location.href = 'catalogo.html';
            }, 1500);
        }
    });
}

// ========================================
// DASHBOARD ADMIN
// ========================================

function initDashboardPage() {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.rol !== 'admin') {
        window.location.href = 'login.html';
        return;
    }

    // Actualizar nombre en sidebar
    const userNameEl = document.querySelector('.sidebar-user .user-info h4');
    const userEmailEl = document.querySelector('.sidebar-user .user-info p');
    if (userNameEl) userNameEl.textContent = currentUser.nombre;
    if (userEmailEl) userEmailEl.textContent = currentUser.correo;

    loadDashboardStats();
    loadRecentActivity();

    // Botones de acción rápida
    const quickActions = document.querySelectorAll('.quick-action-btn');
    quickActions.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            handleQuickAction(action);
        });
    });

    // Exportar reportes
    const exportBtn = document.querySelector('.export-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportReport);
    }
}

function loadDashboardStats() {
    const prestamos = getPrestamos();
    const equipos = getEquipos();
    const mantenimiento = getMantenimiento();

    const prestamosActivos = prestamos.filter(p => p.estado === 'activo').length;
    const devoluciones = prestamos.filter(p => p.estado === 'completado').length;
    const equiposMantenimiento = mantenimiento.filter(m => m.estado !== 'completado').length;
    const retrasos = prestamos.filter(p => p.estado === 'retrasado').length;

    const prestamosActivosEl = document.getElementById('prestamosActivos');
    const devolucionesEl = document.getElementById('devoluciones');
    const mantenimientoEl = document.getElementById('mantenimiento');
    const retrasosEl = document.getElementById('retrasos');

    if (prestamosActivosEl) prestamosActivosEl.textContent = prestamosActivos;
    if (devolucionesEl) devolucionesEl.textContent = devoluciones;
    if (mantenimientoEl) mantenimientoEl.textContent = equiposMantenimiento;
    if (retrasosEl) retrasosEl.textContent = retrasos;
}

function loadRecentActivity() {
    const tableBody = document.querySelector('.recent-activity tbody');
    if (!tableBody) return;

    const prestamos = getPrestamos();
    const recentLoans = prestamos.slice(-5).reverse();

    if (recentLoans.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--text-light);">No hay actividad reciente</td></tr>';
        return;
    }

    tableBody.innerHTML = recentLoans.map(loan => `
        <tr>
            <td>#${loan.id}</td>
            <td>${loan.equipo}</td>
            <td>${loan.usuario}</td>
            <td>${formatDate(loan.fecha)}</td>
            <td>
                <span class="badge badge-${getStatusClass(loan.estado)}">
                    ${loan.estado}
                </span>
            </td>
        </tr>
    `).join('');
}

function getStatusClass(status) {
    const classes = {
        'activo': 'success',
        'completado': 'info',
        'retrasado': 'danger',
        'pendiente': 'warning'
    };
    return classes[status] || 'info';
}

function handleQuickAction(action) {
    switch(action) {
        case 'nuevo-prestamo':
            window.location.href = 'prestamos.html';
            break;
        case 'agregar-equipo':
            window.location.href = 'inventario.html';
            break;
        case 'reporte-falla':
            window.location.href = 'mantenimiento.html';
            break;
    }
}

function exportReport() {
    showAlert('info', 'Generando reporte...');
    setTimeout(() => {
        showAlert('success', 'Reporte exportado exitosamente');
    }, 1500);
}

// ========================================
// GESTIÓN DE INVENTARIO
// ========================================

function initInventarioPage() {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.rol !== 'admin') {
        window.location.href = 'login.html';
        return;
    }

    // Actualizar nombre en sidebar
    const userNameEl = document.querySelector('.sidebar-user .user-info h4');
    const userEmailEl = document.querySelector('.sidebar-user .user-info p');
    if (userNameEl) userNameEl.textContent = currentUser.nombre;
    if (userEmailEl) userEmailEl.textContent = currentUser.correo;

    loadInventory();
    
    // Búsqueda
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', filterInventory);
    }

    // Filtros
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterInventory);
    }

    // Filtro de estado
    const estadoFilter = document.getElementById('estadoFilter');
    if (estadoFilter) {
        estadoFilter.addEventListener('change', filterInventory);
    }

    // Agregar equipo
    const addBtn = document.querySelector('.add-btn');
    if (addBtn) {
        addBtn.addEventListener('click', showAddEquipmentModal);
    }
}

function loadInventory() {
    const grid = document.querySelector('.product-grid');
    if (!grid) return;

    const equipos = getEquipos();

    grid.innerHTML = equipos.map(equipo => `
        <div class="product-card" data-category="${equipo.categoria}" data-estado="${equipo.estado}">
            <div class="product-image">
                <i class="fas fa-${getEquipmentIcon(equipo.categoria)}"></i>
            </div>
            <div class="product-info">
                <div class="product-category">${equipo.categoria}</div>
                <h3 class="product-name">${equipo.nombre}</h3>
                <div class="product-stock">
                    <span class="stock-badge ${getStockClass(equipo.stock)}">
                        ${getStockText(equipo.stock)}
                    </span>
                    <span>${equipo.stock} unidades</span>
                </div>
                <div class="product-actions">
                    <button class="edit-btn" onclick="editEquipment(${equipo.id})">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="delete-btn" onclick="deleteEquipment(${equipo.id})">
                        <i class="fas fa-trash"></i> Baja
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function getEquipmentIcon(categoria) {
    const icons = {
        'Redes': 'network-wired',
        'Electrónica': 'microchip',
        'Cómputo': 'laptop'
    };
    return icons[categoria] || 'box';
}

function getStockClass(stock) {
    if (stock === 0) return 'out';
    if (stock <= 3) return 'low';
    return 'available';
}

function getStockText(stock) {
    if (stock === 0) return 'Agotado';
    if (stock <= 3) return 'Stock Bajo';
    return 'Disponible';
}

function filterInventory() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const category = document.getElementById('categoryFilter')?.value || 'all';
    const estado = document.getElementById('estadoFilter')?.value || 'all';
    
    const cards = document.querySelectorAll('.product-card');
    
    cards.forEach(card => {
        const name = card.querySelector('.product-name').textContent.toLowerCase();
        const cardCategory = card.dataset.category;
        const cardEstado = card.dataset.estado;
        
        const matchesSearch = name.includes(searchTerm);
        const matchesCategory = category === 'all' || cardCategory === category;
        const matchesEstado = estado === 'all' || cardEstado === estado;
        
        if (matchesSearch && matchesCategory && matchesEstado) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function showAddEquipmentModal() {
    const modal = createModal('Agregar Nuevo Equipo', `
        <form id="addEquipmentForm">
            <div class="form-group">
                <label class="form-label">Nombre del Equipo</label>
                <input type="text" class="form-input" id="equipmentName" required>
            </div>
            <div class="form-group">
                <label class="form-label">Categoría</label>
                <select class="form-input" id="equipmentCategory" required>
                    <option value="">Seleccionar...</option>
                    <option value="Redes">Redes</option>
                    <option value="Electrónica">Electrónica</option>
                    <option value="Cómputo">Cómputo</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Stock Inicial</label>
                <input type="number" class="form-input" id="equipmentStock" min="0" value="1" required>
            </div>
            <div class="form-group">
                <label class="form-label">Descripción</label>
                <textarea class="form-input" id="equipmentDesc" rows="3"></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Agregar Equipo</button>
        </form>
    `);
    
    document.body.appendChild(modal);
    modal.classList.add('active');
    
    document.getElementById('addEquipmentForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nombre = document.getElementById('equipmentName').value;
        const categoria = document.getElementById('equipmentCategory').value;
        const stock = parseInt(document.getElementById('equipmentStock').value);
        const descripcion = document.getElementById('equipmentDesc').value;

        const equipos = getEquipos();
        const nuevoEquipo = {
            id: Date.now(),
            nombre: nombre,
            categoria: categoria,
            stock: stock,
            descripcion: descripcion,
            estado: stock > 0 ? 'disponible' : 'no_disponible'
        };

        equipos.push(nuevoEquipo);
        saveEquipos(equipos);
        
        showAlert('success', 'Equipo agregado exitosamente');
        closeModal(modal);
        loadInventory();
    });
}

function editEquipment(id) {
    const equipos = getEquipos();
    const equipo = equipos.find(e => e.id === id);
    if (!equipo) return;

    const modal = createModal('Editar Equipo', `
        <form id="editEquipmentForm">
            <div class="form-group">
                <label class="form-label">Nombre del Equipo</label>
                <input type="text" class="form-input" id="editEquipmentName" value="${equipo.nombre}" required>
            </div>
            <div class="form-group">
                <label class="form-label">Categoría</label>
                <select class="form-input" id="editEquipmentCategory" required>
                    <option value="Redes" ${equipo.categoria === 'Redes' ? 'selected' : ''}>Redes</option>
                    <option value="Electrónica" ${equipo.categoria === 'Electrónica' ? 'selected' : ''}>Electrónica</option>
                    <option value="Cómputo" ${equipo.categoria === 'Cómputo' ? 'selected' : ''}>Cómputo</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Stock</label>
                <input type="number" class="form-input" id="editEquipmentStock" value="${equipo.stock}" min="0" required>
            </div>
            <div class="form-group">
                <label class="form-label">Descripción</label>
                <textarea class="form-input" id="editEquipmentDesc" rows="3">${equipo.descripcion || ''}</textarea>
            </div>
            <button type="submit" class="btn btn-primary">Guardar Cambios</button>
        </form>
    `);
    
    document.body.appendChild(modal);
    modal.classList.add('active');
    
    document.getElementById('editEquipmentForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const equipos = getEquipos();
        const index = equipos.findIndex(e => e.id === id);
        
        if (index !== -1) {
            equipos[index].nombre = document.getElementById('editEquipmentName').value;
            equipos[index].categoria = document.getElementById('editEquipmentCategory').value;
            equipos[index].stock = parseInt(document.getElementById('editEquipmentStock').value);
            equipos[index].descripcion = document.getElementById('editEquipmentDesc').value;
            equipos[index].estado = equipos[index].stock > 0 ? 'disponible' : 'no_disponible';
            
            saveEquipos(equipos);
            showAlert('success', 'Equipo actualizado exitosamente');
            closeModal(modal);
            loadInventory();
        }
    });
}

function deleteEquipment(id) {
    if (confirm('¿Estás seguro de dar de baja este equipo?')) {
        const equipos = getEquipos();
        const filtered = equipos.filter(e => e.id !== id);
        saveEquipos(filtered);
        showAlert('success', 'Equipo dado de baja');
        loadInventory();
    }
}

// ========================================
// GESTIÓN DE PRÉSTAMOS (ADMIN)
// ========================================

function initPrestamosPage() {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.rol !== 'admin') {
        window.location.href = 'login.html';
        return;
    }

    // Actualizar nombre en sidebar
    const userNameEl = document.querySelector('.sidebar-user .user-info h4');
    const userEmailEl = document.querySelector('.sidebar-user .user-info p');
    if (userNameEl) userNameEl.textContent = currentUser.nombre;
    if (userEmailEl) userEmailEl.textContent = currentUser.correo;

    loadPrestamos();
    
    // Filtros por estado
    const filterTabs = document.querySelectorAll('.filter-tab');
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            filterPrestamos(tab.dataset.status);
        });
    });

    // Nuevo préstamo
    const newLoanBtn = document.querySelector('.add-btn');
    if (newLoanBtn) {
        newLoanBtn.addEventListener('click', showNewLoanModal);
    }
}

function loadPrestamos() {
    const tableBody = document.querySelector('.loan-table tbody');
    if (!tableBody) return;

    const prestamos = getPrestamos();

    if (prestamos.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="8" style="text-align: center; color: var(--text-light);">No hay préstamos registrados</td></tr>';
        return;
    }

    tableBody.innerHTML = prestamos.map(prestamo => `
        <tr>
            <td>#${prestamo.id}</td>
            <td>${prestamo.equipo}</td>
            <td>${prestamo.usuario}</td>
            <td>${prestamo.matricula}</td>
            <td>${formatDate(prestamo.fecha)}</td>
            <td>${formatDate(prestamo.fechaDevolucion)}</td>
            <td class="status-cell">
                <span class="status-dot ${prestamo.estado}"></span>
                <span class="badge badge-${getStatusClass(prestamo.estado)}">${prestamo.estado}</span>
            </td>
            <td>
                <div class="loan-actions">
                    ${prestamo.estado === 'activo' ? `
                        <button class="return-btn" onclick="returnEquipment(${prestamo.id})">
                            <i class="fas fa-check"></i> Devolver
                        </button>
                    ` : ''}
                    ${prestamo.estado === 'activo' ? `
                        <button class="report-btn" onclick="reportIssue(${prestamo.id})">
                            <i class="fas fa-exclamation"></i> Reportar
                        </button>
                    ` : ''}
                </div>
            </td>
        </tr>
    `).join('');
}

function filterPrestamos(status) {
    const rows = document.querySelectorAll('.loan-table tbody tr');
    
    rows.forEach(row => {
        const statusBadge = row.querySelector('.badge');
        const rowStatus = statusBadge.textContent.toLowerCase();
        
        if (status === 'all' || rowStatus === status) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function showNewLoanModal() {
    const equipos = getEquipos().filter(e => e.stock > 0);
    
    const modal = createModal('Nuevo Préstamo', `
        <form id="newLoanForm">
            <div class="form-group">
                <label class="form-label">Buscar Estudiante</label>
                <input type="text" class="form-input" id="studentSearch" placeholder="Ingresa matrícula o nombre">
            </div>
            <div class="form-group">
                <label class="form-label">Equipo</label>
                <select class="form-input" id="loanEquipment" required>
                    <option value="">Seleccionar equipo...</option>
                    ${equipos.map(e => `
                        <option value="${e.id}">${e.nombre} (${e.stock} disponibles)</option>
                    `).join('')}
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Fecha de Préstamo</label>
                <input type="date" class="form-input" id="loanDate" required>
            </div>
            <div class="form-group">
                <label class="form-label">Fecha de Devolución</label>
                <input type="date" class="form-input" id="loanReturnDate" required>
            </div>
            <button type="submit" class="btn btn-primary">Crear Préstamo</button>
        </form>
    `);
    
    document.body.appendChild(modal);
    modal.classList.add('active');
    
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('loanDate').value = today;
    document.getElementById('loanDate').min = today;
    
    document.getElementById('newLoanForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const equipoId = parseInt(document.getElementById('loanEquipment').value);
        const equipos = getEquipos();
        const equipo = equipos.find(e => e.id === equipoId);
        
        if (!equipo) {
            showAlert('danger', 'Equipo no encontrado');
            return;
        }

        const prestamo = {
            id: Date.now(),
            equipo: equipo.nombre,
            equipoId: equipoId,
            usuario: document.getElementById('studentSearch').value || 'Estudiante',
            matricula: 'N/A',
            fecha: document.getElementById('loanDate').value,
            fechaDevolucion: document.getElementById('loanReturnDate').value,
            estado: 'activo'
        };

        const prestamos = getPrestamos();
        prestamos.push(prestamo);
        savePrestamos(prestamos);

        // Actualizar stock
        const index = equipos.findIndex(e => e.id === equipoId);
        if (index !== -1) {
            equipos[index].stock--;
            equipos[index].estado = equipos[index].stock > 0 ? 'disponible' : 'no_disponible';
            saveEquipos(equipos);
        }

        showAlert('success', 'Préstamo creado exitosamente');
        closeModal(modal);
        loadPrestamos();
    });
}

function returnEquipment(id) {
    if (confirm('¿Confirmar devolución del equipo?')) {
        const prestamos = getPrestamos();
        const index = prestamos.findIndex(p => p.id === id);
        
        if (index !== -1) {
            const prestamo = prestamos[index];
            prestamo.estado = 'completado';
            prestamo.fechaDevolucionReal = new Date().toISOString().split('T')[0];
            
            // Devolver stock
            const equipos = getEquipos();
            const equipoIndex = equipos.findIndex(e => e.id === prestamo.equipoId);
            if (equipoIndex !== -1) {
                equipos[equipoIndex].stock++;
                equipos[equipoIndex].estado = 'disponible';
                saveEquipos(equipos);
            }
            
            savePrestamos(prestamos);
            showAlert('success', 'Devolución registrada');
            loadPrestamos();
        }
    }
}

function reportIssue(id) {
    const modal = createModal('Reportar Problema', `
        <form id="reportForm">
            <div class="form-group">
                <label class="form-label">Tipo de Reporte</label>
                <select class="form-input" id="reportType" required>
                    <option value="">Seleccionar...</option>
                    <option value="daño">Equipo dañado</option>
                    <option value="perdida">Equipo perdido</option>
                    <option value="otro">Otro</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Descripción</label>
                <textarea class="form-input" id="reportDesc" rows="4" required></textarea>
            </div>
            <button type="submit" class="btn btn-danger">Enviar Reporte</button>
        </form>
    `);
    
    document.body.appendChild(modal);
    modal.classList.add('active');
    
    document.getElementById('reportForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const prestamos = getPrestamos();
        const index = prestamos.findIndex(p => p.id === id);
        
        if (index !== -1) {
            prestamos[index].estado = 'retrasado';
            prestamos[index].reporte = {
                tipo: document.getElementById('reportType').value,
                descripcion: document.getElementById('reportDesc').value,
                fecha: new Date().toISOString().split('T')[0]
            };
            savePrestamos(prestamos);
        }
        
        showAlert('warning', 'Reporte enviado al área de mantenimiento');
        closeModal(modal);
        loadPrestamos();
    });
}

// ========================================
// CATÁLOGO ESTUDIANTE
// ========================================

function initCatalogoPage() {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.rol !== 'estudiante') {
        window.location.href = 'login.html';
        return;
    }

    // Actualizar nombre en sidebar
    const userNameEl = document.querySelector('.sidebar-user .user-info h4');
    const userEmailEl = document.querySelector('.sidebar-user .user-info p');
    if (userNameEl) userNameEl.textContent = currentUser.nombre;
    if (userEmailEl) userEmailEl.textContent = currentUser.matricula;

    loadCatalog();
    
    // Filtros de categoría
    const filterOptions = document.querySelectorAll('.filter-option input');
    filterOptions.forEach(option => {
        option.addEventListener('change', filterCatalog);
    });

    // Filtros de estado
    const estadoFilters = document.querySelectorAll('.status-filter input');
    estadoFilters.forEach(option => {
        option.addEventListener('change', filterCatalog);
    });

    // Búsqueda
    const searchInput = document.getElementById('catalogSearch');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(filterCatalog, 300));
    }
}

function loadCatalog() {
    const grid = document.querySelector('.catalog-products');
    if (!grid) return;

    const equipos = getEquipos();

    grid.innerHTML = equipos.map(equipo => `
        <div class="catalog-product-card" data-category="${equipo.categoria}" data-stock="${equipo.stock}" data-estado="${equipo.estado}">
            <div class="catalog-product-image">
                <i class="fas fa-${getEquipmentIcon(equipo.categoria)}"></i>
                <span class="stock-indicator ${getStockClass(equipo.stock)}">
                    ${equipo.stock} disponibles
                </span>
            </div>
            <div class="catalog-product-info">
                <h4>${equipo.nombre}</h4>
                <div class="category">${equipo.categoria}</div>
                <p class="description">${equipo.descripcion}</p>
                <button class="request-btn" onclick="requestLoan(${equipo.id})" ${equipo.stock === 0 ? 'disabled' : ''}>
                    <i class="fas fa-shopping-cart"></i> ${equipo.stock === 0 ? 'No Disponible' : 'Solicitar Préstamo'}
                </button>
            </div>
        </div>
    `).join('');
}

function filterCatalog() {
    const searchTerm = document.getElementById('catalogSearch')?.value.toLowerCase() || '';
    
    // Filtros de categoría
    const checkedCategories = Array.from(document.querySelectorAll('.filter-option input:checked')).map(i => i.value);
    
    // Filtros de estado
    const filterAvailable = document.getElementById('filter-available')?.checked;
    const filterLow = document.getElementById('filter-low')?.checked;
    const filterOut = document.getElementById('filter-out')?.checked;
    const hasEstadoFilter = filterAvailable || filterLow || filterOut;
    
    const cards = document.querySelectorAll('.catalog-product-card');
    
    cards.forEach(card => {
        const name = card.querySelector('h4').textContent.toLowerCase();
        const category = card.dataset.category;
        const stock = parseInt(card.dataset.stock);
        
        const matchesSearch = name.includes(searchTerm);
        const matchesCategory = checkedCategories.length === 0 || checkedCategories.includes(category);
        
        // Filtrar por estado
        let matchesStatus = true;
        if (hasEstadoFilter) {
            // filterAvailable: stock > 3 (disponible)
            // filterLow: stock > 0 && stock <= 3 (stock bajo)
            // filterOut: stock === 0 (agotado)
            if (filterAvailable && stock <= 3) matchesStatus = false;
            if (filterLow && (stock === 0 || stock > 3)) matchesStatus = false;
            if (filterOut && stock > 0) matchesStatus = false;
        }
        
        if (matchesSearch && matchesCategory && matchesStatus) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function requestLoan(equipmentId) {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.rol !== 'estudiante') {
        window.location.href = 'login.html';
        return;
    }

    const equipos = getEquipos();
    const equipo = equipos.find(e => e.id === equipmentId);
    if (!equipo || equipo.stock === 0) return;

    const modal = createModal('Solicitar Préstamo', `
        <div class="loan-request-info" style="margin-bottom: 20px; padding: 15px; background: var(--light-gray); border-radius: 8px;">
            <p><strong>Equipo:</strong> ${equipo.nombre}</p>
            <p><strong>Categoría:</strong> ${equipo.categoria}</p>
            <p><strong>Disponibles:</strong> ${equipo.stock}</p>
        </div>
        <form id="requestLoanForm">
            <div class="form-group">
                <label class="form-label">Fecha de Préstamo</label>
                <input type="date" class="form-input" id="requestDate" required>
            </div>
            <div class="form-group">
                <label class="form-label">Fecha de Devolución</label>
                <input type="date" class="form-input" id="requestReturnDate" required>
            </div>
            <div class="form-group">
                <label class="form-label">Observaciones</label>
                <textarea class="form-input" id="requestNotes" rows="2" placeholder="Uso que le darás al equipo"></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Confirmar Solicitud</button>
        </form>
    `);
    
    document.body.appendChild(modal);
    modal.classList.add('active');
    
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('requestDate').value = today;
    document.getElementById('requestDate').min = today;
    
    document.getElementById('requestLoanForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const prestamo = {
            id: Date.now(),
            equipo: equipo.nombre,
            equipoId: equipo.id,
            usuario: currentUser.nombre,
            usuarioId: currentUser.id,
            matricula: currentUser.matricula,
            correo: currentUser.correo,
            fecha: document.getElementById('requestDate').value,
            fechaDevolucion: document.getElementById('requestReturnDate').value,
            observaciones: document.getElementById('requestNotes').value,
            estado: 'activo'
        };

        const prestamos = getPrestamos();
        prestamos.push(prestamo);
        savePrestamos(prestamos);

        // Actualizar stock
        const equipos = getEquipos();
        const index = equipos.findIndex(e => e.id === equipmentId);
        if (index !== -1) {
            equipos[index].stock--;
            equipos[index].estado = equipos[index].stock > 0 ? 'disponible' : 'no_disponible';
            saveEquipos(equipos);
        }

        showAlert('success', 'Solicitud enviada. Te notificaremos cuando sea aprobada.');
        closeModal(modal);
        loadCatalog();
    });
}

// ========================================
// MIS PRÉSTAMOS (ESTUDIANTE)
// ========================================

function initMisPrestamosPage() {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.rol !== 'estudiante') {
        window.location.href = 'login.html';
        return;
    }

    // Actualizar nombre en sidebar
    const userNameEl = document.querySelector('.sidebar-user .user-info h4');
    const userEmailEl = document.querySelector('.sidebar-user .user-info p');
    if (userNameEl) userNameEl.textContent = currentUser.nombre;
    if (userEmailEl) userEmailEl.textContent = currentUser.matricula;

    loadMisPrestamos();
}

function loadMisPrestamos() {
    const currentUser = getCurrentUser();
    const prestamos = getPrestamos().filter(p => p.usuarioId === currentUser.id);
    
    const container = document.querySelector('.mis-prestamos-list');
    if (!container) return;

    if (prestamos.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 50px; color: var(--text-light);">
                <i class="fas fa-inbox" style="font-size: 60px; margin-bottom: 20px;"></i>
                <h3>No tienes préstamos</h3>
                <p>Visita el catálogo para solicitar equipos</p>
                <a href="catalogo.html" class="btn btn-primary" style="margin-top: 20px;">Ver Catálogo</a>
            </div>
        `;
        return;
    }

    container.innerHTML = prestamos.map(prestamo => `
        <div class="maintenance-card">
            <div class="maintenance-header">
                <div>
                    <div class="maintenance-id">ID: #${prestamo.id}</div>
                    <h3 class="maintenance-equipment">${prestamo.equipo}</h3>
                </div>
                <span class="badge badge-${getStatusClass(prestamo.estado)}">${prestamo.estado}</span>
            </div>
            <div class="maintenance-details">
                <div class="detail-item">
                    <span class="detail-label">Fecha de Préstamo</span>
                    <span class="detail-value">${formatDate(prestamo.fecha)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Fecha de Devolución</span>
                    <span class="detail-value">${formatDate(prestamo.fechaDevolucion)}</span>
                </div>
                ${prestamo.observaciones ? `
                <div class="detail-item" style="grid-column: 1 / -1;">
                    <span class="detail-label">Observaciones</span>
                    <span class="detail-value">${prestamo.observaciones}</span>
                </div>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// ========================================
// MANTENIMIENTO
// ========================================

function initMantenimientoPage() {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.rol !== 'admin') {
        window.location.href = 'login.html';
        return;
    }

    // Actualizar nombre en sidebar
    const userNameEl = document.querySelector('.sidebar-user .user-info h4');
    const userEmailEl = document.querySelector('.sidebar-user .user-info p');
    if (userNameEl) userNameEl.textContent = currentUser.nombre;
    if (userEmailEl) userEmailEl.textContent = currentUser.correo;

    loadMantenimiento();
    
    // Filtros por tipo
    const typeFilters = document.querySelectorAll('.type-filter-btn');
    typeFilters.forEach(btn => {
        btn.addEventListener('click', () => {
            typeFilters.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterMantenimiento(btn.dataset.type);
        });
    });

    // Nuevo reporte
    const newReportBtn = document.querySelector('.add-btn');
    if (newReportBtn) {
        newReportBtn.addEventListener('click', showNewMaintenanceModal);
    }
}

function loadMantenimiento() {
    const container = document.querySelector('.maintenance-list');
    if (!container) return;

    const mantenimiento = getMantenimiento();

    if (mantenimiento.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 50px; color: var(--text-light);">No hay reportes de mantenimiento</div>';
        return;
    }

    container.innerHTML = mantenimiento.map(m => `
        <div class="maintenance-card" data-type="${m.tipo}" data-status="${m.estado}">
            <div class="maintenance-header">
                <div>
                    <div class="maintenance-id">ID: #${m.id}</div>
                    <h3 class="maintenance-equipment">${m.equipo}</h3>
                    <span class="maintenance-type ${m.tipo}">${m.tipo}</span>
                </div>
            </div>
            <div class="maintenance-details">
                <div class="detail-item">
                    <span class="detail-label">Descripción</span>
                    <span class="detail-value">${m.descripcion}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Técnico Asignado</span>
                    <span class="detail-value">${m.tecnico || 'Por asignar'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Fecha</span>
                    <span class="detail-value">${formatDate(m.fecha)}</span>
                </div>
            </div>
            <div class="maintenance-status">
                <span class="status-badge ${m.estado.replace('_', '-')}">${m.estado.replace('_', ' ')}</span>
                <button class="btn btn-sm btn-outline" onclick="updateMaintenanceStatus(${m.id})">
                    Actualizar Estado
                </button>
            </div>
        </div>
    `).join('');
}

function filterMantenimiento(type) {
    const cards = document.querySelectorAll('.maintenance-card');
    
    cards.forEach(card => {
        if (type === 'all' || card.dataset.type === type) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function showNewMaintenanceModal() {
    const equipos = getEquipos();
    
    const modal = createModal('Nuevo Reporte de Falla', `
        <form id="maintenanceForm">
            <div class="form-group">
                <label class="form-label">Equipo</label>
                <select class="form-input" id="maintenanceEquipment" required>
                    <option value="">Seleccionar equipo...</option>
                    ${equipos.map(e => `
                        <option value="${e.id}">${e.nombre}</option>
                    `).join('')}
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Tipo de Mantenimiento</label>
                <select class="form-input" id="maintenanceType" required>
                    <option value="">Seleccionar...</option>
                    <option value="preventivo">Preventivo</option>
                    <option value="correctivo">Correctivo</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Descripción del Problema</label>
                <textarea class="form-input" id="maintenanceDesc" rows="4" required></textarea>
            </div>
            <button type="submit" class="btn btn-orange">Crear Reporte</button>
        </form>
    `);
    
    document.body.appendChild(modal);
    modal.classList.add('active');
    
    document.getElementById('maintenanceForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const equipoId = parseInt(document.getElementById('maintenanceEquipment').value);
        const equipos = getEquipos();
        const equipo = equipos.find(e => e.id === equipoId);
        
        const mantenimiento = getMantenimiento();
        mantenimiento.push({
            id: Date.now(),
            equipo: equipo.nombre,
            equipoId: equipoId,
            tipo: document.getElementById('maintenanceType').value,
            descripcion: document.getElementById('maintenanceDesc').value,
            tecnico: null,
            fecha: new Date().toISOString().split('T')[0],
            estado: 'pendiente'
        });
        
        saveMantenimiento(mantenimiento);
        showAlert('success', 'Reporte de mantenimiento creado');
        closeModal(modal);
        loadMantenimiento();
    });
}

function updateMaintenanceStatus(id) {
    const modal = createModal('Actualizar Estado', `
        <form id="updateStatusForm">
            <div class="form-group">
                <label class="form-label">Nuevo Estado</label>
                <select class="form-input" id="newStatus" required>
                    <option value="pendiente">Pendiente</option>
                    <option value="en_progreso">En Progreso</option>
                    <option value="completado">Completado</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Técnico Asignado</label>
                <input type="text" class="form-input" id="tecnicoAsignado" placeholder="Nombre del técnico">
            </div>
            <div class="form-group">
                <label class="form-label">Notas</label>
                <textarea class="form-input" id="statusNotes" rows="3"></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Actualizar</button>
        </form>
    `);
    
    document.body.appendChild(modal);
    modal.classList.add('active');
    
    document.getElementById('updateStatusForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const mantenimiento = getMantenimiento();
        const index = mantenimiento.findIndex(m => m.id === id);
        
        if (index !== -1) {
            mantenimiento[index].estado = document.getElementById('newStatus').value;
            mantenimiento[index].tecnico = document.getElementById('tecnicoAsignado').value;
            saveMantenimiento(mantenimiento);
            showAlert('success', 'Estado actualizado');
            closeModal(modal);
            loadMantenimiento();
        }
    });
}

// ========================================
// CONFIGURACIÓN ADMIN
// ========================================

function initConfiguracionAdminPage() {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.rol !== 'admin') {
        window.location.href = 'login.html';
        return;
    }

    // Actualizar nombre en sidebar
    const userNameEl = document.querySelector('.sidebar-user .user-info h4');
    const userEmailEl = document.querySelector('.sidebar-user .user-info p');
    if (userNameEl) userNameEl.textContent = currentUser.nombre;
    if (userEmailEl) userEmailEl.textContent = currentUser.correo;

    // Actualizar formulario de perfil
    const nombreInput = document.getElementById('profileNombre');
    const correoInput = document.getElementById('profileCorreo');
    const cargoInput = document.getElementById('profileCargo');
    
    if (nombreInput) nombreInput.value = currentUser.nombre;
    if (correoInput) correoInput.value = currentUser.correo;
    if (cargoInput) cargoInput.value = 'Administrador de Laboratorio';

    // Navegación de configuración
    const navItems = document.querySelectorAll('.settings-nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            const section = item.dataset.section;
            showSettingsSection(section);
        });
    });

    // Toggle switches
    const toggles = document.querySelectorAll('.toggle-switch input');
    toggles.forEach(toggle => {
        toggle.addEventListener('change', () => {
            const label = toggle.closest('.toggle-group').querySelector('span:first-child').textContent;
            showAlert('success', `Configuración "${label}" actualizada`);
        });
    });

    // Guardar perfil
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            guardarPerfilAdmin();
        });
    }

    // Cerrar sesión
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
}

function guardarPerfilAdmin() {
    const currentUser = getCurrentUser();
    const nombre = document.getElementById('profileNombre')?.value;
    const correo = document.getElementById('profileCorreo')?.value;
    const telefono = document.getElementById('profileTelefono')?.value;
    
    const usuarios = getUsuarios();
    const index = usuarios.findIndex(u => u.id === currentUser.id);
    
    if (index !== -1) {
        // Verificar que el correo no esté en uso por otro usuario
        if (usuarios.some(u => u.correo === correo && u.id !== currentUser.id)) {
            showAlert('danger', 'El correo electrónico ya está en uso');
            return;
        }
        
        usuarios[index].nombre = nombre;
        usuarios[index].correo = correo;
        saveUsuarios(usuarios);
        setCurrentUser(usuarios[index]);
        
        // Actualizar sidebar
        const userNameEl = document.querySelector('.sidebar-user .user-info h4');
        const userEmailEl = document.querySelector('.sidebar-user .user-info p');
        if (userNameEl) userNameEl.textContent = nombre;
        if (userEmailEl) userEmailEl.textContent = correo;
        
        showAlert('success', 'Perfil actualizado correctamente');
    }
}

// CONFIGURACIÓN ESTUDIANTE
// ========================================

function initConfiguracionEstudiantePage() {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.rol !== 'estudiante') {
        window.location.href = 'login.html';
        return;
    }

    // Actualizar nombre en sidebar
    const userNameEl = document.querySelector('.sidebar-user .user-info h4');
    const userEmailEl = document.querySelector('.sidebar-user .user-info p');
    if (userNameEl) userNameEl.textContent = currentUser.nombre;
    if (userEmailEl) userEmailEl.textContent = currentUser.matricula;

    // Actualizar formulario de perfil
    const nombreInput = document.getElementById('profileNombre');
    const matriculaInput = document.getElementById('profileMatricula');
    const correoInput = document.getElementById('profileCorreo');
    const telefonoInput = document.getElementById('profileTelefono');
    
    if (nombreInput) nombreInput.value = currentUser.nombre;
    if (matriculaInput) matriculaInput.value = currentUser.matricula;
    if (correoInput) correoInput.value = currentUser.correo;
    if (telefonoInput) telefonoInput.value = currentUser.telefono || '';

    // Navegación de configuración
    const navItems = document.querySelectorAll('.settings-nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            const section = item.dataset.section;
            showSettingsSection(section);
        });
    });

    // Toggle switches
    const toggles = document.querySelectorAll('.toggle-switch input');
    toggles.forEach(toggle => {
        toggle.addEventListener('change', () => {
            const label = toggle.closest('.toggle-group').querySelector('span:first-child').textContent;
            showAlert('success', `Configuración "${label}" actualizada`);
        });
    });

    // Guardar perfil
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            guardarPerfilEstudiante();
        });
    }

    // Cerrar sesión
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
}

function guardarPerfilEstudiante() {
    const currentUser = getCurrentUser();
    const nombre = document.getElementById('profileNombre')?.value;
    const correo = document.getElementById('profileCorreo')?.value;
    const telefono = document.getElementById('profileTelefono')?.value;
    
    const usuarios = getUsuarios();
    const index = usuarios.findIndex(u => u.id === currentUser.id);
    
    if (index !== -1) {
        // Verificar que el correo no esté en uso por otro usuario
        if (usuarios.some(u => u.correo === correo && u.id !== currentUser.id)) {
            showAlert('danger', 'El correo electrónico ya está en uso');
            return;
        }
        
        usuarios[index].nombre = nombre;
        usuarios[index].correo = correo;
        usuarios[index].telefono = telefono;
        saveUsuarios(usuarios);
        setCurrentUser(usuarios[index]);
        
        // Actualizar sidebar
        const userNameEl = document.querySelector('.sidebar-user .user-info h4');
        if (userNameEl) userNameEl.textContent = nombre;
        
        showAlert('success', 'Perfil actualizado correctamente');
    }
}

function showSettingsSection(section) {
    const sections = document.querySelectorAll('.settings-section');
    sections.forEach(s => s.style.display = 'none');
    
    const targetSection = document.getElementById(`${section}Section`);
    if (targetSection) {
        targetSection.style.display = 'block';
    }
}

// ========================================
// FUNCIONES AUXILIARES
// ========================================

function createModal(title, content) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    
    overlay.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h2 class="modal-title">${title}</h2>
                <button class="modal-close" onclick="closeModal(this.closest('.modal-overlay'))">&times;</button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
        </div>
    `;
    
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeModal(overlay);
        }
    });
    
    return overlay;
}

function closeModal(modal) {
    modal.classList.remove('active');
    setTimeout(() => modal.remove(), 300);
}

function showAlert(type, message) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        <i class="fas fa-${getAlertIcon(type)}"></i>
        <span>${message}</span>
    `;
    
    document.body.insertBefore(alert, document.body.firstChild);
    
    setTimeout(() => {
        alert.style.opacity = '0';
        setTimeout(() => alert.remove(), 300);
    }, 4000);
}

function getAlertIcon(type) {
    const icons = {
        'success': 'check-circle',
        'danger': 'exclamation-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ========================================
// EXPORTAR FUNCIONES PARA USO GLOBAL
// ========================================

window.LabTrack = {
    showAlert,
    createModal,
    closeModal,
    formatDate,
    logout,
    editEquipment,
    deleteEquipment,
    returnEquipment,
    reportIssue,
    requestLoan,
    updateMaintenanceStatus
};