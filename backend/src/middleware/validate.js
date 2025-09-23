// Middleware para validaciones

// Validar registro de usuario
const validateRegister = (req, res, next) => {
  const { name, password } = req.body;

  // Validar que los campos estén presentes
  if (!name || !password) {
    return res.status(400).json({
      success: false,
      message: 'Nombre y contraseña son requeridos'
    });
  }

  // Validar longitud del nombre
  if (name.length < 3 || name.length > 50) {
    return res.status(400).json({
      success: false,
      message: 'El nombre debe tener entre 3 y 50 caracteres'
    });
  }

  // Validar longitud de la contraseña
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'La contraseña debe tener al menos 6 caracteres'
    });
  }

  next();
};

// Validar login
const validateLogin = (req, res, next) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return res.status(400).json({
      success: false,
      message: 'Nombre y contraseña son requeridos'
    });
  }

  next();
};

// Validar datos de venta
const validateSale = (req, res, next) => {
  const { user_id, products } = req.body;

  // Validar user_id
  if (!user_id || isNaN(user_id)) {
    return res.status(400).json({
      success: false,
      message: 'user_id es requerido y debe ser un número'
    });
  }

  // Validar productos
  if (!products || !Array.isArray(products) || products.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Se requiere al menos un producto'
    });
  }

  // Validar estructura de cada producto
  for (let product of products) {
    if (!product.id || isNaN(product.id)) {
      return res.status(400).json({
        success: false,
        message: 'Cada producto debe tener un id válido'
      });
    }

    if (!product.quantity || isNaN(product.quantity) || product.quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Cada producto debe tener una cantidad válida mayor a 0'
      });
    }
  }

  next();
};

// Validar parámetros de ID
const validateId = (req, res, next) => {
  const id = req.params.id;

  if (!id || isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: 'ID inválido'
    });
  }

  next();
};

// Middleware para manejar errores 404
const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint no encontrado'
  });
};

// Middleware para manejar errores generales
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Error de validación de SQLite
  if (err.code === 'SQLITE_CONSTRAINT') {
    return res.status(400).json({
      success: false,
      message: 'Error de restricción en la base de datos'
    });
  }

  // Error de usuario no encontrado
  if (err.message === 'Usuario no encontrado') {
    return res.status(404).json({
      success: false,
      message: 'Usuario no encontrado'
    });
  }

  // Error genérico del servidor
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor'
  });
};

// Middleware de logging (opcional)
const logger = (req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateSale,
  validateId,
  notFound,
  errorHandler,
  logger
};