const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Importar middlewares
const { logger, notFound, errorHandler } = require('./middleware/validate');

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const catalogRoutes = require('./routes/catalogRoutes');
const salesRoutes = require('./routes/salesRoutes');

// Crear aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(cors()); // Permitir CORS para todas las rutas
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(logger); // Log de todas las peticiones

// Ruta de salud del servidor
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API Tienda Virtual - Backend funcionando correctamente',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        user: 'GET /api/auth/user/:id'
      },
      catalog: {
        getAll: 'GET /api/catalog',
        getById: 'GET /api/catalog/:id',
        create: 'POST /api/catalog',
        update: 'PUT /api/catalog/:id',
        delete: 'DELETE /api/catalog/:id'
      },
      sales: {
        create: 'POST /api/sales',
        getAll: 'GET /api/sales',
        getById: 'GET /api/sales/:id',
        getByUser: 'GET /api/sales/user/:userId',
        getStats: 'GET /api/sales/stats'
      }
    }
  });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/catalog', catalogRoutes);
app.use('/api/sales', salesRoutes);

// Middleware para rutas no encontradas
app.use(notFound);

// Middleware para manejo de errores
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📊 Base de datos: tienda_virtual.db`);
  console.log(`📖 Documentación API disponible en: http://localhost:${PORT}`);
});

module.exports = app;