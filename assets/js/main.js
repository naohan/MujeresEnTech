
/**
 * MAIN.JS - JavaScript Principal
 * Funcionalidades principales del sitio web
 */

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todas las funciones
    initNavigation();
    initScrollEffects();
    initCounters();
    initSmoothScroll();
    initNewsletterForm();
    initLoadingAnimations();
});

/**
 * NAVEGACIÓN
 */
function initNavigation() {
    const nav = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.querySelectorAll('.nav__link');
    const header = document.getElementById('header');
    
    // Toggle menú móvil
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            nav.classList.toggle('show');
            navToggle.classList.toggle('active');
            
            // Crear overlay para cerrar menú
            if (nav.classList.contains('show')) {
                createMobileOverlay();
            } else {
                removeMobileOverlay();
            }
        });
    }
    
    // Cerrar menú al hacer click en links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            nav.classList.remove('show');
            navToggle.classList.remove('active');
            removeMobileOverlay();
        });
    });
    
    // Crear overlay para móvil
    function createMobileOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'nav__overlay show';
        overlay.addEventListener('click', function() {
            nav.classList.remove('show');
            navToggle.classList.remove('active');
            removeMobileOverlay();
        });
        document.body.appendChild(overlay);
    }
    
    // Remover overlay
    function removeMobileOverlay() {
        const overlay = document.querySelector('.nav__overlay');
        if (overlay) {
            overlay.remove();
        }
    }
    
    // Header scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Active link highlight
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.pageYOffset;
        
        sections.forEach(function(section) {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) navLink.classList.add('active');
            }
        });
    });
}

/**
 * EFECTOS DE SCROLL
 */
function initScrollEffects() {
    // Intersection Observer para animaciones
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Animar contadores si están en viewport
                if (entry.target.classList.contains('stat__card')) {
                    animateCounter(entry.target.querySelector('.stat__number'));
                }
            }
        });
    }, observerOptions);
    
    // Observar elementos para animación
    const elementsToAnimate = document.querySelectorAll(
        '.stat__card, .barrier__card, .solution__card, .section__header'
    );
    
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });
    
    // Parallax effect para hero
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroContent = document.querySelector('.hero__content');
        const heroVisual = document.querySelector('.hero__visual');
        
        if (heroContent && heroVisual) {
            const parallaxSpeed = 0.5;
            heroContent.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
            heroVisual.style.transform = `translateY(${scrolled * parallaxSpeed * 0.3}px)`;
        }
    });
}

/**
 * CONTADORES ANIMADOS
 */
function initCounters() {
    window.animateCounter = function(element) {
        if (!element || element.classList.contains('counted')) return;
        
        const target = parseInt(element.getAttribute('data-number'));
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = function() {
            if (current < target) {
                current += increment;
                element.textContent = Math.ceil(current) + '%';
                setTimeout(updateCounter, 20);
            } else {
                element.textContent = target + '%';
            }
        };
        
        updateCounter();
        element.classList.add('counted');
    };
}

/**
 * SMOOTH SCROLL
 */
function initSmoothScroll() {
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * FORMULARIO NEWSLETTER
 */
function initNewsletterForm() {
    const form = document.querySelector('.newsletter__form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value;
            const button = this.querySelector('button');
            const originalText = button.innerHTML;
            
            // Validar email
            if (!isValidEmail(email)) {
                showNotification('Por favor, ingresa un email válido', 'error');
                return;
            }
            
            // Simular envío
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            button.disabled = true;
            
            setTimeout(() => {
                showNotification('¡Gracias por suscribirte! Te mantendremos informada.', 'success');
                this.reset();
                button.innerHTML = originalText;
                button.disabled = false;
            }, 2000);
        });
    }
}

/**
 * ANIMACIONES DE CARGA
 */
function initLoadingAnimations() {
    // Fade in elements on page load
    const fadeElements = document.querySelectorAll('.hero__content, .hero__visual');
    
    fadeElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.8s ease-out';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

/**
 * UTILIDADES
 */

// Validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Mostrar notificaciones
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <div class="notification__content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification__close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Agregar estilos si no existen
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 1rem;
                max-width: 400px;
                z-index: 9999;
                transform: translateX(100%);
                transition: transform 0.3s ease-out;
                border-left: 4px solid;
            }
            
            .notification--success {
                border-left-color: #10b981;
                color: #065f46;
            }
            
            .notification--error {
                border-left-color: #ef4444;
                color: #991b1b;
            }
            
            .notification--info {
                border-left-color: #3b82f6;
                color: #1e40af;
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            .notification__content {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .notification__close {
                background: none;
                border: none;
                cursor: pointer;
                color: #6b7280;
                padding: 0.25rem;
            }
            
            .notification__close:hover {
                color: #374151;
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Agregar al DOM
    document.body.appendChild(notification);
    
    // Mostrar
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Auto-hide después de 5 segundos
    setTimeout(() => {
        hideNotification(notification);
    }, 5000);
    
    // Cerrar manualmente
    notification.querySelector('.notification__close').addEventListener('click', () => {
        hideNotification(notification);
    });
}

// Ocultar notificación
function hideNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Obtener icono para notificación
function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'check-circle';
        case 'error': return 'exclamation-circle';
        case 'warning': return 'exclamation-triangle';
        default: return 'info-circle';
    }
}

// Debounce function
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

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Optimizar scroll events
const optimizedScroll = throttle(function() {
    // Lógica de scroll optimizada aquí
}, 16);

window.addEventListener('scroll', optimizedScroll);

// Detectar si es dispositivo móvil
function isMobile() {
    return window.innerWidth <= 767;
}

// Detectar si es tablet
function isTablet() {
    return window.innerWidth >= 768 && window.innerWidth <= 1023;
}

// Detectar si es desktop
function isDesktop() {
    return window.innerWidth >= 1024;
}

/**
 * LAZY LOADING PARA IMÁGENES
 */
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

/**
 * MANEJO DE ERRORES GLOBAL
 */
window.addEventListener('error', function(e) {
    console.error('Error capturado:', e.error);
    // Aquí podrías enviar el error a un servicio de logging
});

/**
 * PERFORMANCE MONITORING
 */
if ('performance' in window) {
    window.addEventListener('load', function() {
        setTimeout(function() {
            const perfData = performance.timing;
            const loadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log('Tiempo de carga:', loadTime + 'ms');
        }, 0);
    });
}

/**
 * SERVICE WORKER REGISTRATION (si existe)
 */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
        .then(function(registration) {
            console.log('SW registrado correctamente:', registration.scope);
        })
        .catch(function(error) {
            console.log('SW falló al registrarse:', error);
        });
    });
}