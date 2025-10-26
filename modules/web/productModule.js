/**
 * Módulo Web de Productos (Web Product Module)
 * Maneja la visualización y gestión de productos en el navegador
 * GA7-220501096-AA3-EV01
 */

const WebProductModule = (function() {
    'use strict';

    let products = [];

    /**
     * Cargar productos desde la API
     * @param {Object} filters - Filtros opcionales
     * @returns {Promise<Array>} Lista de productos
     */
    async function loadProducts(filters = {}) {
        try {
            // En producción, hacer fetch a la API
            const response = await simulateAPICall('/api/products', { filters });
            products = response.data || [];
            return products;
        } catch (error) {
            console.error('Error al cargar productos:', error);
            return [];
        }
    }

    /**
     * Renderizar productos en el DOM
     * @param {string} containerId - ID del contenedor
     * @param {Array} productList - Lista de productos
     */
    function renderProducts(containerId, productList = products) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = '';

        if (productList.length === 0) {
            container.innerHTML = '<p class="text-center">No hay productos disponibles</p>';
            return;
        }

        productList.forEach(product => {
            const productCard = createProductCard(product);
            container.appendChild(productCard);
        });
    }

    /**
     * Crear tarjeta de producto
     * @param {Object} product - Datos del producto
     * @returns {HTMLElement} Elemento DOM
     */
    function createProductCard(product) {
        const col = document.createElement('div');
        col.className = 'col-md-4 mb-4';

        const stockClass = product.stock > product.minStock ? 'text-success' : 'text-warning';
        const stockText = product.stock > 0 ? `${product.stock} ${product.unit} disponibles` : 'Sin stock';

        col.innerHTML = `
            <div class="card h-100">
                <img src="${product.image || 'https://via.placeholder.com/300'}" 
                     class="card-img-top" 
                     alt="${product.name}">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">${product.description}</p>
                    <p class="card-text">
                        <strong>Categoría:</strong> ${product.category}<br>
                        <strong>Precio:</strong> $${formatCurrency(product.price)} / ${product.unit}<br>
                        <span class="${stockClass}"><strong>Stock:</strong> ${stockText}</span>
                    </p>
                </div>
                <div class="card-footer">
                    <button class="btn btn-primary w-100" 
                            onclick="WebProductModule.addToCart('${product.id}')"
                            ${product.stock === 0 ? 'disabled' : ''}>
                        ${product.stock > 0 ? 'Agregar al Pedido' : 'Sin Stock'}
                    </button>
                </div>
            </div>
        `;

        return col;
    }

    /**
     * Filtrar productos
     * @param {Object} filters - Filtros a aplicar
     */
    function filterProducts(filters) {
        let filtered = [...products];

        if (filters.category && filters.category !== 'all') {
            filtered = filtered.filter(p => p.category === filters.category);
        }

        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(searchTerm) ||
                p.description.toLowerCase().includes(searchTerm)
            );
        }

        if (filters.inStock) {
            filtered = filtered.filter(p => p.stock > 0);
        }

        return filtered;
    }

    /**
     * Obtener producto por ID
     * @param {string} productId - ID del producto
     * @returns {Object|null} Producto encontrado
     */
    function getProduct(productId) {
        return products.find(p => p.id === productId) || null;
    }

    /**
     * Agregar producto al carrito
     * @param {string} productId - ID del producto
     * @param {number} quantity - Cantidad
     */
    function addToCart(productId, quantity = 1) {
        const product = getProduct(productId);
        if (!product) {
            showNotification('Producto no encontrado', 'error');
            return;
        }

        if (product.stock < quantity) {
            showNotification('Stock insuficiente', 'warning');
            return;
        }

        // Obtener carrito actual
        const cart = getCart();
        
        // Buscar si el producto ya está en el carrito
        const existingItem = cart.find(item => item.productId === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                productId: product.id,
                name: product.name,
                price: product.price,
                unit: product.unit,
                quantity: quantity
            });
        }

        saveCart(cart);
        showNotification('Producto agregado al carrito', 'success');
        updateCartBadge();
    }

    /**
     * Obtener carrito de compras
     * @returns {Array} Items del carrito
     */
    function getCart() {
        const cartData = localStorage.getItem('acero_jj_cart');
        return cartData ? JSON.parse(cartData) : [];
    }

    /**
     * Guardar carrito
     * @param {Array} cart - Items del carrito
     */
    function saveCart(cart) {
        localStorage.setItem('acero_jj_cart', JSON.stringify(cart));
    }

    /**
     * Actualizar badge del carrito
     */
    function updateCartBadge() {
        const cart = getCart();
        const badge = document.getElementById('cart-badge');
        if (badge) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            badge.textContent = totalItems;
            badge.style.display = totalItems > 0 ? 'inline' : 'none';
        }
    }

    /**
     * Formatear moneda
     * @param {number} amount - Cantidad
     * @returns {string} Cantidad formateada
     */
    function formatCurrency(amount) {
        return new Intl.NumberFormat('es-CO', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    /**
     * Mostrar notificación
     * @param {string} message - Mensaje
     * @param {string} type - Tipo de notificación
     */
    function showNotification(message, type = 'info') {
        // Implementación simple - en producción usar biblioteca como toastr
        alert(message);
    }

    /**
     * Simular llamada a API
     * @param {string} endpoint - Endpoint
     * @param {Object} options - Opciones
     * @returns {Promise<Object>} Respuesta
     */
    async function simulateAPICall(endpoint, options = {}) {
        await new Promise(resolve => setTimeout(resolve, 300));

        if (endpoint === '/api/products') {
            return {
                success: true,
                data: [
                    {
                        id: 'prod_001',
                        name: 'Varillas de Acero Corrugado',
                        category: 'Varillas',
                        description: 'Varillas corrugadas de alta resistencia',
                        price: 25000,
                        unit: 'kg',
                        stock: 5000,
                        minStock: 500,
                        image: 'https://via.placeholder.com/300'
                    },
                    {
                        id: 'prod_002',
                        name: 'Láminas de Acero Galvanizado',
                        category: 'Láminas',
                        description: 'Láminas galvanizadas resistentes',
                        price: 45000,
                        unit: 'm²',
                        stock: 1200,
                        minStock: 200,
                        image: 'https://via.placeholder.com/300'
                    },
                    {
                        id: 'prod_003',
                        name: 'Perfiles IPE',
                        category: 'Perfiles',
                        description: 'Perfiles estructurales tipo IPE',
                        price: 35000,
                        unit: 'kg',
                        stock: 800,
                        minStock: 100,
                        image: 'https://via.placeholder.com/300'
                    }
                ]
            };
        }

        return { success: false, data: [] };
    }

    // API pública
    return {
        loadProducts,
        renderProducts,
        filterProducts,
        getProduct,
        addToCart,
        getCart,
        saveCart,
        updateCartBadge,
        formatCurrency
    };
})();

// Exportar para uso en diferentes entornos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WebProductModule;
}
