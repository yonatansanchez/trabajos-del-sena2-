# Backend API - Proyecto Láminas de Acero

API REST construida con Node.js, Express y PostgreSQL para soportar catálogo, inventario, pedidos y pagos con Stripe.

## Requisitos

- Node.js 18+
- PostgreSQL 14+
- Cuenta de Stripe (modo prueba) para pagos

## Configuración

1. Duplicar `.env.example` en `.env` y ajustar variables:

```bash
cp .env.example .env
```

2. Crear base de datos y ejecutar `db/schema.sql`:

```sql
CREATE DATABASE proyecto_acero;
\c proyecto_acero
\i db/schema.sql
```

3. Instalar dependencias e iniciar en modo desarrollo:

```bash
npm install
npm run dev
```

La API escuchará en `http://localhost:4000`.

## Endpoints principales

- `POST /api/auth/register` – Registro de clientes
- `POST /api/auth/login` – Inicio de sesión (JWT)
- `GET /api/products` – Catálogo público
- `POST /api/products` – Crear producto (rol `admin` o `manager`)
- `POST /api/inventory` – Registrar movimiento de inventario (rol `admin`/`manager`)
- `POST /api/orders` – Crear pedido para el usuario autenticado
- `POST /api/payments/intent` – Generar PaymentIntent de Stripe
- `POST /api/payments/confirm` – Confirmar cobro y marcar pedido como pagado

Consulta `src/routes` para ver cada recurso y sus middleware.

## Integración con el frontend

- Ajusta las llamadas del frontend a la URL base `http://localhost:4000/api`.
- Al autenticar, guarda el token JWT en `localStorage` y envíalo en `Authorization: Bearer <token>`.
- Para pagos, utiliza el `clientSecret` devuelto por `/api/payments/intent` con Stripe.js en el frontend.

## Scripts útiles

- `npm run dev` – Inicia servidor con recarga automática
- `npm start` – Inicia servidor en modo producción
- `npm run lint` – Ejecuta ESLint sobre `src/`

## Roles sugeridos

- `admin`: CRUD completo, gestión inventario, pedidos y usuarios.
- `manager`: CRUD productos/inventario y seguimiento pedidos.
- `customer`: Comprar, ver pedidos propios.

Ajusta la asignación de roles en `db/schema.sql` o al crear usuarios manualmente.
