// services/apiService.js
import apiClient from './apiClient';

export const getAll = async (entity) => {
  const response = await apiClient.get(`/${entity}`);
  return response.data;
};

export const getById = async (entity, id) => {
  const response = await apiClient.get(`/${entity}/${id}`);
  return response.data;
};

export const create = async (entity, data) => {
  const response = await apiClient.post(`/${entity}`, data);
  return response.data;
};

export const update = async (entity, id, data) => {
  const response = await apiClient.put(`/${entity}/${id}`, data);
  return response.data;
};

export const remove = async (entity, id) => {
  const response = await apiClient.delete(`/${entity}/${id}`);
  return response.data;
};

export const getSchema = async (entity) => {
  const response = await apiClient.get(`/schema/${entity}`);
  return response.data;
};

export const getForeignKeys = async (entity) => {
  const response = await apiClient.get(`/foreignkeys/${entity}`);
  return response.data;
};

export const getRelatedData = async (entity, foreignKey) => {
  const response = await apiClient.get(`/related/${entity}/${foreignKey}`);
  return response.data;
};