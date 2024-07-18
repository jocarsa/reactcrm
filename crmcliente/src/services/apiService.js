// services/apiService.js
import axios from 'axios';

export const getAll = async (entity) => {
  const response = await axios.get(`http://localhost:5000/${entity}`);
  return response.data;
};

export const getById = async (entity, id) => {
  const response = await axios.get(`http://localhost:5000/${entity}/${id}`);
  return response.data;
};

export const create = async (entity, data) => {
  const response = await axios.post(`http://localhost:5000/${entity}`, data);
  return response.data;
};

export const update = async (entity, id, data) => {
  const response = await axios.put(`http://localhost:5000/${entity}/${id}`, data);
  return response.data;
};

export const remove = async (entity, id) => {
  const response = await axios.delete(`http://localhost:5000/${entity}/${id}`);
  return response.data;
};

export const getSchema = async (entity) => {
  const response = await axios.get(`http://localhost:5000/schema/${entity}`);
  return response.data;
};
