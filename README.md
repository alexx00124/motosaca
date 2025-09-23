# motosaca
paguina de motos
# 🛒 Tienda Virtual Backend - Node.js + Express + SQLite

Backend API para tienda virtual migrada de PHP a Node.js con estructura MVC.

## 📋 Características

- ✅ **Express.js** como servidor web
- ✅ **SQLite** como base de datos
- ✅ **bcrypt** para hash de contraseñas
- ✅ **Estructura MVC** (Model-View-Controller)
- ✅ **Validaciones** de entrada
- ✅ **Manejo de errores** centralizado
- ✅ **CORS** habilitado

## 🗂️ Estructura del proyecto

```
backend/
├── src/
│   ├── config/db.js              # Conexión SQLite
│   ├── models/                   # Representaciones de tablas
│   │   ├── User.js
│   │   ├── Catalog.js
│   │   └── Sale.js
│   ├── controllers/              # Lógica de negocio
│   │   ├── authController.js
│   │   ├── catalogController.js
│   │   └── salesController.js
│   ├── routes/                   # Endpoints de la API
│   │   ├── authRoutes.js
│   │   ├── catalogRoutes.js
│   │   └── salesRoutes.js
│   ├── middleware/validate.js    # Validaciones y middlewares
│   └── app.js                    # Servidor principal
├── package.json
└── tienda_virtual.db             # Archivo SQLite (se crea automáticamente)
```

## 🚀 Instalación y configuración

### 1. Instalar dependencias

```bash
npm install
```

### 2. Iniciar el servidor

**Modo desarrollo (con nodemon):**
```bash
npm run dev
```

**Modo producción:**
```bash
npm start
```

El servidor se ejecutará en `http://localhost:3000`

### 3. Base de datos

La base de datos SQLite se crea automáticamente en `tienda_virtual.db` al iniciar el servidor por primera vez, incluyendo:

- **Tablas**: `users`, `catalog`, `sales`
- **Productos de ejemplo** para pruebas

## 📡 Endpoints de la API

### 🔐 Autenticación (`/api/auth`)

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Registrar usuario | `{ "name": "usuario", "password": "123456" }` |
| POST | `/api/auth/login` | Login de usuario | `{ "name": "usuario", "password": "123456" }` |
| GET | `/api/auth/user/:id` | Obtener usuario por ID | - |

### 🛍️ Catálogo (`/api/catalog`)

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| GET | `/api/catalog` | Obtener todos los productos | - |
| GET | `/api/catalog/:id` | Obtener producto por ID | - |
| POST | `/api/catalog` | Crear producto | `{ "name": "Producto", "price": 29.99, "description": "...", "image": "..." }` |
| PUT | `/api/catalog/:id` | Actualizar producto | `{ "name": "Producto", "price": 29.99, ... }` |
| DELETE | `/api/catalog/:id` | Eliminar producto | - |

### 💰 Ventas (`/api/sales`)

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| POST | `/api/sales` | Registrar venta | `{ "user_id": 1, "products": [{"id": 1, "quantity": 2}] }` |
| GET | `/api/sales` | Obtener todas las ventas | - |
| GET | `/api/sales/:id` | Obtener venta por ID | - |
| GET | `/api/sales/user/:userId` | Obtener ventas de un usuario | - |
| GET | `/api/sales/stats` | Obtener estadísticas de ventas | - |

## 🧪 Ejemplos de uso

### Registrar usuario
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "juan", "password": "123456"}'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"name": "juan", "password": "123456"}'
```

### Obtener productos
```bash
curl http://localhost:3000/api/catalog
```

### Registrar venta
```bash
curl -X POST http://localhost:3000/api/sales \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "products": [
      {"id": 1, "quantity": 2},
      {"id": 2, "quantity": 1}
    ]
  }'
```

## 🗄️ Esquema de base de datos

### Tabla `users`
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Tabla `catalog`
```sql
CREATE TABLE catalog (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  image TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Tabla `sales`
```sql
CREATE TABLE sales (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id)
);
```

## 🔧 Personalización

### Cambiar puerto
Modifica el archivo `src/app.js` o usa variable de entorno:
```bash
PORT=8000 npm start
```

### Configurar base de datos
Edita `src/config/db.js` para cambiar la ubicación del archivo SQLite.

## 📝 Notas importantes

1. **Contraseñas**: Se usan hashes bcrypt (reemplaza MD5 de PHP)
2. **Validaciones**: Middleware de validación en todas las rutas
3. **Errores**: Manejo centralizado de errores
4. **CORS**: Habilitado para desarrollo frontend
5. **Logging**: Todas las peticiones se registran en consola

## 🐛 Solución de problemas

### Error "Cannot find module"
```bash
rm -rf node_modules
npm install
```

### Error de permisos SQLite
```bash
chmod 664 tienda_virtual.db
```

### Puerto en uso
Cambia el puerto en `src/app.js` o usa:
```bash
PORT=4000 npm start
```

## 🚀 Próximos pasos

1. **Autenticación JWT**: Implementar tokens para sesiones
2. **Middleware de autenticación**: Proteger rutas privadas
3. **Paginación**: Para listados grandes
4. **Subida de archivos**: Para imágenes de productos
5. **Tests**: Implementar pruebas unitarias e integración