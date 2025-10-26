/**
 * Módulo Web de Validación de Formularios (Form Validation Module)
 * Proporciona validación de formularios para la aplicación web
 * GA7-220501096-AA3-EV01
 */

const WebFormValidation = (function() {
    'use strict';

    /**
     * Validar email
     * @param {string} email - Email a validar
     * @returns {Object} Resultado de la validación
     */
    function validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            return { valid: false, message: 'El email es requerido' };
        }
        if (!regex.test(email)) {
            return { valid: false, message: 'Email no válido' };
        }
        return { valid: true };
    }

    /**
     * Validar contraseña
     * @param {string} password - Contraseña a validar
     * @param {Object} options - Opciones de validación
     * @returns {Object} Resultado de la validación
     */
    function validatePassword(password, options = {}) {
        const minLength = options.minLength || 6;
        const requireUppercase = options.requireUppercase || false;
        const requireNumber = options.requireNumber || false;
        const requireSpecialChar = options.requireSpecialChar || false;

        if (!password) {
            return { valid: false, message: 'La contraseña es requerida' };
        }

        if (password.length < minLength) {
            return { valid: false, message: `La contraseña debe tener al menos ${minLength} caracteres` };
        }

        if (requireUppercase && !/[A-Z]/.test(password)) {
            return { valid: false, message: 'La contraseña debe contener al menos una mayúscula' };
        }

        if (requireNumber && !/\d/.test(password)) {
            return { valid: false, message: 'La contraseña debe contener al menos un número' };
        }

        if (requireSpecialChar && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            return { valid: false, message: 'La contraseña debe contener al menos un carácter especial' };
        }

        return { valid: true };
    }

    /**
     * Validar teléfono
     * @param {string} phone - Teléfono a validar
     * @returns {Object} Resultado de la validación
     */
    function validatePhone(phone) {
        if (!phone) {
            return { valid: false, message: 'El teléfono es requerido' };
        }

        // Formato colombiano: 10 dígitos
        const regex = /^[0-9]{10}$/;
        if (!regex.test(phone.replace(/\s/g, ''))) {
            return { valid: false, message: 'Teléfono debe tener 10 dígitos' };
        }

        return { valid: true };
    }

    /**
     * Validar campo requerido
     * @param {string} value - Valor a validar
     * @param {string} fieldName - Nombre del campo
     * @returns {Object} Resultado de la validación
     */
    function validateRequired(value, fieldName = 'Este campo') {
        if (!value || value.trim() === '') {
            return { valid: false, message: `${fieldName} es requerido` };
        }
        return { valid: true };
    }

    /**
     * Validar número
     * @param {string|number} value - Valor a validar
     * @param {Object} options - Opciones de validación
     * @returns {Object} Resultado de la validación
     */
    function validateNumber(value, options = {}) {
        const min = options.min;
        const max = options.max;
        const integer = options.integer || false;

        const num = parseFloat(value);

        if (isNaN(num)) {
            return { valid: false, message: 'Debe ser un número válido' };
        }

        if (integer && !Number.isInteger(num)) {
            return { valid: false, message: 'Debe ser un número entero' };
        }

        if (min !== undefined && num < min) {
            return { valid: false, message: `Debe ser mayor o igual a ${min}` };
        }

        if (max !== undefined && num > max) {
            return { valid: false, message: `Debe ser menor o igual a ${max}` };
        }

        return { valid: true };
    }

    /**
     * Validar formulario completo
     * @param {HTMLFormElement} form - Formulario a validar
     * @param {Object} rules - Reglas de validación
     * @returns {Object} Resultado de la validación
     */
    function validateForm(form, rules) {
        const errors = {};
        let isValid = true;

        // Limpiar mensajes de error anteriores
        clearFormErrors(form);

        // Validar cada campo según las reglas
        Object.keys(rules).forEach(fieldName => {
            const field = form.elements[fieldName];
            if (!field) return;

            const fieldRules = rules[fieldName];
            const value = field.value;

            // Validar requerido
            if (fieldRules.required) {
                const result = validateRequired(value, fieldRules.label || fieldName);
                if (!result.valid) {
                    errors[fieldName] = result.message;
                    isValid = false;
                    showFieldError(field, result.message);
                    return;
                }
            }

            // Validar email
            if (fieldRules.email && value) {
                const result = validateEmail(value);
                if (!result.valid) {
                    errors[fieldName] = result.message;
                    isValid = false;
                    showFieldError(field, result.message);
                    return;
                }
            }

            // Validar contraseña
            if (fieldRules.password && value) {
                const result = validatePassword(value, fieldRules.passwordOptions || {});
                if (!result.valid) {
                    errors[fieldName] = result.message;
                    isValid = false;
                    showFieldError(field, result.message);
                    return;
                }
            }

            // Validar teléfono
            if (fieldRules.phone && value) {
                const result = validatePhone(value);
                if (!result.valid) {
                    errors[fieldName] = result.message;
                    isValid = false;
                    showFieldError(field, result.message);
                    return;
                }
            }

            // Validar número
            if (fieldRules.number && value) {
                const result = validateNumber(value, fieldRules.numberOptions || {});
                if (!result.valid) {
                    errors[fieldName] = result.message;
                    isValid = false;
                    showFieldError(field, result.message);
                    return;
                }
            }

            // Validar confirmación de contraseña
            if (fieldRules.confirmPassword) {
                const passwordField = form.elements[fieldRules.confirmPassword];
                if (passwordField && value !== passwordField.value) {
                    const message = 'Las contraseñas no coinciden';
                    errors[fieldName] = message;
                    isValid = false;
                    showFieldError(field, message);
                    return;
                }
            }

            // Validación personalizada
            if (fieldRules.custom && typeof fieldRules.custom === 'function') {
                const result = fieldRules.custom(value, form);
                if (!result.valid) {
                    errors[fieldName] = result.message;
                    isValid = false;
                    showFieldError(field, result.message);
                }
            }
        });

        return { valid: isValid, errors };
    }

    /**
     * Mostrar error en campo
     * @param {HTMLElement} field - Campo del formulario
     * @param {string} message - Mensaje de error
     */
    function showFieldError(field, message) {
        field.classList.add('is-invalid');
        
        // Crear o actualizar mensaje de error
        let errorDiv = field.parentElement.querySelector('.invalid-feedback');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'invalid-feedback';
            field.parentElement.appendChild(errorDiv);
        }
        errorDiv.textContent = message;
    }

    /**
     * Limpiar errores del formulario
     * @param {HTMLFormElement} form - Formulario
     */
    function clearFormErrors(form) {
        const invalidFields = form.querySelectorAll('.is-invalid');
        invalidFields.forEach(field => {
            field.classList.remove('is-invalid');
        });

        const errorMessages = form.querySelectorAll('.invalid-feedback');
        errorMessages.forEach(msg => msg.remove());
    }

    /**
     * Configurar validación en tiempo real
     * @param {HTMLFormElement} form - Formulario
     * @param {Object} rules - Reglas de validación
     */
    function setupRealtimeValidation(form, rules) {
        Object.keys(rules).forEach(fieldName => {
            const field = form.elements[fieldName];
            if (!field) return;

            field.addEventListener('blur', function() {
                const fieldRules = { [fieldName]: rules[fieldName] };
                validateForm(form, fieldRules);
            });

            field.addEventListener('input', function() {
                if (field.classList.contains('is-invalid')) {
                    field.classList.remove('is-invalid');
                    const errorDiv = field.parentElement.querySelector('.invalid-feedback');
                    if (errorDiv) errorDiv.remove();
                }
            });
        });
    }

    // API pública
    return {
        validateEmail,
        validatePassword,
        validatePhone,
        validateRequired,
        validateNumber,
        validateForm,
        showFieldError,
        clearFormErrors,
        setupRealtimeValidation
    };
})();

// Exportar para uso en diferentes entornos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WebFormValidation;
}
