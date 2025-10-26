# Acero JJ - Sistema de Gestión
## Proyecto de Láminas de Acero - SENA

Sistema modular de gestión para comercialización de productos de acero, desarrollado como parte de la actividad **GA7-220501096-AA3-EV01**.

## 🎯 Descripción del Proyecto

Sistema integral que permite gestionar productos, inventario, pedidos y clientes de una empresa de distribución de acero. Incluye módulos para aplicaciones **Stand-alone**, **Web** y **Móvil**.

## 📋 Características

- ✅ Gestión de productos y catálogo
- ✅ Control de inventario y movimientos
- ✅ Sistema de pedidos y ventas
- ✅ Gestión de clientes
- ✅ Autenticación y sesiones
- ✅ Interfaz web responsive
- ✅ Optimizado para dispositivos móviles
- ✅ Validación de formularios
- ✅ Eventos táctiles para móviles

## 🏗️ Estructura del Proyecto

```
proyecto/
├── modules/              # Módulos del software
│   ├── standalone/      # Lógica de negocio (stand-alone)
│   ├── web/            # Módulos web
│   ├── mobile/         # Módulos móviles
│   └── api/            # Capa de servicios
├── config/             # Configuración
├── docs/               # Documentación
├── *.html              # Páginas del sitio web
└── style.css           # Estilos
```

## 🚀 Módulos Implementados

### Stand-alone (Lógica de Negocio)
- **authModule.js** - Autenticación y autorización
- **productModule.js** - Gestión de productos
- **inventoryModule.js** - Control de inventario
- **orderModule.js** - Gestión de pedidos
- **customerModule.js** - Gestión de clientes

### Web (Frontend)
- **authModule.js** - Autenticación en navegador
- **productModule.js** - Productos y carrito
- **formValidation.js** - Validación de formularios

### Móvil
- **mobileUtilities.js** - Utilidades móviles
- **touchEvents.js** - Eventos táctiles

### API
- **apiService.js** - Cliente HTTP y endpoints

## 📖 Documentación

Para documentación completa de los módulos, ver:
- [modules/README.md](modules/README.md) - Guía rápida
- [docs/MODULES.md](docs/MODULES.md) - Documentación detallada
- [config/modules.json](config/modules.json) - Configuración

## 💻 Uso

### Incluir módulos en HTML

```html
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

### Ejemplo de código

```javascript
// Autenticación
const result = await WebAuthModule.login(email, password);

// Cargar productos
await WebProductModule.loadProducts();
WebProductModule.renderProducts('products-container');

// Validar formulario
const validation = WebFormValidation.validateForm(form, rules);
```

## 🎓 Actividad SENA

**Código**: GA7-220501096-AA3-EV01  
**Tema**: Codificación de módulos del software Stand-alone, web y móvil de acuerdo al proyecto a desarrollar  
**Institución**: SENA (Servicio Nacional de Aprendizaje)

## 📱 Páginas del Sistema

- `index.html` - Página principal
- `login.html` - Inicio de sesión
- `registro.html` - Registro de usuarios
- `dashboard.html` - Panel de administración
- `productos.html` - Catálogo de productos
- `inventario.html` - Gestión de inventario
- `pedidos.html` - Gestión de pedidos
- `contacto.html` - Página de contacto
- `sobre-nosotros.html` - Información de la empresa

## 🛠️ Tecnologías

- HTML5
- CSS3
- JavaScript ES6+
- Bootstrap 5
- Module Pattern
- LocalStorage API
- Fetch API

## 📄 Licencia

Proyecto educativo - SENA 2025

---

Desarrollado como parte del programa de formación del SENA
