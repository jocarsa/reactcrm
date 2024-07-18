// components/EntityFormModal.js
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { create, update, getSchema, getForeignKeys } from '../services/apiService';
import { mapMySQLTypeToHTMLInputType } from '../utils/fieldTypeMapper';
import axios from 'axios';

Modal.setAppElement('#root'); // Set the root element for accessibility

const EntityFormModal = ({ entity, isOpen, onRequestClose, onFormSubmit, record }) => {
  const [formData, setFormData] = useState({});
  const [schema, setSchema] = useState({});
  const [foreignKeyData, setForeignKeyData] = useState({});

  useEffect(() => {
    const fetchSchema = async () => {
      try {
        const data = await getSchema(entity);
        setSchema(data);
        if (!record) {
          const initialFormData = {};
          Object.keys(data).forEach(key => {
            initialFormData[key] = '';
          });
          setFormData(initialFormData);
        }
      } catch (error) {
        console.error('Error fetching schema:', error);
      }
    };

    fetchSchema();
  }, [entity]);

  useEffect(() => {
    if (record) {
      setFormData(record);
    } else {
      const initialFormData = {};
      Object.keys(schema).forEach(key => {
        initialFormData[key] = '';
      });
      setFormData(initialFormData);
    }
  }, [record, schema]);

  useEffect(() => {
    const fetchForeignKeyData = async () => {
      const foreignKeys = await getForeignKeys(entity);
      const foreignKeyPromises = foreignKeys.map(async fk => {
        const response = await axios.get(`http://localhost:5000/related/${entity}/${fk.COLUMN_NAME}`);
        return { [fk.COLUMN_NAME]: response.data };
      });
      const foreignKeyDataArray = await Promise.all(foreignKeyPromises);
      const foreignKeyData = Object.assign({}, ...foreignKeyDataArray);
      setForeignKeyData(foreignKeyData);
    };

    fetchForeignKeyData();
  }, [entity, schema]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (record) {
      await update(entity, record.id, formData);
    } else {
      await create(entity, formData);
    }
    onFormSubmit();
    onRequestClose();
  };

  const isForeignKey = (key) => Object.keys(foreignKeyData).includes(key);

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <h2>{record ? 'Update' : 'Create'} {entity}</h2>
      <form onSubmit={handleSubmit}>
        {Object.keys(schema).map(key => (
          <div key={key}>
            <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
            {isForeignKey(key) ? (
              <select
                name={key}
                value={formData[key] || ''}
                onChange={handleChange}
                required
              >
                <option value="">Select...</option>
                {foreignKeyData[key].map(option => (
                  <option key={option.id} value={option.id}>
                    {option.nombre}
                  </option>
                ))}
              </select>
            ) : mapMySQLTypeToHTMLInputType(schema[key]) === 'textarea' ? (
              <textarea
                name={key}
                value={formData[key] || ''}
                onChange={handleChange}
                required
              />
            ) : (
              <input
                type={mapMySQLTypeToHTMLInputType(schema[key])}
                name={key}
                value={formData[key] || ''}
                onChange={handleChange}
                required
              />
            )}
          </div>
        ))}
        <button type="submit">{record ? 'Update' : 'Create'}</button>
        <button type="button" onClick={onRequestClose}>Close</button>
      </form>
    </Modal>
  );
};

export default EntityFormModal;
