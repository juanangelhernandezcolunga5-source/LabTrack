/* ========================================
   LABTRACK - JavaScript
   Componentes Comunes (Animaciones, Sidebar)
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    initCommonComponents();
    controlarAccesosSidebar();
});

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
                sessionStorage.clear();
                window.location.href = 'login.html';
                return false;
            };
        }
    });

    // Animaciones de entrada
    animateOnScroll();
}

function controlarAccesosSidebar() {
    const rol = sessionStorage.getItem('rol');
    if (rol === 'estudiante') {
        const links = document.querySelectorAll('.sidebar .menu-item');
        links.forEach(link => {
            const text = link.querySelector('.menu-item-text')?.textContent || link.textContent;
            if (text.includes('Dashboard') || text.includes('Mantenimiento') || text.includes('Configuración')) {
                link.style.display = 'none';
            }
        });
    }
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