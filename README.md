# AceroJJ - E-commerce de Productos de Acero

`AceroJJ` es una aplicación web completa de comercio electrónico, diseñada para la venta y gestión de productos de acero. El proyecto incluye un frontend intuitivo para los clientes, un backend robusto para la gestión de datos y un futuro panel de administración para la gestión de inventario y pedidos.

## 🚀 Funcionalidades Principales

- **Catálogo de Productos Dinámico**: Visualización de productos cargados desde la base de datos, con búsqueda y filtros por categoría.
- **Carrito de Compras Funcional**: Añade, actualiza y elimina productos del carrito, con persistencia de datos en el navegador (`localStorage`).
- **Flujo de Compra Completo**: Proceso de checkout desde la selección de productos hasta un formulario de pago simulado.
- **Sistema de Autenticación (Simulado)**: Implementación de lógica de inicio de sesión y registro para diferenciar entre usuarios clientes y administradores.
- **API RESTful**: Backend construido con Node.js y Express para gestionar productos, usuarios, pedidos y más.
- **Base de Datos Relacional**: Uso de PostgreSQL para una gestión de datos estructurada y eficiente.

## 🛠️ Tecnologías Utilizadas

- **Frontend**:
  - HTML5
  - CSS3 y Bootstrap 5
  - JavaScript (ES6+)

- **Backend**:
  - Node.js
  - Express.js
  - CORS

- **Base de Datos**:
  - PostgreSQL

## 📋 Instalación y Puesta en Marcha

Sigue estos pasos para ejecutar el proyecto en tu entorno local.

### Prerrequisitos

- [Node.js](https://nodejs.org/) (versión 14 o superior)
- [PostgreSQL](https://www.postgresql.org/download/) (versión 14 o superior)

### 1. Configuración de la Base de Datos

1.  Abre `psql` o tu cliente de PostgreSQL preferido.
2.  Crea la base de datos:
    ```sql
    CREATE DATABASE proyecto_acero;
    ```
3.  Conéctate a la base de datos recién creada.
4.  Ejecuta el script para crear la estructura de las tablas:
    ```bash
    # Desde la carpeta raíz del proyecto, ejecuta:
    psql -U tu_usuario -d proyecto_acero -f backend/db/schema.sql
    ```
5.  Puebla la base de datos con datos de ejemplo:
    ```bash
    psql -U tu_usuario -d proyecto_acero -f backend/db/test_clean.sql
    ```

### 2. Configuración del Backend

1.  Navega a la carpeta del backend:
    ```bash
    cd backend
    ```
2.  Instala las dependencias:
    ```bash
    npm install
    ```
3.  Crea un archivo `.env` en la raíz de la carpeta `backend/` y configúralo con tus credenciales de PostgreSQL:
    ```env
    DB_USER=postgres
    DB_HOST=localhost
    DB_DATABASE=proyecto_acero
    DB_PASSWORD=tu_contraseña_secreta
    DB_PORT=5432
    ```
4.  Inicia el servidor del backend:
    ```bash
    npm start
    ```
    El servidor estará escuchando en `http://localhost:4000`.

### 3. Ejecución del Frontend

Simplemente abre los archivos HTML (como `index.html`, `productos.html`, etc.) en tu navegador. Para una mejor experiencia y para evitar problemas de CORS, se recomienda usar una extensión como **Live Server** en Visual Studio Code.

