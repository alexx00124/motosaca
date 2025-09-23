const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');
const { validateSale, validateId } = require('../middleware/validate');

// POST /api/sales - Crear nueva venta
router.post('/', validateSale, salesController.createSale);

// GET /api/sales/stats - Obtener estadísticas de ventas (DEBE IR ANTES de /:id)
router.get('/stats', salesController.getSalesStats);

// GET /api/sales - Obtener todas las ventas
router.get('/', salesController.getAllSales);

// GET /api/sales/user/:userId - Obtener ventas por usuario
router.get('/user/:userId', validateId, salesController.getSalesByUser);

// GET /api/sales/:id - Obtener venta por ID (DEBE IR AL FINAL)
router.get('/:id', validateId, salesController.getSaleById);

// Puedes quitar estos console.log después de probar
console.log("createSale es:", typeof salesController.createSale);
console.log("validateSale es:", typeof validateSale);

module.exports = router;