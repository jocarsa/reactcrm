// services/apiService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const getAll = async (entity) => {
  const response = await axios.get(`${API_URL}/${entity}`);
  return response.data;
};

export const getOne = async (entity, id) => {
  const response = await axios.get(`${API_URL}/${entity}/${id}`);
  return response.data;
};

export const create = async (entity, data) => {
  const response = await axios.post(`${API_URL}/${entity}`, data);
  return response.data;
};

export const update = async (entity, id, data) => {
  const response = await axios.put(`${API_URL}/${entity}/${id}`, data);
  return response.data;
};

export const remove = async (entity, id) => {
  const response = await axios.delete(`${API_URL}/${entity}/${id}`);
  return response.data;
};
