/**
 * login.js — Lógica de autenticación para LabTrack
 * Hace POST a /api/auth/login, guarda token y nombre en sessionStorage
 * y redirige al dashboard si las credenciales son correctas.
 */

const API = '/api/auth';

document.addEventListener('DOMContentLoaded', () => {
    // Tabs para tipo de usuario
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });
});

function login() {
    const email    = document.getElementById('inputEmail').value.trim();
    const password = document.getElementById('inputPassword').value.trim();
    const btn      = document.getElementById('btnLogin');

    // 1. Validar que los campos no estén vacíos
    if (!email || !password) {
        mostrarAlerta('El correo y la contraseña son requeridos.', 'warning');
        return;
    }

    // 2. Deshabilitar el botón para evitar doble envío
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Ingresando...';

    // 3. Hacer la petición POST al backend
    fetch(`${API}/login`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, password })
    })
        .then(res => res.json())
        .then(data => {
            // 4. Si las credenciales son incorrectas, mostrar error
            if (!data.token) {
                mostrarAlerta(data.mensaje || 'Credenciales incorrectas.', 'error');
                return;
            }

            // Verificar que el tipo de usuario seleccionado coincida con el rol real
            const tipoUsuario = document.querySelector('.tab-btn.active').dataset.type;
            if (data.rol !== tipoUsuario) {
                mostrarAlerta(`Esta cuenta no es de ${tipoUsuario === 'admin' ? 'administrador' : 'estudiante'}.`, 'error');
                return;
            }

            // 5. Guardar token, nombre y rol en sessionStorage
            sessionStorage.setItem('token',  data.token);
            sessionStorage.setItem('nombre', data.nombre);
            sessionStorage.setItem('rol',    data.rol);

            // 6. Redirigir según el rol
            mostrarAlerta('¡Bienvenido! Redirigiendo...', 'success');
            setTimeout(() => {
                if (data.rol === 'admin') {
                    window.location.href = 'dashboard.html';
                } else {
                    window.location.href = 'inventario.html';
                }
            }, 800);
        })
        .catch(() => {
            mostrarAlerta('Error al conectar con el servidor. Verifica que el backend esté corriendo.', 'error');
        })
        .finally(() => {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Ingresar';
        });
}

/**
 * Muestra una alerta en el div#alerta usando las clases CSS de LabTrack.
 * @param {string} mensaje - Texto a mostrar
 * @param {string} tipo    - 'success' | 'error' | 'warning'
 */
function mostrarAlerta(mensaje, tipo) {
    const colores = {
        success: 'var(--primary-green)',
        error:   'var(--danger)',
        warning: 'var(--warning)'
    };
    const iconos = {
        success: 'fa-check-circle',
        error:   'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle'
    };

    const color = colores[tipo] || colores.error;
    const icono = iconos[tipo]  || iconos.error;

    document.getElementById('alerta').innerHTML = `
        <div style="
            background: ${color}18;
            border: 1px solid ${color};
            border-radius: 8px;
            padding: 10px 14px;
            margin-bottom: 16px;
            color: ${color};
            font-size: 0.9rem;
            display: flex;
            align-items: center;
            gap: 8px;
        ">
            <i class="fas ${icono}"></i>
            <span>${mensaje}</span>
        </div>
    `;
}
