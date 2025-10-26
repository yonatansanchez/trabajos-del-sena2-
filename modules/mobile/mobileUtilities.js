/**
 * Módulo Móvil - Utilidades Responsive (Mobile Utilities Module)
 * Proporciona funcionalidades para dispositivos móviles
 * GA7-220501096-AA3-EV01
 */

const MobileUtilities = (function() {
    'use strict';

    /**
     * Detectar si es dispositivo móvil
     * @returns {boolean} true si es móvil
     */
    function isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    /**
     * Detectar si es tablet
     * @returns {boolean} true si es tablet
     */
    function isTablet() {
        return /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/i.test(navigator.userAgent);
    }

    /**
     * Obtener tipo de dispositivo
     * @returns {string} 'mobile', 'tablet' o 'desktop'
     */
    function getDeviceType() {
        if (isMobile() && !isTablet()) return 'mobile';
        if (isTablet()) return 'tablet';
        return 'desktop';
    }

    /**
     * Obtener orientación del dispositivo
     * @returns {string} 'portrait' o 'landscape'
     */
    function getOrientation() {
        return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
    }

    /**
     * Detectar soporte de touch
     * @returns {boolean} true si soporta touch
     */
    function supportsTouchEvents() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }

    /**
     * Configurar viewport para móvil
     */
    function setupMobileViewport() {
        let viewport = document.querySelector('meta[name="viewport"]');
        if (!viewport) {
            viewport = document.createElement('meta');
            viewport.name = 'viewport';
            document.head.appendChild(viewport);
        }
        viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
    }

    /**
     * Prevenir zoom en inputs (iOS)
     */
    function preventInputZoom() {
        if (isMobile()) {
            const inputs = document.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                if (!input.style.fontSize || parseFloat(input.style.fontSize) < 16) {
                    input.style.fontSize = '16px';
                }
            });
        }
    }

    /**
     * Habilitar scroll suave
     */
    function enableSmoothScroll() {
        document.documentElement.style.scrollBehavior = 'smooth';
    }

    /**
     * Scroll to top
     */
    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /**
     * Detectar cuando el usuario está cerca del final de la página
     * @param {number} threshold - Umbral en píxeles
     * @param {Function} callback - Función a ejecutar
     */
    function onScrollNearBottom(threshold = 100, callback) {
        window.addEventListener('scroll', function() {
            const scrollPosition = window.innerHeight + window.scrollY;
            const pageHeight = document.documentElement.scrollHeight;
            
            if (pageHeight - scrollPosition <= threshold) {
                callback();
            }
        });
    }

    /**
     * Ocultar/mostrar elementos según scroll
     * @param {string} selector - Selector del elemento
     * @param {string} direction - 'up' o 'down'
     */
    function hideOnScroll(selector, direction = 'down') {
        const element = document.querySelector(selector);
        if (!element) return;

        let lastScroll = 0;

        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;

            if (direction === 'down' && currentScroll > lastScroll && currentScroll > 50) {
                element.style.transform = 'translateY(-100%)';
            } else if (direction === 'down') {
                element.style.transform = 'translateY(0)';
            } else if (direction === 'up' && currentScroll < lastScroll) {
                element.style.transform = 'translateY(0)';
            } else if (direction === 'up') {
                element.style.transform = 'translateY(-100%)';
            }

            lastScroll = currentScroll;
        });
    }

    /**
     * Agregar botón de volver arriba
     * @param {Object} options - Opciones de configuración
     */
    function addBackToTopButton(options = {}) {
        const showAfter = options.showAfter || 300;
        const position = options.position || { bottom: '20px', right: '20px' };

        const button = document.createElement('button');
        button.id = 'back-to-top';
        button.innerHTML = options.icon || '↑';
        button.style.cssText = `
            position: fixed;
            bottom: ${position.bottom};
            right: ${position.right};
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: #007bff;
            color: white;
            border: none;
            cursor: pointer;
            display: none;
            z-index: 1000;
            font-size: 24px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        `;

        document.body.appendChild(button);

        window.addEventListener('scroll', function() {
            if (window.pageYOffset > showAfter) {
                button.style.display = 'block';
            } else {
                button.style.display = 'none';
            }
        });

        button.addEventListener('click', scrollToTop);
    }

    /**
     * Detectar cambio de orientación
     * @param {Function} callback - Función a ejecutar
     */
    function onOrientationChange(callback) {
        window.addEventListener('orientationchange', function() {
            setTimeout(callback, 100);
        });

        window.addEventListener('resize', function() {
            const newOrientation = getOrientation();
            callback(newOrientation);
        });
    }

    /**
     * Obtener tamaño de pantalla
     * @returns {Object} Dimensiones de la pantalla
     */
    function getScreenSize() {
        return {
            width: window.innerWidth,
            height: window.innerHeight,
            availWidth: screen.availWidth,
            availHeight: screen.availHeight
        };
    }

    /**
     * Verificar si la pantalla es pequeña
     * @param {number} breakpoint - Punto de quiebre en píxeles
     * @returns {boolean} true si es pantalla pequeña
     */
    function isSmallScreen(breakpoint = 768) {
        return window.innerWidth < breakpoint;
    }

    /**
     * Habilitar pull-to-refresh (simulado)
     * @param {Function} callback - Función a ejecutar al hacer pull
     */
    function enablePullToRefresh(callback) {
        let startY = 0;
        let pulling = false;

        document.addEventListener('touchstart', function(e) {
            if (window.pageYOffset === 0) {
                startY = e.touches[0].pageY;
                pulling = true;
            }
        });

        document.addEventListener('touchmove', function(e) {
            if (!pulling) return;

            const y = e.touches[0].pageY;
            const pullDistance = y - startY;

            if (pullDistance > 100) {
                pulling = false;
                callback();
            }
        });

        document.addEventListener('touchend', function() {
            pulling = false;
        });
    }

    /**
     * Vibrar dispositivo (si está disponible)
     * @param {number|Array} pattern - Patrón de vibración
     */
    function vibrate(pattern = 200) {
        if ('vibrate' in navigator) {
            navigator.vibrate(pattern);
        }
    }

    /**
     * Inicializar optimizaciones para móvil
     */
    function initMobileOptimizations() {
        if (isMobile()) {
            setupMobileViewport();
            preventInputZoom();
            enableSmoothScroll();
            
            // Prevenir zoom con doble tap en iOS
            let lastTouchEnd = 0;
            document.addEventListener('touchend', function(e) {
                const now = Date.now();
                if (now - lastTouchEnd <= 300) {
                    e.preventDefault();
                }
                lastTouchEnd = now;
            }, false);
        }
    }

    // API pública
    return {
        isMobile,
        isTablet,
        getDeviceType,
        getOrientation,
        supportsTouchEvents,
        setupMobileViewport,
        preventInputZoom,
        enableSmoothScroll,
        scrollToTop,
        onScrollNearBottom,
        hideOnScroll,
        addBackToTopButton,
        onOrientationChange,
        getScreenSize,
        isSmallScreen,
        enablePullToRefresh,
        vibrate,
        initMobileOptimizations
    };
})();

// Exportar para uso en diferentes entornos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MobileUtilities;
}

// Auto-inicializar optimizaciones si está en móvil
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', MobileUtilities.initMobileOptimizations);
    } else {
        MobileUtilities.initMobileOptimizations();
    }
}
