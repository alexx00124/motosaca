const Catalog = require('../models/Catalog');

// Obtener todos los productos del catálogo
const getAllProducts = async (req, res) => {
  try {
    const products = await Catalog.getAll();

    res.status(200).json({
      success: true,
      data: products,
      message: 'Productos obtenidos exitosamente'
    });

  } catch (error) {
    console.error('Error en getAllProducts:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener un producto por ID
const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await Catalog.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: product,
      message: 'Producto obtenido exitosamente'
    });

  } catch (error) {
    console.error('Error en getProductById:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Crear nuevo producto (opcional para admin)
const createProduct = async (req, res) => {
  try {
    const { name, price, description, image } = req.body;

    // Validaciones básicas
    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: 'Nombre y precio son requeridos'
      });
    }

    if (isNaN(price) || price <= 0) {
      return res.status(400).json({
        success: false,
        message: 'El precio debe ser un número mayor a 0'
      });
    }

    const newProduct = await Catalog.create(name, price, description, image);

    res.status(201).json({
      success: true,
      data: newProduct,
      message: 'Producto creado exitosamente'
    });

  } catch (error) {
    console.error('Error en createProduct:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Actualizar producto (opcional para admin)
const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, price, description, image } = req.body;

    // Validaciones básicas
    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: 'Nombre y precio son requeridos'
      });
    }

    if (isNaN(price) || price <= 0) {
      return res.status(400).json({
        success: false,
        message: 'El precio debe ser un número mayor a 0'
      });
    }

    const updatedProduct = await Catalog.update(productId, name, price, description, image);

    res.status(200).json({
      success: true,
      data: updatedProduct,
      message: 'Producto actualizado exitosamente'
    });

  } catch (error) {
    console.error('Error en updateProduct:', error);
    
    if (error.message === 'Producto no encontrado') {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Eliminar producto (opcional para admin)
const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    await Catalog.delete(productId);

    res.status(200).json({
      success: true,
      message: 'Producto eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error en deleteProduct:', error);

    if (error.message === 'Producto no encontrado') {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};