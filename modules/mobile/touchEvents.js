/**
 * Módulo Móvil - Eventos Touch (Touch Events Module)
 * Maneja eventos táctiles para dispositivos móviles
 * GA7-220501096-AA3-EV01
 */

const TouchEventsModule = (function() {
    'use strict';

    /**
     * Configurar swipe en un elemento
     * @param {HTMLElement|string} element - Elemento o selector
     * @param {Object} callbacks - Callbacks para cada dirección
     * @param {Object} options - Opciones de configuración
     */
    function setupSwipe(element, callbacks = {}, options = {}) {
        const el = typeof element === 'string' ? document.querySelector(element) : element;
        if (!el) return;

        const threshold = options.threshold || 50;
        const restraint = options.restraint || 100;
        const allowedTime = options.allowedTime || 500;

        let startX, startY, startTime;
        let distX, distY;

        el.addEventListener('touchstart', function(e) {
            const touchObj = e.changedTouches[0];
            startX = touchObj.pageX;
            startY = touchObj.pageY;
            startTime = new Date().getTime();
        }, false);

        el.addEventListener('touchend', function(e) {
            const touchObj = e.changedTouches[0];
            distX = touchObj.pageX - startX;
            distY = touchObj.pageY - startY;
            const elapsedTime = new Date().getTime() - startTime;

            if (elapsedTime <= allowedTime) {
                if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
                    if (distX > 0 && callbacks.right) {
                        callbacks.right(e);
                    } else if (distX < 0 && callbacks.left) {
                        callbacks.left(e);
                    }
                } else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint) {
                    if (distY > 0 && callbacks.down) {
                        callbacks.down(e);
                    } else if (distY < 0 && callbacks.up) {
                        callbacks.up(e);
                    }
                }
            }
        }, false);
    }

    /**
     * Configurar tap (toque rápido)
     * @param {HTMLElement|string} element - Elemento o selector
     * @param {Function} callback - Función a ejecutar
     * @param {Object} options - Opciones de configuración
     */
    function setupTap(element, callback, options = {}) {
        const el = typeof element === 'string' ? document.querySelector(element) : element;
        if (!el) return;

        const maxTime = options.maxTime || 250;
        const maxDistance = options.maxDistance || 10;

        let startX, startY, startTime;

        el.addEventListener('touchstart', function(e) {
            const touchObj = e.changedTouches[0];
            startX = touchObj.pageX;
            startY = touchObj.pageY;
            startTime = new Date().getTime();
        }, false);

        el.addEventListener('touchend', function(e) {
            const touchObj = e.changedTouches[0];
            const distX = Math.abs(touchObj.pageX - startX);
            const distY = Math.abs(touchObj.pageY - startY);
            const elapsedTime = new Date().getTime() - startTime;

            if (elapsedTime <= maxTime && distX <= maxDistance && distY <= maxDistance) {
                callback(e);
            }
        }, false);
    }

    /**
     * Configurar long press (presión larga)
     * @param {HTMLElement|string} element - Elemento o selector
     * @param {Function} callback - Función a ejecutar
     * @param {Object} options - Opciones de configuración
     */
    function setupLongPress(element, callback, options = {}) {
        const el = typeof element === 'string' ? document.querySelector(element) : element;
        if (!el) return;

        const duration = options.duration || 500;
        let timer;
        let cancelled = false;

        el.addEventListener('touchstart', function(e) {
            cancelled = false;
            timer = setTimeout(function() {
                if (!cancelled) {
                    callback(e);
                }
            }, duration);
        }, false);

        el.addEventListener('touchend', function() {
            clearTimeout(timer);
            cancelled = true;
        }, false);

        el.addEventListener('touchmove', function() {
            clearTimeout(timer);
            cancelled = true;
        }, false);
    }

    /**
     * Configurar pinch (pellizco para zoom)
     * @param {HTMLElement|string} element - Elemento o selector
     * @param {Object} callbacks - Callbacks para zoom in/out
     */
    function setupPinch(element, callbacks = {}) {
        const el = typeof element === 'string' ? document.querySelector(element) : element;
        if (!el) return;

        let initialDistance = 0;

        el.addEventListener('touchstart', function(e) {
            if (e.touches.length === 2) {
                initialDistance = getDistance(e.touches[0], e.touches[1]);
            }
        }, false);

        el.addEventListener('touchmove', function(e) {
            if (e.touches.length === 2) {
                e.preventDefault();
                const currentDistance = getDistance(e.touches[0], e.touches[1]);
                
                if (currentDistance > initialDistance && callbacks.zoomIn) {
                    callbacks.zoomIn(currentDistance / initialDistance);
                } else if (currentDistance < initialDistance && callbacks.zoomOut) {
                    callbacks.zoomOut(currentDistance / initialDistance);
                }
                
                initialDistance = currentDistance;
            }
        }, false);
    }

    /**
     * Calcular distancia entre dos puntos táctiles
     * @param {Touch} touch1 - Primer punto de contacto
     * @param {Touch} touch2 - Segundo punto de contacto
     * @returns {number} Distancia
     */
    function getDistance(touch1, touch2) {
        const x = touch2.pageX - touch1.pageX;
        const y = touch2.pageY - touch1.pageY;
        return Math.sqrt(x * x + y * y);
    }

    /**
     * Configurar drag (arrastrar)
     * @param {HTMLElement|string} element - Elemento o selector
     * @param {Object} callbacks - Callbacks para eventos de drag
     */
    function setupDrag(element, callbacks = {}) {
        const el = typeof element === 'string' ? document.querySelector(element) : element;
        if (!el) return;

        let startX, startY;
        let currentX = 0, currentY = 0;

        el.addEventListener('touchstart', function(e) {
            const touchObj = e.changedTouches[0];
            startX = touchObj.pageX;
            startY = touchObj.pageY;

            if (callbacks.onStart) {
                callbacks.onStart(e, { x: startX, y: startY });
            }
        }, false);

        el.addEventListener('touchmove', function(e) {
            const touchObj = e.changedTouches[0];
            currentX = touchObj.pageX - startX;
            currentY = touchObj.pageY - startY;

            if (callbacks.onMove) {
                callbacks.onMove(e, { x: currentX, y: currentY });
            }
        }, false);

        el.addEventListener('touchend', function(e) {
            if (callbacks.onEnd) {
                callbacks.onEnd(e, { x: currentX, y: currentY });
            }
        }, false);
    }

    /**
     * Prevenir comportamiento por defecto de touch
     * @param {HTMLElement|string} element - Elemento o selector
     */
    function preventDefaultTouch(element) {
        const el = typeof element === 'string' ? document.querySelector(element) : element;
        if (!el) return;

        el.addEventListener('touchstart', function(e) {
            e.preventDefault();
        }, { passive: false });

        el.addEventListener('touchmove', function(e) {
            e.preventDefault();
        }, { passive: false });
    }

    /**
     * Habilitar scroll horizontal con touch
     * @param {HTMLElement|string} element - Elemento o selector
     */
    function enableHorizontalScroll(element) {
        const el = typeof element === 'string' ? document.querySelector(element) : element;
        if (!el) return;

        let startX;
        let scrollLeft;

        el.addEventListener('touchstart', function(e) {
            startX = e.touches[0].pageX - el.offsetLeft;
            scrollLeft = el.scrollLeft;
        }, false);

        el.addEventListener('touchmove', function(e) {
            e.preventDefault();
            const x = e.touches[0].pageX - el.offsetLeft;
            const walk = (x - startX) * 2;
            el.scrollLeft = scrollLeft - walk;
        }, { passive: false });
    }

    /**
     * Detectar dirección del swipe
     * @param {number} startX - Posición X inicial
     * @param {number} startY - Posición Y inicial
     * @param {number} endX - Posición X final
     * @param {number} endY - Posición Y final
     * @returns {string} Dirección del swipe
     */
    function getSwipeDirection(startX, startY, endX, endY) {
        const diffX = endX - startX;
        const diffY = endY - startY;

        if (Math.abs(diffX) > Math.abs(diffY)) {
            return diffX > 0 ? 'right' : 'left';
        } else {
            return diffY > 0 ? 'down' : 'up';
        }
    }

    /**
     * Agregar feedback visual al tocar
     * @param {HTMLElement|string} element - Elemento o selector
     * @param {string} activeClass - Clase CSS para estado activo
     */
    function addTouchFeedback(element, activeClass = 'touch-active') {
        const el = typeof element === 'string' ? document.querySelector(element) : element;
        if (!el) return;

        el.addEventListener('touchstart', function() {
            el.classList.add(activeClass);
        }, false);

        el.addEventListener('touchend', function() {
            el.classList.remove(activeClass);
        }, false);

        el.addEventListener('touchcancel', function() {
            el.classList.remove(activeClass);
        }, false);
    }

    // API pública
    return {
        setupSwipe,
        setupTap,
        setupLongPress,
        setupPinch,
        setupDrag,
        preventDefaultTouch,
        enableHorizontalScroll,
        getSwipeDirection,
        addTouchFeedback,
        getDistance
    };
})();

// Exportar para uso en diferentes entornos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TouchEventsModule;
}
