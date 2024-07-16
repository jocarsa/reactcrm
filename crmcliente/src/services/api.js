import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', // Change this to your API's base URL
});

export const getCustomers = () => api.get('/clientes');
export const getCustomer = (id) => api.get(`/clientes/${id}`);
export const createCustomer = (data) => api.post('/clientes', data);
export const updateCustomer = (id, data) => api.put(`/clientes/${id}`, data);
export const deleteCustomer = (id) => api.delete(`/clientes/${id}`);

export default api;