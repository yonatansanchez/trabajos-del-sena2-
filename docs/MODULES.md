# Documentación de Módulos del Software
# GA7-220501096-AA3-EV01
# Acero JJ - Sistema de Gestión

## Descripción General

Este proyecto implementa una arquitectura modular para el sistema de gestión de productos de acero "Acero JJ". La codificación incluye módulos para aplicaciones **Stand-alone**, **Web** y **Móvil**, cumpliendo con los requerimientos de la actividad GA7-220501096-AA3-EV01 del SENA.

## Estructura del Proyecto

```
proyecto/
├── modules/
│   ├── standalone/      # Módulos stand-alone (lógica de negocio)
│   │   ├── authModule.js
│   │   ├── productModule.js
│   │   ├── inventoryModule.js
│   │   ├── orderModule.js
│   │   └── customerModule.js
│   ├── web/            # Módulos para aplicación web
│   │   ├── authModule.js
│   │   ├── productModule.js
│   │   └── formValidation.js
│   ├── mobile/         # Módulos para dispositivos móviles
│   │   ├── mobileUtilities.js
│   │   └── touchEvents.js
│   └── api/            # Capa de servicios
│       └── apiService.js
├── config/             # Archivos de configuración
│   └── modules.json
└── docs/              # Documentación
    └── MODULES.md
```

## Módulos Stand-alone

Los módulos stand-alone contienen la lógica de negocio principal y pueden ser utilizados tanto en entornos de servidor (Node.js) como en el navegador.

### 1. authModule.js - Módulo de Autenticación

**Funcionalidades:**
- Registro de usuarios
- Inicio y cierre de sesión
- Validación de sesiones
- Recuperación de contraseñas
- Gestión de tokens

**Clases y Métodos:**
```javascript
class AuthModule {
  registerUser(userData)
  login(email, password)
  logout(token)
  validateSession(token)
  recoverPassword(email)
}
```

### 2. productModule.js - Módulo de Productos

**Funcionalidades:**
- CRUD de productos
- Gestión de categorías
- Control de stock
- Búsqueda y filtrado
- Estadísticas

**Clases y Métodos:**
```javascript
class ProductModule {
  createProduct(productData)
  getProducts(filters)
  getProductById(productId)
  updateProduct(productId, updateData)
  deleteProduct(productId)
  getLowStockProducts()
  getStatistics()
}
```

### 3. inventoryModule.js - Módulo de Inventario

**Funcionalidades:**
- Registro de movimientos (entradas/salidas)
- Ajustes de inventario
- Historial de movimientos
- Alertas de stock
- Reportes

**Clases y Métodos:**
```javascript
class InventoryModule {
  registerEntry(productId, quantity, details)
  registerExit(productId, quantity, details)
  adjustInventory(productId, newStock, reason)
  getMovements(filters)
  generateInventoryReport()
  checkStockAlerts()
}
```

### 4. orderModule.js - Módulo de Pedidos

**Funcionalidades:**
- Creación de pedidos
- Confirmación y procesamiento
- Gestión de estados
- Cancelación de pedidos
- Estadísticas de ventas

**Clases y Métodos:**
```javascript
class OrderModule {
  createOrder(orderData)
  confirmOrder(orderId)
  updateOrderStatus(orderId, newStatus)
  cancelOrder(orderId, reason)
  getOrders(filters)
  getStatistics()
}
```

### 5. customerModule.js - Módulo de Clientes

**Funcionalidades:**
- Gestión de clientes
- Tipos de cliente (Minorista/Mayorista/Corporativo)
- Activación/Desactivación
- Búsqueda y filtrado

**Clases y Métodos:**
```javascript
class CustomerModule {
  createCustomer(customerData)
  getCustomers(filters)
  updateCustomer(customerId, updateData)
  deactivateCustomer(customerId)
  activateCustomer(customerId)
  getStatistics()
}
```

## Módulos Web

Los módulos web proporcionan funcionalidad específica para aplicaciones en el navegador.

### 1. authModule.js (Web) - Autenticación Web

**Funcionalidades:**
- Login/Logout en navegador
- Almacenamiento de sesión en localStorage
- Validación de formularios
- Protección de rutas

**API Pública:**
```javascript
WebAuthModule.login(email, password)
WebAuthModule.logout()
WebAuthModule.register(userData)
WebAuthModule.recoverPassword(email)
WebAuthModule.isAuthenticated()
WebAuthModule.requireAuth()
```

### 2. productModule.js (Web) - Productos Web

**Funcionalidades:**
- Renderizado de productos en DOM
- Gestión de carrito de compras
- Filtrado y búsqueda
- Formato de moneda

