/**
 * Módulo API - Capa de Servicios (API Service Layer)
 * Proporciona una interfaz para comunicación con el backend
 * GA7-220501096-AA3-EV01
 */

const APIService = (function() {
    'use strict';

    // Configuración base
    const config = {
        baseURL: '/api',
        timeout: 30000,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    /**
     * Realizar petición HTTP
     * @param {string} endpoint - Endpoint de la API
     * @param {Object} options - Opciones de la petición
     * @returns {Promise<Object>} Respuesta de la API
     */
    async function request(endpoint, options = {}) {
        const url = config.baseURL + endpoint;
        const method = options.method || 'GET';
        const headers = { ...config.headers, ...options.headers };

        // Agregar token de autenticación si existe
        const session = getSession();
        if (session && session.token) {
            headers['Authorization'] = `Bearer ${session.token}`;
        }

        const requestOptions = {
            method,
            headers
        };

        // Agregar body si no es GET
        if (method !== 'GET' && options.body) {
            requestOptions.body = JSON.stringify(options.body);
        }

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), config.timeout);

            requestOptions.signal = controller.signal;

            const response = await fetch(url, requestOptions);
            clearTimeout(timeoutId);

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error en la petición');
            }

            return { success: true, data };
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('Tiempo de espera agotado');
            }
            throw error;
        }
    }

    /**
     * GET request
     * @param {string} endpoint - Endpoint
     * @param {Object} params - Parámetros de consulta
     * @returns {Promise<Object>} Respuesta
     */
    async function get(endpoint, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `${endpoint}?${queryString}` : endpoint;
        return request(url, { method: 'GET' });
    }

    /**
     * POST request
     * @param {string} endpoint - Endpoint
     * @param {Object} data - Datos a enviar
     * @returns {Promise<Object>} Respuesta
     */
    async function post(endpoint, data = {}) {
        return request(endpoint, { method: 'POST', body: data });
    }

    /**
     * PUT request
     * @param {string} endpoint - Endpoint
     * @param {Object} data - Datos a enviar
     * @returns {Promise<Object>} Respuesta
     */
    async function put(endpoint, data = {}) {
        return request(endpoint, { method: 'PUT', body: data });
    }

    /**
     * DELETE request
     * @param {string} endpoint - Endpoint
     * @returns {Promise<Object>} Respuesta
     */
    async function del(endpoint) {
        return request(endpoint, { method: 'DELETE' });
    }

    /**
     * Configurar URL base de la API
     * @param {string} url - URL base
     */
    function setBaseURL(url) {
        config.baseURL = url;
    }

    /**
     * Configurar timeout
     * @param {number} timeout - Timeout en milisegundos
     */
    function setTimeout(timeout) {
        config.timeout = timeout;
    }

    /**
     * Configurar headers por defecto
     * @param {Object} headers - Headers
     */
    function setHeaders(headers) {
        config.headers = { ...config.headers, ...headers };
    }

    /**
     * Obtener sesión del localStorage
     * @returns {Object|null} Datos de sesión
     */
    function getSession() {
        const sessionData = localStorage.getItem('acero_jj_session');
        if (sessionData) {
            try {
                return JSON.parse(sessionData);
            } catch (e) {
                return null;
            }
        }
        return null;
    }

    // === Endpoints de Autenticación ===

    const auth = {
        /**
         * Iniciar sesión
         * @param {string} email - Email
         * @param {string} password - Contraseña
         * @returns {Promise<Object>} Respuesta
         */
        login: (email, password) => post('/auth/login', { email, password }),

        /**
         * Registrar usuario
         * @param {Object} userData - Datos del usuario
         * @returns {Promise<Object>} Respuesta
         */
        register: (userData) => post('/auth/register', userData),

        /**
         * Cerrar sesión
         * @returns {Promise<Object>} Respuesta
         */
        logout: () => post('/auth/logout'),

        /**
         * Recuperar contraseña
         * @param {string} email - Email
         * @returns {Promise<Object>} Respuesta
         */
        recoverPassword: (email) => post('/auth/recover', { email }),

        /**
         * Restablecer contraseña
         * @param {string} token - Token de recuperación
         * @param {string} newPassword - Nueva contraseña
         * @returns {Promise<Object>} Respuesta
         */
        resetPassword: (token, newPassword) => post('/auth/reset', { token, newPassword })
    };

    // === Endpoints de Productos ===

    const products = {
        /**
         * Obtener todos los productos
         * @param {Object} filters - Filtros
         * @returns {Promise<Object>} Respuesta
         */
        getAll: (filters = {}) => get('/products', filters),

        /**
         * Obtener producto por ID
         * @param {string} id - ID del producto
         * @returns {Promise<Object>} Respuesta
         */
        getById: (id) => get(`/products/${id}`),

        /**
         * Crear producto
         * @param {Object} productData - Datos del producto
         * @returns {Promise<Object>} Respuesta
         */
        create: (productData) => post('/products', productData),

        /**
         * Actualizar producto
         * @param {string} id - ID del producto
         * @param {Object} updateData - Datos a actualizar
         * @returns {Promise<Object>} Respuesta
         */
        update: (id, updateData) => put(`/products/${id}`, updateData),

        /**
         * Eliminar producto
         * @param {string} id - ID del producto
         * @returns {Promise<Object>} Respuesta
         */
        delete: (id) => del(`/products/${id}`),

        /**
         * Obtener productos con stock bajo
         * @returns {Promise<Object>} Respuesta
         */
        getLowStock: () => get('/products/low-stock')
    };

    // === Endpoints de Inventario ===

    const inventory = {
        /**
         * Registrar movimiento de inventario
         * @param {Object} movementData - Datos del movimiento
         * @returns {Promise<Object>} Respuesta
         */
        registerMovement: (movementData) => post('/inventory/movements', movementData),

        /**
         * Obtener movimientos
         * @param {Object} filters - Filtros
         * @returns {Promise<Object>} Respuesta
         */
        getMovements: (filters = {}) => get('/inventory/movements', filters),

        /**
         * Generar reporte de inventario
         * @returns {Promise<Object>} Respuesta
         */
        getReport: () => get('/inventory/report'),

        /**
         * Obtener alertas de stock
         * @returns {Promise<Object>} Respuesta
         */
        getAlerts: () => get('/inventory/alerts')
    };

    // === Endpoints de Pedidos ===

    const orders = {
        /**
         * Crear pedido
         * @param {Object} orderData - Datos del pedido
         * @returns {Promise<Object>} Respuesta
         */
        create: (orderData) => post('/orders', orderData),

        /**
         * Obtener todos los pedidos
         * @param {Object} filters - Filtros
         * @returns {Promise<Object>} Respuesta
         */
        getAll: (filters = {}) => get('/orders', filters),

        /**
         * Obtener pedido por ID
         * @param {string} id - ID del pedido
         * @returns {Promise<Object>} Respuesta
         */
        getById: (id) => get(`/orders/${id}`),

        /**
         * Actualizar estado del pedido
         * @param {string} id - ID del pedido
         * @param {string} status - Nuevo estado
         * @returns {Promise<Object>} Respuesta
         */
        updateStatus: (id, status) => put(`/orders/${id}/status`, { status }),

        /**
         * Cancelar pedido
         * @param {string} id - ID del pedido
         * @param {string} reason - Razón de cancelación
         * @returns {Promise<Object>} Respuesta
         */
        cancel: (id, reason) => post(`/orders/${id}/cancel`, { reason }),

        /**
         * Obtener estadísticas
         * @returns {Promise<Object>} Respuesta
         */
        getStatistics: () => get('/orders/statistics')
    };

    // === Endpoints de Clientes ===

    const customers = {
        /**
         * Crear cliente
         * @param {Object} customerData - Datos del cliente
         * @returns {Promise<Object>} Respuesta
         */
        create: (customerData) => post('/customers', customerData),

        /**
         * Obtener todos los clientes
         * @param {Object} filters - Filtros
         * @returns {Promise<Object>} Respuesta
         */
        getAll: (filters = {}) => get('/customers', filters),

        /**
         * Obtener cliente por ID
         * @param {string} id - ID del cliente
         * @returns {Promise<Object>} Respuesta
         */
        getById: (id) => get(`/customers/${id}`),

        /**
         * Actualizar cliente
         * @param {string} id - ID del cliente
         * @param {Object} updateData - Datos a actualizar
         * @returns {Promise<Object>} Respuesta
         */
        update: (id, updateData) => put(`/customers/${id}`, updateData),

        /**
         * Desactivar cliente
         * @param {string} id - ID del cliente
         * @returns {Promise<Object>} Respuesta
         */
        deactivate: (id) => post(`/customers/${id}/deactivate`)
    };

    // API pública
    return {
        get,
        post,
        put,
        delete: del,
        setBaseURL,
        setTimeout,
        setHeaders,
        auth,
        products,
        inventory,
        orders,
        customers
    };
})();

// Exportar para uso en diferentes entornos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = APIService;
}
