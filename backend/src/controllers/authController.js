const User = require('../models/User');

// Registrar nuevo usuario
const register = async (req, res) => {
  try {
    const { name, password } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findByName(name);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'El nombre de usuario ya está en uso'
      });
    }

    // Crear nuevo usuario
    const newUser = await User.create(name, password);

    res.status(201).json({
      success: true,
      data: {
        user_id: newUser.id,
        name: newUser.name
      },
      message: 'Usuario registrado exitosamente'
    });

  } catch (error) {
    console.error('Error en register:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Login de usuario
const login = async (req, res) => {
  try {
    const { name, password } = req.body;

    // Buscar usuario por nombre
    const user = await User.findByName(name);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar contraseña
    const isValidPassword = await user.verifyPassword(password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Login exitoso
    res.status(200).json({
      success: true,
      data: {
        user_id: user.id,
        name: user.name
      },
      message: 'Login exitoso'
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener información del usuario (opcional)
const getUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user_id: user.id,
        name: user.name
      }
    });

  } catch (error) {
    console.error('Error en getUser:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

module.exports = {
  register,
  login,
  getUser
};