import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', // Change this to your API's base URL
});

export const getCustomers = () => api.get('/clientes');
export const getProductos = () => api.get('/productos');

export default api;