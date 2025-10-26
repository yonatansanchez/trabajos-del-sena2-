/**
 * Módulo de Autenticación (Authentication Module)
 * Gestiona la autenticación y autorización de usuarios
 * GA7-220501096-AA3-EV01
 */

class AuthModule {
    constructor() {
        this.users = [];
        this.sessions = new Map();
    }

    /**
     * Registrar un nuevo usuario
     * @param {Object} userData - Datos del usuario
     * @returns {Object} Resultado de la operación
     */
    registerUser(userData) {
        const { email, password, name, role = 'customer' } = userData;
        
        // Validar datos
        if (!email || !password || !name) {
            return { success: false, message: 'Datos incompletos' };
        }

        // Verificar si el usuario ya existe
        if (this.users.find(u => u.email === email)) {
            return { success: false, message: 'El usuario ya existe' };
        }

        // Crear usuario
        const user = {
            id: this.generateId(),
            email,
            password: this.hashPassword(password),
            name,
            role,
            createdAt: new Date().toISOString()
        };

        this.users.push(user);
        return { success: true, message: 'Usuario registrado exitosamente', userId: user.id };
    }

    /**
     * Iniciar sesión
     * @param {string} email - Email del usuario
     * @param {string} password - Contraseña
     * @returns {Object} Resultado de la autenticación
     */
    login(email, password) {
        const user = this.users.find(u => u.email === email);
        
        if (!user) {
            return { success: false, message: 'Usuario no encontrado' };
        }

        if (user.password !== this.hashPassword(password)) {
            return { success: false, message: 'Contraseña incorrecta' };
        }

        // Crear sesión
        const sessionToken = this.generateToken();
        this.sessions.set(sessionToken, {
            userId: user.id,
            email: user.email,
            role: user.role,
            loginTime: new Date().toISOString()
        });

        return {
            success: true,
            message: 'Inicio de sesión exitoso',
            token: sessionToken,
            user: { id: user.id, email: user.email, name: user.name, role: user.role }
        };
    }

    /**
     * Cerrar sesión
     * @param {string} token - Token de sesión
     * @returns {Object} Resultado de la operación
     */
    logout(token) {
        if (this.sessions.has(token)) {
            this.sessions.delete(token);
            return { success: true, message: 'Sesión cerrada' };
        }
        return { success: false, message: 'Sesión no válida' };
    }

    /**
     * Validar sesión
     * @param {string} token - Token de sesión
     * @returns {Object} Información de la sesión
     */
    validateSession(token) {
        if (this.sessions.has(token)) {
            return { valid: true, session: this.sessions.get(token) };
        }
        return { valid: false };
    }

    /**
     * Recuperar contraseña
     * @param {string} email - Email del usuario
     * @returns {Object} Resultado de la operación
     */
    recoverPassword(email) {
        const user = this.users.find(u => u.email === email);
        
        if (!user) {
            return { success: false, message: 'Usuario no encontrado' };
        }

        // Generar token de recuperación
        const recoveryToken = this.generateToken();
        
        return {
            success: true,
            message: 'Token de recuperación generado',
            recoveryToken
        };
    }

    /**
     * Generar ID único
     * @returns {string} ID generado
     */
    generateId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Hash simple de contraseña (en producción usar bcrypt)
     * @param {string} password - Contraseña
     * @returns {string} Hash de la contraseña
     */
    hashPassword(password) {
        // Implementación simple - en producción usar bcrypt o similar
        return btoa(password + 'salt_acero_jj');
    }

    /**
     * Generar token de sesión
     * @returns {string} Token generado
     */
    generateToken() {
        return 'token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 16);
    }
}

// Exportar para uso en diferentes entornos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthModule;
}
