/**
 * registro.js — Lógica de registro para LabTrack
 * Hace POST a /api/auth/registro con nombre, email y password.
 * Valida los campos, la longitud de la contraseña y que las contraseñas coincidan.
 * Al registrar con éxito redirige al login.
 */

const API = 'http://localhost:3000/api/auth';

function registro() {
    const nombre          = document.getElementById('inputNombre').value.trim();
    const matricula       = document.getElementById('inputMatricula').value.trim();
    const email           = document.getElementById('inputEmail').value.trim();
    const password        = document.getElementById('inputPassword').value.trim();
    const confirmPassword = document.getElementById('inputConfirmPassword').value.trim();
    const btn             = document.getElementById('btnRegistro');

    // 1. Validar que todos los campos estén llenos
    if (!nombre || !matricula || !email || !password || !confirmPassword) {
        mostrarAlerta('Todos los campos son requeridos.', 'warning');
        return;
    }

    // 2. Validar longitud mínima de contraseña
    if (password.length < 6) {
        mostrarAlerta('La contraseña debe tener al menos 6 caracteres.', 'warning');
        return;
    }

    // 3. Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
        mostrarAlerta('Las contraseñas no coinciden.', 'warning');
        return;
    }

    // 4. Deshabilitar botón para evitar doble envío
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registrando...';

    // 5. Hacer la petición POST al backend
    // El backend espera: nombre, email, password
    fetch(`${API}/registro`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ nombre, email, password })
    })
        .then(res => res.json())
        .then(data => {
            // 6. Manejar errores del backend (email duplicado, etc.)
            if (data.error || data.mensaje === 'Este email ya está registrado') {
                mostrarAlerta(data.mensaje || data.error, 'error');
                return;
            }

            // 7. Registro exitoso → redirigir al login
            mostrarAlerta('¡Cuenta creada correctamente! Redirigiendo al login...', 'success');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        })
        .catch(() => {
            mostrarAlerta('Error al conectar con el servidor. Verifica que el backend esté corriendo.', 'error');
        })
        .finally(() => {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-user-plus"></i> Crear Cuenta';
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
