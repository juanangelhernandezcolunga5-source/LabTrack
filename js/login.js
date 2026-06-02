/**
 * login.js — Lógica de autenticación para LabTrack
 * Hace POST a /api/auth/login, guarda token y nombre en sessionStorage
 * y redirige al dashboard si las credenciales son correctas.
 */

const API = 'http://localhost:3000/api/auth';

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

            // 5. Guardar token y nombre en sessionStorage
            sessionStorage.setItem('token',  data.token);
            sessionStorage.setItem('nombre', data.nombre);

            // 6. Redirigir al dashboard de LabTrack
            mostrarAlerta('¡Bienvenido! Redirigiendo...', 'success');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
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