**API Pública:**
```javascript
WebProductModule.loadProducts(filters)
WebProductModule.renderProducts(containerId, productList)
WebProductModule.addToCart(productId, quantity)
WebProductModule.getCart()
WebProductModule.filterProducts(filters)
```

### 3. formValidation.js - Validación de Formularios

**Funcionalidades:**
- Validación de email, contraseñas, teléfonos
- Validación de campos requeridos
- Validación de números
- Validación de formularios completos
- Mensajes de error en tiempo real

**API Pública:**
```javascript
WebFormValidation.validateEmail(email)
WebFormValidation.validatePassword(password, options)
WebFormValidation.validatePhone(phone)
WebFormValidation.validateForm(form, rules)
WebFormValidation.setupRealtimeValidation(form, rules)
```

## Módulos Móviles

Los módulos móviles proporcionan funcionalidades optimizadas para dispositivos móviles y tablets.

### 1. mobileUtilities.js - Utilidades Móviles

**Funcionalidades:**
- Detección de dispositivos (móvil/tablet/desktop)
- Detección de orientación
- Optimizaciones de viewport
- Scroll suave
- Botón "volver arriba"
- Pull-to-refresh
- Vibración

**API Pública:**
```javascript
MobileUtilities.isMobile()
MobileUtilities.getDeviceType()
MobileUtilities.getOrientation()
MobileUtilities.scrollToTop()
MobileUtilities.addBackToTopButton(options)
MobileUtilities.enablePullToRefresh(callback)
MobileUtilities.vibrate(pattern)
MobileUtilities.initMobileOptimizations()
```

### 2. touchEvents.js - Eventos Táctiles

**Funcionalidades:**
- Gestos swipe (deslizar)
- Tap (toque)
- Long press (presión larga)
- Pinch (pellizco para zoom)
- Drag (arrastrar)
- Scroll horizontal táctil

**API Pública:**
```javascript
TouchEventsModule.setupSwipe(element, callbacks, options)
TouchEventsModule.setupTap(element, callback, options)
TouchEventsModule.setupLongPress(element, callback, options)
TouchEventsModule.setupPinch(element, callbacks)
TouchEventsModule.setupDrag(element, callbacks)
TouchEventsModule.addTouchFeedback(element, activeClass)
```

## Módulo API

### apiService.js - Capa de Servicios

**Funcionalidades:**
- Cliente HTTP para comunicación con backend
- Métodos REST (GET, POST, PUT, DELETE)
- Gestión de tokens de autenticación
- Timeout y manejo de errores
- Endpoints organizados por dominio

**API Pública:**
```javascript
// Métodos HTTP básicos
APIService.get(endpoint, params)
APIService.post(endpoint, data)
APIService.put(endpoint, data)
APIService.delete(endpoint)

// Endpoints de Autenticación
APIService.auth.login(email, password)
APIService.auth.register(userData)
APIService.auth.logout()

// Endpoints de Productos
APIService.products.getAll(filters)
APIService.products.create(productData)
APIService.products.update(id, updateData)

// Endpoints de Inventario
APIService.inventory.registerMovement(movementData)
APIService.inventory.getReport()

// Endpoints de Pedidos
APIService.orders.create(orderData)
APIService.orders.updateStatus(id, status)

// Endpoints de Clientes
APIService.customers.create(customerData)
APIService.customers.getAll(filters)
```

## Uso de los Módulos

### Ejemplo 1: Autenticación Stand-alone

```javascript
// Crear instancia del módulo
const authModule = new AuthModule();

// Registrar usuario
const result = authModule.registerUser({
  email: 'usuario@example.com',
  password: 'password123',
  name: 'Usuario Ejemplo',
  role: 'customer'
});

// Iniciar sesión
const loginResult = authModule.login('usuario@example.com', 'password123');
console.log(loginResult.token);
```

### Ejemplo 2: Autenticación Web

```javascript
// En el navegador
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  const result = await WebAuthModule.login(email, password);
  
  if (result.success) {
    window.location.href = 'dashboard.html';
  } else {
    alert(result.message);
  }
});
```

### Ejemplo 3: Gestión de Productos

```javascript
// Cargar y renderizar productos
async function loadAndDisplayProducts() {
  await WebProductModule.loadProducts();
  WebProductModule.renderProducts('products-container');
}

// Filtrar productos
const filtered = WebProductModule.filterProducts({
  category: 'Varillas',
  inStock: true
});
```

### Ejemplo 4: Validación de Formularios

