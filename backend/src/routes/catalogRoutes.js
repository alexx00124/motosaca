const express = require('express');
const router = express.Router();
const catalogController = require('../controllers/catalogController');
const { validateId } = require('../middleware/validate');

// GET /api/catalog - Obtener todos los productos
router.get('/', catalogController.getAllProducts);

// GET /api/catalog/:id - Obtener producto por ID
router.get('/:id', validateId, catalogController.getProductById);

// POST /api/catalog - Crear nuevo producto (para admin)
router.post('/', catalogController.createProduct);

// PUT /api/catalog/:id - Actualizar producto (para admin)
router.put('/:id', validateId, catalogController.updateProduct);

// DELETE /api/catalog/:id - Eliminar producto (para admin)
router.delete('/:id', validateId, catalogController.deleteProduct);

module.exports = router;