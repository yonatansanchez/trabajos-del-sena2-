/**
 * Módulo Web de Autenticación (Web Authentication Module)
 * Maneja la autenticación en el navegador
 * GA7-220501096-AA3-EV01
 */

const WebAuthModule = (function() {
    'use strict';

    // Clave para almacenamiento local
    const STORAGE_KEY = 'acero_jj_session';

    /**
     * Iniciar sesión
     * @param {string} email - Email del usuario
     * @param {string} password - Contraseña
     * @returns {Promise<Object>} Resultado de la operación
     */
    async function login(email, password) {
        try {
            // Validar campos
            if (!email || !password) {
                return { success: false, message: 'Email y contraseña son requeridos' };
            }

            // Validar formato de email
            if (!validateEmail(email)) {
                return { success: false, message: 'Email no válido' };
            }

            // Simular llamada a API (en producción, hacer fetch a backend)
            const response = await simulateAPICall('/api/auth/login', {
                method: 'POST',
                body: { email, password }
            });

            if (response.success) {
                // Guardar sesión en localStorage
                saveSession(response.token, response.user);
                return { success: true, message: 'Sesión iniciada', user: response.user };
            }

            return response;
        } catch (error) {
            return { success: false, message: 'Error al iniciar sesión: ' + error.message };
        }
    }

    /**
     * Cerrar sesión
     */
    function logout() {
        localStorage.removeItem(STORAGE_KEY);
        sessionStorage.clear();
        window.location.href = 'login.html';
    }

    /**
     * Registrar nuevo usuario
     * @param {Object} userData - Datos del usuario
     * @returns {Promise<Object>} Resultado de la operación
     */
    async function register(userData) {
        try {
            const { name, email, password, confirmPassword } = userData;

            // Validaciones
            if (!name || !email || !password || !confirmPassword) {
                return { success: false, message: 'Todos los campos son requeridos' };
            }

            if (!validateEmail(email)) {
                return { success: false, message: 'Email no válido' };
            }

            if (password.length < 6) {
                return { success: false, message: 'La contraseña debe tener al menos 6 caracteres' };
            }

            if (password !== confirmPassword) {
                return { success: false, message: 'Las contraseñas no coinciden' };
            }

            // Simular llamada a API
            const response = await simulateAPICall('/api/auth/register', {
                method: 'POST',
                body: { name, email, password }
            });

            return response;
        } catch (error) {
            return { success: false, message: 'Error al registrar: ' + error.message };
        }
    }

    /**
     * Recuperar contraseña
     * @param {string} email - Email del usuario
     * @returns {Promise<Object>} Resultado de la operación
     */
    async function recoverPassword(email) {
        try {
            if (!validateEmail(email)) {
                return { success: false, message: 'Email no válido' };
            }

            const response = await simulateAPICall('/api/auth/recover', {
                method: 'POST',
                body: { email }
            });

            return response;
        } catch (error) {
            return { success: false, message: 'Error al recuperar contraseña: ' + error.message };
        }
    }

    /**
     * Obtener sesión actual
     * @returns {Object|null} Datos de sesión o null
     */
    function getSession() {
        const sessionData = localStorage.getItem(STORAGE_KEY);
        if (sessionData) {
            try {
                return JSON.parse(sessionData);
            } catch (e) {
                return null;
            }
        }
        return null;
    }

    /**
     * Verificar si hay sesión activa
     * @returns {boolean} true si hay sesión
     */
    function isAuthenticated() {
        const session = getSession();
        return session !== null && session.token;
    }

    /**
     * Guardar sesión en localStorage
     * @param {string} token - Token de sesión
     * @param {Object} user - Datos del usuario
     */
    function saveSession(token, user) {
        const sessionData = {
            token,
            user,
            timestamp: Date.now()
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData));
    }

    /**
     * Validar formato de email
     * @param {string} email - Email a validar
     * @returns {boolean} true si es válido
     */
    function validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    /**
     * Simular llamada a API (en producción, usar fetch real)
     * @param {string} endpoint - Endpoint de la API
     * @param {Object} options - Opciones de la petición
     * @returns {Promise<Object>} Respuesta simulada
     */
    async function simulateAPICall(endpoint, options) {
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 500));

        // Respuestas simuladas para demostración
        if (endpoint === '/api/auth/login') {
            const { email, password } = options.body;
            if (email === 'admin@acerojj.com' && password === 'admin123') {
                return {
                    success: true,
                    token: 'token_' + Date.now(),
                    user: { id: '1', name: 'Administrador', email, role: 'admin' }
                };
            }
            return { success: false, message: 'Credenciales incorrectas' };
        }

        if (endpoint === '/api/auth/register') {
            return { success: true, message: 'Usuario registrado exitosamente' };
        }

        if (endpoint === '/api/auth/recover') {
            return { success: true, message: 'Se ha enviado un email de recuperación' };
        }

        return { success: false, message: 'Endpoint no encontrado' };
    }

    /**
     * Proteger página (redirigir a login si no hay sesión)
     */
    function requireAuth() {
        if (!isAuthenticated()) {
            window.location.href = 'login.html';
        }
    }

    // API pública
    return {
        login,
        logout,
        register,
        recoverPassword,
        getSession,
        isAuthenticated,
        requireAuth,
        validateEmail
    };
})();

// Exportar para uso en diferentes entornos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WebAuthModule;
}
