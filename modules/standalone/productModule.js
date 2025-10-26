/**
 * Módulo de Productos (Product Management Module)
 * Gestiona el catálogo de productos de acero
 * GA7-220501096-AA3-EV01
 */

class ProductModule {
    constructor() {
        this.products = [];
        this.categories = ['Varillas', 'Láminas', 'Perfiles', 'Tubos', 'Accesorios'];
        this.initializeDefaultProducts();
    }

    /**
     * Inicializar productos por defecto
     */
    initializeDefaultProducts() {
        const defaultProducts = [
            {
                id: 'prod_001',
                name: 'Varillas de Acero Corrugado',
                category: 'Varillas',
                description: 'Varillas corrugadas de alta resistencia para construcción',
                price: 25000,
                unit: 'kg',
                stock: 5000,
                minStock: 500,
                image: 'varillas.jpg'
            },
            {
                id: 'prod_002',
                name: 'Láminas de Acero Galvanizado',
                category: 'Láminas',
                description: 'Láminas galvanizadas resistentes a la corrosión',
                price: 45000,
                unit: 'm²',
                stock: 1200,
                minStock: 200,
                image: 'laminas.jpg'
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
                image: 'perfiles.jpg'
            }
        ];

        this.products = defaultProducts;
    }

    /**
     * Crear un nuevo producto
     * @param {Object} productData - Datos del producto
     * @returns {Object} Resultado de la operación
     */
    createProduct(productData) {
        const { name, category, description, price, unit, stock, minStock, image } = productData;

        // Validar datos obligatorios
        if (!name || !category || !price || !unit) {
            return { success: false, message: 'Datos incompletos' };
        }

        // Validar categoría
        if (!this.categories.includes(category)) {
            return { success: false, message: 'Categoría no válida' };
        }

        const product = {
            id: this.generateProductId(),
            name,
            category,
            description: description || '',
            price: parseFloat(price),
            unit,
            stock: parseInt(stock) || 0,
            minStock: parseInt(minStock) || 0,
            image: image || 'default.jpg',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.products.push(product);
        return { success: true, message: 'Producto creado exitosamente', product };
    }

    /**
     * Obtener todos los productos
     * @param {Object} filters - Filtros opcionales
     * @returns {Array} Lista de productos
     */
    getProducts(filters = {}) {
        let filteredProducts = [...this.products];

        // Filtrar por categoría
        if (filters.category) {
            filteredProducts = filteredProducts.filter(p => p.category === filters.category);
        }

        // Filtrar por búsqueda de texto
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            filteredProducts = filteredProducts.filter(p =>
                p.name.toLowerCase().includes(searchTerm) ||
                p.description.toLowerCase().includes(searchTerm)
            );
        }

        // Filtrar por stock bajo
        if (filters.lowStock) {
            filteredProducts = filteredProducts.filter(p => p.stock <= p.minStock);
        }

        return filteredProducts;
    }

    /**
     * Obtener un producto por ID
     * @param {string} productId - ID del producto
     * @returns {Object} Producto encontrado o null
     */
    getProductById(productId) {
        return this.products.find(p => p.id === productId) || null;
    }

    /**
     * Actualizar un producto
     * @param {string} productId - ID del producto
     * @param {Object} updateData - Datos a actualizar
     * @returns {Object} Resultado de la operación
     */
    updateProduct(productId, updateData) {
        const productIndex = this.products.findIndex(p => p.id === productId);

        if (productIndex === -1) {
            return { success: false, message: 'Producto no encontrado' };
        }

        // Actualizar solo campos permitidos
        const allowedFields = ['name', 'category', 'description', 'price', 'unit', 'stock', 'minStock', 'image'];
        const updates = {};

        allowedFields.forEach(field => {
            if (updateData[field] !== undefined) {
                updates[field] = updateData[field];
            }
        });

        this.products[productIndex] = {
            ...this.products[productIndex],
            ...updates,
            updatedAt: new Date().toISOString()
        };

        return { success: true, message: 'Producto actualizado', product: this.products[productIndex] };
    }

    /**
     * Eliminar un producto
     * @param {string} productId - ID del producto
     * @returns {Object} Resultado de la operación
     */
    deleteProduct(productId) {
        const productIndex = this.products.findIndex(p => p.id === productId);

        if (productIndex === -1) {
            return { success: false, message: 'Producto no encontrado' };
        }

        this.products.splice(productIndex, 1);
        return { success: true, message: 'Producto eliminado' };
    }

    /**
     * Obtener productos con stock bajo
     * @returns {Array} Productos con stock bajo
     */
    getLowStockProducts() {
        return this.products.filter(p => p.stock <= p.minStock);
    }

    /**
     * Generar ID de producto
     * @returns {string} ID generado
     */
    generateProductId() {
        const count = this.products.length + 1;
        return `prod_${String(count).padStart(3, '0')}`;
    }

    /**
     * Obtener estadísticas de productos
     * @returns {Object} Estadísticas
     */
    getStatistics() {
        return {
            totalProducts: this.products.length,
            lowStockProducts: this.getLowStockProducts().length,
            totalValue: this.products.reduce((sum, p) => sum + (p.price * p.stock), 0),
            categories: this.categories.length
        };
    }
}

// Exportar para uso en diferentes entornos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProductModule;
}
