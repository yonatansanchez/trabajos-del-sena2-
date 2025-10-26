/**
 * Tests Básicos para Módulos
 * GA7-220501096-AA3-EV01
 * 
 * Ejecutar con Node.js para validar módulos stand-alone
 */

// Cargar módulos stand-alone
const AuthModule = require('./modules/standalone/authModule.js');
const ProductModule = require('./modules/standalone/productModule.js');
const InventoryModule = require('./modules/standalone/inventoryModule.js');
const OrderModule = require('./modules/standalone/orderModule.js');
const CustomerModule = require('./modules/standalone/customerModule.js');

console.log('=== PRUEBAS DE MÓDULOS - GA7-220501096-AA3-EV01 ===\n');

let testsPassed = 0;
let testsFailed = 0;

function test(name, fn) {
    try {
        fn();
        console.log(`✓ ${name}`);
        testsPassed++;
    } catch (error) {
        console.log(`✗ ${name}`);
        console.log(`  Error: ${error.message}`);
        testsFailed++;
    }
}

// === Tests de Autenticación ===
console.log('\n--- Módulo de Autenticación ---');

const authModule = new AuthModule();

test('Registrar usuario nuevo', () => {
    const result = authModule.registerUser({
        email: 'test@example.com',
        password: 'password123',
        name: 'Usuario Test',
        role: 'customer'
    });
    if (!result.success) throw new Error('No se pudo registrar usuario');
});

test('Login con credenciales correctas', () => {
    const result = authModule.login('test@example.com', 'password123');
    if (!result.success) throw new Error('Login fallido');
    if (!result.token) throw new Error('No se generó token');
});

test('Login con credenciales incorrectas', () => {
    const result = authModule.login('test@example.com', 'wrongpassword');
    if (result.success) throw new Error('Login debería haber fallado');
});

test('Validar sesión existente', () => {
    const loginResult = authModule.login('test@example.com', 'password123');
    const validation = authModule.validateSession(loginResult.token);
    if (!validation.valid) throw new Error('Sesión no válida');
});

// === Tests de Productos ===
console.log('\n--- Módulo de Productos ---');

const productModule = new ProductModule();

test('Productos por defecto cargados', () => {
    const products = productModule.getProducts();
    if (products.length === 0) throw new Error('No hay productos');
});

test('Crear producto nuevo', () => {
    const result = productModule.createProduct({
        name: 'Producto Test',
        category: 'Varillas',
        description: 'Descripción test',
        price: 10000,
        unit: 'kg',
        stock: 100,
        minStock: 10
    });
    if (!result.success) throw new Error('No se pudo crear producto');
});

test('Buscar producto por ID', () => {
    const products = productModule.getProducts();
    const product = productModule.getProductById(products[0].id);
    if (!product) throw new Error('Producto no encontrado');
});

test('Filtrar productos por categoría', () => {
    const filtered = productModule.getProducts({ category: 'Varillas' });
    if (filtered.length === 0) throw new Error('No se encontraron productos');
});

test('Actualizar producto', () => {
    const products = productModule.getProducts();
    const result = productModule.updateProduct(products[0].id, { price: 30000 });
    if (!result.success) throw new Error('No se pudo actualizar producto');
});

// === Tests de Inventario ===
console.log('\n--- Módulo de Inventario ---');

const inventoryModule = new InventoryModule(productModule);

test('Registrar entrada de inventario', () => {
    const products = productModule.getProducts();
    const result = inventoryModule.registerEntry(products[0].id, 100, { reason: 'Compra' });
    if (!result.success) throw new Error('No se pudo registrar entrada');
});

test('Registrar salida de inventario', () => {
    const products = productModule.getProducts();
    const result = inventoryModule.registerExit(products[0].id, 50, { reason: 'Venta' });
    if (!result.success) throw new Error('No se pudo registrar salida');
});

test('Obtener movimientos de inventario', () => {
    const movements = inventoryModule.getMovements();
    if (movements.length === 0) throw new Error('No hay movimientos registrados');
});

test('Generar reporte de inventario', () => {
    const report = inventoryModule.generateInventoryReport();
    if (!report.totalProducts) throw new Error('Reporte incompleto');
});

// === Tests de Pedidos ===
console.log('\n--- Módulo de Pedidos ---');

const orderModule = new OrderModule(productModule, inventoryModule);

test('Crear pedido', () => {
    const products = productModule.getProducts();
    const result = orderModule.createOrder({
        customerId: 'cust_001',
        customerName: 'Cliente Test',
        items: [
            { productId: products[0].id, quantity: 10 }
        ],
        shippingAddress: 'Dirección test'
    });
    if (!result.success) throw new Error('No se pudo crear pedido');
});

test('Confirmar pedido', () => {
    const orders = orderModule.getOrders();
    const result = orderModule.confirmOrder(orders[0].id);
    if (!result.success) throw new Error('No se pudo confirmar pedido');
});

test('Obtener estadísticas de pedidos', () => {
    const stats = orderModule.getStatistics();
    if (stats.totalOrders === 0) throw new Error('No hay estadísticas');
});

// === Tests de Clientes ===
console.log('\n--- Módulo de Clientes ---');

const customerModule = new CustomerModule();

test('Crear cliente', () => {
    const result = customerModule.createCustomer({
        name: 'Cliente Test',
        email: 'cliente@example.com',
        phone: '3001234567',
        address: 'Dirección test',
        identificationType: 'CC',
        identificationNumber: '1234567890',
        customerType: 'MINORISTA'
    });
    if (!result.success) throw new Error('No se pudo crear cliente');
});

test('Buscar cliente por ID', () => {
    const customers = customerModule.getCustomers();
    const customer = customerModule.getCustomerById(customers[0].id);
    if (!customer) throw new Error('Cliente no encontrado');
});

test('Actualizar cliente', () => {
    const customers = customerModule.getCustomers();
    const result = customerModule.updateCustomer(customers[0].id, { phone: '3009876543' });
    if (!result.success) throw new Error('No se pudo actualizar cliente');
});

test('Desactivar cliente', () => {
    const customers = customerModule.getCustomers();
    const result = customerModule.deactivateCustomer(customers[0].id);
    if (!result.success) throw new Error('No se pudo desactivar cliente');
});

// === Resumen ===
console.log('\n=== RESUMEN DE PRUEBAS ===');
console.log(`Total de pruebas: ${testsPassed + testsFailed}`);
console.log(`✓ Pasadas: ${testsPassed}`);
console.log(`✗ Fallidas: ${testsFailed}`);

if (testsFailed === 0) {
    console.log('\n✓ TODOS LOS MÓDULOS FUNCIONAN CORRECTAMENTE');
    process.exit(0);
} else {
    console.log('\n✗ ALGUNOS TESTS FALLARON');
    process.exit(1);
}
