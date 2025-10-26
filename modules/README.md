# Módulos del Software - Acero JJ
## GA7-220501096-AA3-EV01

Este directorio contiene la codificación de los módulos del software para aplicaciones **Stand-alone**, **Web** y **Móvil** del sistema de gestión Acero JJ.

## 📁 Estructura

```
modules/
├── standalone/          # Módulos stand-alone (lógica de negocio)
├── web/                # Módulos para aplicación web
├── mobile/             # Módulos para dispositivos móviles
└── api/                # Capa de servicios (comunicación)
```

## 🚀 Inicio Rápido

### Para Aplicación Web

Incluir los módulos necesarios en tu HTML:

```html
<!-- En el <head> o antes del </body> -->
<script src="modules/web/authModule.js"></script>
<script src="modules/web/productModule.js"></script>
<script src="modules/web/formValidation.js"></script>
<script src="modules/mobile/mobileUtilities.js"></script>
<script src="modules/api/apiService.js"></script>
```

### Para Aplicación Stand-alone (Node.js)

```javascript
const AuthModule = require('./modules/standalone/authModule.js');
const ProductModule = require('./modules/standalone/productModule.js');

const auth = new AuthModule();
const products = new ProductModule();
```

## 📚 Módulos Disponibles

### Stand-alone (Lógica de Negocio)
- `authModule.js` - Autenticación y autorización
- `productModule.js` - Gestión de productos
- `inventoryModule.js` - Control de inventario
- `orderModule.js` - Gestión de pedidos
- `customerModule.js` - Gestión de clientes

### Web (Frontend)
- `authModule.js` - Autenticación en navegador
- `productModule.js` - Productos y carrito de compras
- `formValidation.js` - Validación de formularios

### Móvil (Dispositivos Móviles)
- `mobileUtilities.js` - Utilidades para móviles
- `touchEvents.js` - Eventos táctiles

### API (Comunicación)
- `apiService.js` - Cliente HTTP y endpoints

## 💡 Ejemplos de Uso

### Autenticación
```javascript
// Login
const result = await WebAuthModule.login(email, password);
if (result.success) {
  window.location.href = 'dashboard.html';
}
```

### Productos
```javascript
// Cargar y mostrar productos
await WebProductModule.loadProducts();
WebProductModule.renderProducts('products-container');
```

### Validación
```javascript
// Validar formulario
const rules = {
  email: { required: true, email: true },
  password: { required: true, password: true }
};
const result = WebFormValidation.validateForm(form, rules);
```

### Eventos Táctiles
```javascript
// Swipe
TouchEventsModule.setupSwipe('#gallery', {
  left: () => nextImage(),
  right: () => prevImage()
});
```

## 📖 Documentación Completa

Ver [docs/MODULES.md](../docs/MODULES.md) para documentación detallada de cada módulo.

## 🎯 Actividad SENA

**Código**: GA7-220501096-AA3-EV01  
**Tema**: Codificación de módulos del software Stand-alone, web y móvil  
**Proyecto**: Sistema de Gestión Acero JJ

---

© 2025 SENA - Todos los derechos reservados
