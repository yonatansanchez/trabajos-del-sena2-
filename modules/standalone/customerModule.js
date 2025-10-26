/**
 * Módulo de Clientes (Customer Management Module)
 * Gestiona la información de clientes
 * GA7-220501096-AA3-EV01
 */

class CustomerModule {
    constructor() {
        this.customers = [];
    }

    /**
     * Crear un nuevo cliente
     * @param {Object} customerData - Datos del cliente
     * @returns {Object} Resultado de la operación
     */
    createCustomer(customerData) {
        const { name, email, phone, address, identificationType, identificationNumber, customerType } = customerData;

        // Validar datos obligatorios
        if (!name || !email || !identificationNumber) {
            return { success: false, message: 'Datos incompletos' };
        }

        // Verificar si el cliente ya existe
        if (this.customers.find(c => c.email === email)) {
            return { success: false, message: 'El email ya está registrado' };
        }

        if (this.customers.find(c => c.identificationNumber === identificationNumber)) {
            return { success: false, message: 'El número de identificación ya está registrado' };
        }

        const customer = {
            id: this.generateCustomerId(),
            name,
            email,
            phone: phone || '',
            address: address || '',
            identificationType: identificationType || 'CC',
            identificationNumber,
            customerType: customerType || 'MINORISTA',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isActive: true
        };

        this.customers.push(customer);

        return {
            success: true,
            message: 'Cliente creado exitosamente',
            customer
        };
    }

    /**
     * Obtener cliente por ID
     * @param {string} customerId - ID del cliente
     * @returns {Object} Cliente encontrado o null
     */
    getCustomerById(customerId) {
        return this.customers.find(c => c.id === customerId) || null;
    }

    /**
     * Obtener todos los clientes
     * @param {Object} filters - Filtros opcionales
     * @returns {Array} Lista de clientes
     */
    getCustomers(filters = {}) {
        let filteredCustomers = [...this.customers];

        // Filtrar por tipo de cliente
        if (filters.customerType) {
            filteredCustomers = filteredCustomers.filter(c => c.customerType === filters.customerType);
        }

        // Filtrar por estado activo
        if (filters.isActive !== undefined) {
            filteredCustomers = filteredCustomers.filter(c => c.isActive === filters.isActive);
        }

        // Búsqueda de texto
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            filteredCustomers = filteredCustomers.filter(c =>
                c.name.toLowerCase().includes(searchTerm) ||
                c.email.toLowerCase().includes(searchTerm) ||
                c.identificationNumber.includes(searchTerm)
            );
        }

        return filteredCustomers;
    }

    /**
     * Actualizar información del cliente
     * @param {string} customerId - ID del cliente
     * @param {Object} updateData - Datos a actualizar
     * @returns {Object} Resultado de la operación
     */
    updateCustomer(customerId, updateData) {
        const customerIndex = this.customers.findIndex(c => c.id === customerId);

        if (customerIndex === -1) {
            return { success: false, message: 'Cliente no encontrado' };
        }

        // Validar email único si se actualiza
        if (updateData.email) {
            const emailExists = this.customers.find(c =>
                c.id !== customerId && c.email === updateData.email
            );
            if (emailExists) {
                return { success: false, message: 'El email ya está en uso' };
            }
        }

        // Campos permitidos para actualización
        const allowedFields = ['name', 'email', 'phone', 'address', 'customerType', 'isActive'];
        const updates = {};

        allowedFields.forEach(field => {
            if (updateData[field] !== undefined) {
                updates[field] = updateData[field];
            }
        });

        this.customers[customerIndex] = {
            ...this.customers[customerIndex],
            ...updates,
            updatedAt: new Date().toISOString()
        };

        return {
            success: true,
            message: 'Cliente actualizado',
            customer: this.customers[customerIndex]
        };
    }

    /**
     * Desactivar cliente
     * @param {string} customerId - ID del cliente
     * @returns {Object} Resultado de la operación
     */
    deactivateCustomer(customerId) {
        return this.updateCustomer(customerId, { isActive: false });
    }

    /**
     * Activar cliente
     * @param {string} customerId - ID del cliente
     * @returns {Object} Resultado de la operación
     */
    activateCustomer(customerId) {
        return this.updateCustomer(customerId, { isActive: true });
    }

    /**
     * Generar ID de cliente
     * @returns {string} ID generado
     */
    generateCustomerId() {
        return 'cust_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8);
    }

    /**
     * Obtener estadísticas de clientes
     * @returns {Object} Estadísticas
     */
    getStatistics() {
        return {
            totalCustomers: this.customers.length,
            activeCustomers: this.customers.filter(c => c.isActive).length,
            inactiveCustomers: this.customers.filter(c => !c.isActive).length,
            byType: {
                MINORISTA: this.customers.filter(c => c.customerType === 'MINORISTA').length,
                MAYORISTA: this.customers.filter(c => c.customerType === 'MAYORISTA').length,
                CORPORATIVO: this.customers.filter(c => c.customerType === 'CORPORATIVO').length
            }
        };
    }
}

// Exportar para uso en diferentes entornos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CustomerModule;
}
