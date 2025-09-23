const Sale = require('../models/Sale');
const Catalog = require('../models/Catalog');
const User = require('../models/User');

// Crear nueva venta
const createSale = async (req, res) => {
  try {
    const { user_id, products } = req.body;

    // Verificar que el usuario existe
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Obtener IDs únicos de productos
    const productIds = [...new Set(products.map(p => p.id))];
    
    // Verificar que todos los productos existen en el catálogo
    const catalogProducts = await Catalog.findByIds(productIds);
    
    if (catalogProducts.length !== productIds.length) {
      return res.status(404).json({
        success: false,
        message: 'Uno o más productos no existen en el catálogo'
      });
    }

    // Crear un mapa de productos del catálogo para fácil acceso
    const catalogMap = {};
    catalogProducts.forEach(product => {
      catalogMap[product.id] = product;
    });

    // Calcular el total basado en los precios del catálogo
    let total_price = 0;
    const saleDetails = [];

    for (let product of products) {
      const catalogProduct = catalogMap[product.id];
      const subtotal = catalogProduct.price * product.quantity;
      total_price += subtotal;

      saleDetails.push({
        id: catalogProduct.id,
        name: catalogProduct.name,
        price: catalogProduct.price,
        quantity: product.quantity,
        subtotal: subtotal
      });
    }

    // Redondear a 2 decimales
    total_price = Math.round(total_price * 100) / 100;

    // Crear la venta en la base de datos
    const newSale = await Sale.create(user_id, total_price);

    res.status(201).json({
      success: true,
      data: {
        sale_id: newSale.id,
        user_id: newSale.user_id,
        total_price: newSale.total_price,
        products: saleDetails
      },
      message: 'Venta registrada exitosamente'
    });

  } catch (error) {
    console.error('Error en createSale:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener todas las ventas
const getAllSales = async (req, res) => {
  try {
    const sales = await Sale.getAll();

    res.status(200).json({
      success: true,
      data: sales,
      message: 'Ventas obtenidas exitosamente'
    });

  } catch (error) {
    console.error('Error en getAllSales:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener ventas por usuario
const getSalesByUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Verificar que el usuario existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    const sales = await Sale.getByUserId(userId);

    res.status(200).json({
      success: true,
      data: sales,
      message: 'Ventas del usuario obtenidas exitosamente'
    });

  } catch (error) {
    console.error('Error en getSalesByUser:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener una venta por ID
const getSaleById = async (req, res) => {
  try {
    const saleId = req.params.id;

    const sale = await Sale.findById(saleId);
    if (!sale) {
      return res.status(404).json({
        success: false,
        message: 'Venta no encontrada'
      });
    }

    res.status(200).json({
      success: true,
      data: sale,
      message: 'Venta obtenida exitosamente'
    });

  } catch (error) {
    console.error('Error en getSaleById:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener estadísticas de ventas
const getSalesStats = async (req, res) => {
  try {
    const stats = await Sale.getStats();

    res.status(200).json({
      success: true,
      data: {
        total_sales: stats.total_sales || 0,
        total_revenue: stats.total_revenue || 0,
        average_sale: stats.average_sale || 0,
        highest_sale: stats.highest_sale || 0,
        lowest_sale: stats.lowest_sale || 0
      },
      message: 'Estadísticas obtenidas exitosamente'
    });

  } catch (error) {
    console.error('Error en getSalesStats:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

module.exports = {
  createSale,
  getAllSales,
  getSalesByUser,
  getSaleById,
  getSalesStats
};