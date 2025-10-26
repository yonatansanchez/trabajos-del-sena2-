/**
 * Módulo de Inventario (Inventory Management Module)
 * Gestiona el inventario de productos y movimientos
 * GA7-220501096-AA3-EV01
 */

class InventoryModule {
    constructor(productModule) {
        this.productModule = productModule;
        this.movements = [];
        this.movementTypes = ['ENTRADA', 'SALIDA', 'AJUSTE', 'DEVOLUCION'];
    }

    /**
     * Registrar entrada de inventario
     * @param {string} productId - ID del producto
     * @param {number} quantity - Cantidad
     * @param {Object} details - Detalles adicionales
     * @returns {Object} Resultado de la operación
     */
    registerEntry(productId, quantity, details = {}) {
        return this.registerMovement(productId, quantity, 'ENTRADA', details);
    }

    /**
     * Registrar salida de inventario
     * @param {string} productId - ID del producto
     * @param {number} quantity - Cantidad
     * @param {Object} details - Detalles adicionales
     * @returns {Object} Resultado de la operación
     */
    registerExit(productId, quantity, details = {}) {
        return this.registerMovement(productId, -quantity, 'SALIDA', details);
    }

    /**
     * Registrar movimiento de inventario
     * @param {string} productId - ID del producto
     * @param {number} quantity - Cantidad (positiva para entrada, negativa para salida)
     * @param {string} type - Tipo de movimiento
     * @param {Object} details - Detalles adicionales
     * @returns {Object} Resultado de la operación
     */
    registerMovement(productId, quantity, type, details = {}) {
        const product = this.productModule.getProductById(productId);

        if (!product) {
            return { success: false, message: 'Producto no encontrado' };
        }

        // Validar cantidad
        if (quantity === 0) {
            return { success: false, message: 'La cantidad debe ser diferente de cero' };
        }

        // Validar tipo de movimiento
        if (!this.movementTypes.includes(type)) {
            return { success: false, message: 'Tipo de movimiento no válido' };
        }

        // Validar stock suficiente para salidas
        if (quantity < 0 && product.stock + quantity < 0) {
            return { success: false, message: 'Stock insuficiente' };
        }

        // Calcular nuevo stock
        const newStock = product.stock + quantity;

        // Actualizar stock del producto
        const updateResult = this.productModule.updateProduct(productId, { stock: newStock });

        if (!updateResult.success) {
            return updateResult;
        }

        // Registrar movimiento
        const movement = {
            id: this.generateMovementId(),
            productId,
            productName: product.name,
            quantity,
            type,
            previousStock: product.stock,
            newStock,
            details: details.reason || '',
            reference: details.reference || '',
            userId: details.userId || 'system',
            createdAt: new Date().toISOString()
        };

        this.movements.push(movement);

        return {
            success: true,
            message: `Movimiento de ${type} registrado`,
            movement,
            newStock
        };
    }

    /**
     * Ajustar inventario
     * @param {string} productId - ID del producto
     * @param {number} newStock - Nuevo stock
     * @param {string} reason - Razón del ajuste
     * @returns {Object} Resultado de la operación
     */
    adjustInventory(productId, newStock, reason = '') {
        const product = this.productModule.getProductById(productId);

        if (!product) {
            return { success: false, message: 'Producto no encontrado' };
        }

        const difference = newStock - product.stock;

        return this.registerMovement(productId, difference, 'AJUSTE', { reason });
    }

    /**
     * Obtener historial de movimientos
     * @param {Object} filters - Filtros opcionales
     * @returns {Array} Lista de movimientos
     */
    getMovements(filters = {}) {
        let filteredMovements = [...this.movements];

        // Filtrar por producto
        if (filters.productId) {
            filteredMovements = filteredMovements.filter(m => m.productId === filters.productId);
        }

        // Filtrar por tipo
        if (filters.type) {
            filteredMovements = filteredMovements.filter(m => m.type === filters.type);
        }

        // Filtrar por rango de fechas
        if (filters.startDate) {
            filteredMovements = filteredMovements.filter(m => m.createdAt >= filters.startDate);
        }

        if (filters.endDate) {
            filteredMovements = filteredMovements.filter(m => m.createdAt <= filters.endDate);
        }

        // Ordenar por fecha (más recientes primero)
        filteredMovements.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // Limitar resultados
        if (filters.limit) {
            filteredMovements = filteredMovements.slice(0, filters.limit);
        }

        return filteredMovements;
    }

    /**
     * Generar reporte de inventario
     * @returns {Object} Reporte de inventario
     */
    generateInventoryReport() {
        const products = this.productModule.getProducts();
        const lowStockProducts = this.productModule.getLowStockProducts();

        return {
            totalProducts: products.length,
            totalValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0),
            lowStockProducts: lowStockProducts.length,
            lowStockItems: lowStockProducts,
            totalMovements: this.movements.length,
            recentMovements: this.getMovements({ limit: 10 }),
            generatedAt: new Date().toISOString()
        };
    }

    /**
     * Generar ID de movimiento
     * @returns {string} ID generado
     */
    generateMovementId() {
        return 'mov_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
    }

    /**
     * Verificar alertas de stock
     * @returns {Array} Productos que requieren atención
     */
    checkStockAlerts() {
        return this.productModule.getLowStockProducts().map(product => ({
            productId: product.id,
            productName: product.name,
            currentStock: product.stock,
            minStock: product.minStock,
            alertLevel: product.stock === 0 ? 'CRITICO' : 'BAJO',
            suggestedOrder: Math.max(product.minStock * 2 - product.stock, 0)
        }));
    }
}

// Exportar para uso en diferentes entornos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InventoryModule;
}