```javascript
const form = document.getElementById('registroForm');

// Definir reglas de validación
const rules = {
  email: { required: true, email: true, label: 'Email' },
  password: { 
    required: true, 
    password: true, 
    passwordOptions: { minLength: 6 }
  },
  confirmPassword: { 
    required: true, 
    confirmPassword: 'password' 
  }
};

// Configurar validación en tiempo real
WebFormValidation.setupRealtimeValidation(form, rules);

// Validar al enviar
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const result = WebFormValidation.validateForm(form, rules);
  
  if (result.valid) {
    // Procesar formulario
  }
});
```

### Ejemplo 5: Eventos Táctiles Móviles

```javascript
// Configurar swipe en un elemento
TouchEventsModule.setupSwipe('#product-gallery', {
  left: () => console.log('Swipe izquierda - Siguiente'),
  right: () => console.log('Swipe derecha - Anterior')
});

// Configurar long press
TouchEventsModule.setupLongPress('#product-card', (e) => {
  console.log('Presión larga - Mostrar opciones');
});
```

### Ejemplo 6: Utilidades Móviles

```javascript
// Detectar tipo de dispositivo
if (MobileUtilities.isMobile()) {
  console.log('Dispositivo móvil detectado');
  MobileUtilities.initMobileOptimizations();
}

// Agregar botón de volver arriba
MobileUtilities.addBackToTopButton({
  showAfter: 300,
  position: { bottom: '20px', right: '20px' }
});

// Detectar cambio de orientación
MobileUtilities.onOrientationChange((orientation) => {
  console.log('Nueva orientación:', orientation);
});
```

## Integración con HTML

Para usar los módulos en las páginas HTML existentes, agregar las siguientes líneas antes del cierre de `</body>`:

```html
<!-- Módulos Stand-alone (opcional para lógica avanzada) -->
<script src="modules/standalone/authModule.js"></script>
<script src="modules/standalone/productModule.js"></script>

<!-- Módulos Web -->
<script src="modules/web/authModule.js"></script>
<script src="modules/web/productModule.js"></script>
<script src="modules/web/formValidation.js"></script>

<!-- Módulos Móviles -->
<script src="modules/mobile/mobileUtilities.js"></script>
<script src="modules/mobile/touchEvents.js"></script>

<!-- API Service -->
<script src="modules/api/apiService.js"></script>
```

## Arquitectura del Sistema

```
┌─────────────────────────────────────────────┐
│          Interfaz de Usuario (HTML)          │
│     (index.html, login.html, etc.)          │
└──────────────────┬──────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
┌───────▼─────────┐  ┌────────▼────────┐
│  Módulos Web    │  │ Módulos Móviles │
│  - Auth         │  │ - Utilities     │
│  - Products     │  │ - TouchEvents   │
│  - Validation   │  │                 │
└───────┬─────────┘  └────────┬────────┘
        │                     │
        └──────────┬──────────┘
                   │
         ┌─────────▼──────────┐
         │   API Service      │
         │  (Comunicación)    │
         └─────────┬──────────┘
                   │
         ┌─────────▼──────────┐
         │ Módulos Stand-alone│
         │  (Lógica Negocio)  │
         │  - Auth            │
         │  - Products        │
         │  - Inventory       │
         │  - Orders          │
         │  - Customers       │
         └────────────────────┘
```

## Tecnologías Utilizadas

- **JavaScript ES6+**: Módulos modernos con características como clases, arrow functions, async/await
- **Module Pattern**: Patrón de diseño para encapsulación
- **HTML5**: Estructura semántica
- **CSS3/Bootstrap 5**: Estilos y diseño responsive
- **Local Storage**: Almacenamiento de sesión y carrito
- **Fetch API**: Comunicación HTTP

## Características Principales

1. **Modularidad**: Cada módulo tiene una responsabilidad específica
2. **Reutilización**: Los módulos pueden usarse en diferentes contextos
3. **Escalabilidad**: Fácil agregar nuevos módulos o funcionalidades
4. **Compatibilidad**: Funciona en navegadores modernos y dispositivos móviles
5. **Mantenibilidad**: Código organizado y bien documentado

## Próximos Pasos

Para implementar un backend completo:
1. Configurar un servidor (Node.js/Express, Python/Flask, etc.)
2. Conectar con base de datos (MySQL, MongoDB, PostgreSQL)
3. Implementar los endpoints de la API
4. Actualizar APIService con la URL real del backend
5. Agregar autenticación JWT o similar

---

**Proyecto**: Acero JJ - Sistema de Gestión  
**Actividad**: GA7-220501096-AA3-EV01  
**Institución**: SENA  
**Versión**: 1.0.0
