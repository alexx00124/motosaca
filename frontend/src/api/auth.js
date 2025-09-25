import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth';

// Configurar axios con interceptors
axios.defaults.baseURL = 'http://localhost:3000/api';

// Interceptor para agregar token automáticamente
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Función para registrar usuario
export const register = async (userData) => {
  try {
    const response = await axios.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error de conexión' };
  }
};

// Función para login
export const login = async (credentials) => {
  try {
    const response = await axios.post('/auth/login', credentials);
    console.log('Respuesta de login:', response.data);
    
    const { data } = response.data;
    
    // Guardar datos en localStorage
    if (data && data.user_id) {
      const userData = {
        user_id: data.user_id,
        name: data.name
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      // Simular token JWT (en producción vendría del backend)
      localStorage.setItem('token', `token_${data.user_id}_${Date.now()}`);
      
      console.log('Usuario guardado:', userData);
    } else {
      console.error('Datos de usuario inválidos:', data);
    }
    
    return response.data;
  } catch (error) {
    console.error('Error en login:', error.response?.data || error);
    throw error.response?.data || { message: 'Error de conexión' };
  }
};

// Función para logout
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/';
};

// Función para verificar si está autenticado
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  return !!(token && user);
};

// Función para obtener usuario actual
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// Función para obtener usuario por ID
export const getUser = async (userId) => {
  try {
    const response = await axios.get(`/auth/user/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error de conexión' };
  }
};