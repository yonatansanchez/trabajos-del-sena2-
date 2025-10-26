/**
 * Módulo de Pedidos (Order Management Module)
 * Gestiona los pedidos de clientes
 * GA7-220501096-AA3-EV01
 */

class OrderModule {
    constructor(productModule, inventoryModule) {
        this.productModule = productModule;
        this.inventoryModule = inventoryModule;
        this.orders = [];
        this.orderStatus = ['PENDIENTE', 'CONFIRMADO', 'EN_PROCESO', 'ENVIADO', 'ENTREGADO', 'CANCELADO'];
    }

    /**
     * Crear un nuevo pedido
     * @param {Object} orderData - Datos del pedido
     * @returns {Object} Resultado de la operación
     */
    createOrder(orderData) {
        const { customerId, customerName, items, shippingAddress, notes } = orderData;

        // Validar datos
        if (!customerId || !items || items.length === 0) {
            return { success: false, message: 'Datos incompletos' };
        }

        // Validar items y calcular total
        let total = 0;
        const validatedItems = [];

        for (const item of items) {
            const product = this.productModule.getProductById(item.productId);

            if (!product) {
                return { success: false, message: `Producto ${item.productId} no encontrado` };
            }

            if (product.stock < item.quantity) {
                return { success: false, message: `Stock insuficiente para ${product.name}` };
            }

            const itemTotal = product.price * item.quantity;
            validatedItems.push({
                productId: product.id,
                productName: product.name,
                quantity: item.quantity,
                unitPrice: product.price,
                unit: product.unit,
                subtotal: itemTotal
            });

            total += itemTotal;
        }

        // Crear pedido
        const order = {
            id: this.generateOrderId(),
            customerId,
            customerName,
            items: validatedItems,
            subtotal: total,
            tax: total * 0.19, // IVA 19%
            total: total * 1.19,
            status: 'PENDIENTE',
            shippingAddress: shippingAddress || '',
            notes: notes || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.orders.push(order);

        return {
            success: true,
            message: 'Pedido creado exitosamente',
            order
        };
    }

    /**
     * Confirmar pedido y descontar inventario
     * @param {string} orderId - ID del pedido
     * @returns {Object} Resultado de la operación
     */
    confirmOrder(orderId) {
        const order = this.getOrderById(orderId);

        if (!order) {
            return { success: false, message: 'Pedido no encontrado' };
        }

        if (order.status !== 'PENDIENTE') {
            return { success: false, message: 'El pedido no está pendiente' };
        }

        // Descontar inventario
        for (const item of order.items) {
            const result = this.inventoryModule.registerExit(
                item.productId,
                item.quantity,
                { reason: `Pedido ${orderId}`, reference: orderId }
            );

            if (!result.success) {
                return { success: false, message: `Error al descontar inventario: ${result.message}` };
            }
        }

        // Actualizar estado
        return this.updateOrderStatus(orderId, 'CONFIRMADO');
    }

    /**
     * Actualizar estado del pedido
     * @param {string} orderId - ID del pedido
     * @param {string} newStatus - Nuevo estado
     * @returns {Object} Resultado de la operación
     */
    updateOrderStatus(orderId, newStatus) {
        const orderIndex = this.orders.findIndex(o => o.id === orderId);

        if (orderIndex === -1) {
            return { success: false, message: 'Pedido no encontrado' };
        }

        if (!this.orderStatus.includes(newStatus)) {
            return { success: false, message: 'Estado no válido' };
        }

        this.orders[orderIndex].status = newStatus;
        this.orders[orderIndex].updatedAt = new Date().toISOString();

        return {
            success: true,
            message: `Estado actualizado a ${newStatus}`,
            order: this.orders[orderIndex]
        };
    }

    /**
     * Cancelar pedido
     * @param {string} orderId - ID del pedido
     * @param {string} reason - Razón de cancelación
     * @returns {Object} Resultado de la operación
     */
    cancelOrder(orderId, reason = '') {
        const order = this.getOrderById(orderId);

        if (!order) {
            return { success: false, message: 'Pedido no encontrado' };
        }

        if (['ENTREGADO', 'CANCELADO'].includes(order.status)) {
            return { success: false, message: 'El pedido no puede ser cancelado' };
        }

        // Si estaba confirmado, devolver al inventario
        if (order.status !== 'PENDIENTE') {
            for (const item of order.items) {
                this.inventoryModule.registerEntry(
                    item.productId,
                    item.quantity,
                    { reason: `Cancelación pedido ${orderId}`, reference: orderId }
                );
            }
        }

        const orderIndex = this.orders.findIndex(o => o.id === orderId);
        this.orders[orderIndex].status = 'CANCELADO';
        this.orders[orderIndex].cancellationReason = reason;
        this.orders[orderIndex].updatedAt = new Date().toISOString();

        return { success: true, message: 'Pedido cancelado', order: this.orders[orderIndex] };
    }

    /**
     * Obtener pedido por ID
     * @param {string} orderId - ID del pedido
     * @returns {Object} Pedido encontrado o null
     */
    getOrderById(orderId) {
        return this.orders.find(o => o.id === orderId) || null;
    }

    /**
     * Obtener todos los pedidos
     * @param {Object} filters - Filtros opcionales
     * @returns {Array} Lista de pedidos
     */
    getOrders(filters = {}) {
        let filteredOrders = [...this.orders];

        // Filtrar por cliente
        if (filters.customerId) {
            filteredOrders = filteredOrders.filter(o => o.customerId === filters.customerId);
        }

        // Filtrar por estado
        if (filters.status) {
            filteredOrders = filteredOrders.filter(o => o.status === filters.status);
        }

        // Ordenar por fecha (más recientes primero)
        filteredOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        return filteredOrders;
    }

    /**
     * Generar ID de pedido
     * @returns {string} ID generado
     */
    generateOrderId() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substr(2, 4).toUpperCase();
        return `ORD-${timestamp}-${random}`;
    }

    /**
     * Obtener estadísticas de pedidos
     * @returns {Object} Estadísticas
     */
    getStatistics() {
        const totalOrders = this.orders.length;
        const totalSales = this.orders
            .filter(o => o.status !== 'CANCELADO')
            .reduce((sum, o) => sum + o.total, 0);

        const ordersByStatus = {};
        this.orderStatus.forEach(status => {
            ordersByStatus[status] = this.orders.filter(o => o.status === status).length;
        });

        return {
            totalOrders,
            totalSales,
            averageOrderValue: totalOrders > 0 ? totalSales / totalOrders : 0,
            ordersByStatus
        };
    }
}

// Exportar para uso en diferentes entornos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OrderModule;
}
