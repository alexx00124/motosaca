import axios from 'axios';

// Función para crear una nueva venta
export const createSale = async (saleData) => {
  try {
    console.log('Enviando datos de venta:', saleData);
    const response = await axios.post('/sales', saleData);
    console.log('Respuesta del servidor:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error en createSale:', error.response?.data || error);
    throw error.response?.data || { message: 'Error de conexión' };
  }
};

// Función para obtener todas las ventas
export const getSales = async () => {
  try {
    const response = await axios.get('/sales');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error de conexión' };
  }
};

// Función para obtener una venta por ID
export const getSale = async (saleId) => {
  try {
    const response = await axios.get(`/sales/${saleId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error de conexión' };
  }
};

// Función para obtener ventas de un usuario
export const getSalesByUser = async (userId) => {
  try {
    const response = await axios.get(`/sales/user/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error de conexión' };
  }
};

// Función para obtener estadísticas de ventas
export const getSalesStats = async () => {
  try {
    const response = await axios.get('/sales/stats');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error de conexión' };
  }
};