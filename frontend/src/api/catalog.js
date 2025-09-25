import axios from 'axios';

// Función para obtener todos los productos del catálogo
export const getCatalog = async () => {
  try {
    const response = await axios.get('/catalog');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error de conexión' };
  }
};

// Función para obtener un producto por ID
export const getProduct = async (productId) => {
  try {
    const response = await axios.get(`/catalog/${productId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error de conexión' };
  }
};

// Función para crear un producto (admin)
export const createProduct = async (productData) => {
  try {
    const response = await axios.post('/catalog', productData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error de conexión' };
  }
};

// Función para actualizar un producto (admin)
export const updateProduct = async (productId, productData) => {
  try {
    const response = await axios.put(`/catalog/${productId}`, productData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error de conexión' };
  }
};

// Función para eliminar un producto (admin)
export const deleteProduct = async (productId) => {
  try {
    const response = await axios.delete(`/catalog/${productId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error de conexión' };
  }
};