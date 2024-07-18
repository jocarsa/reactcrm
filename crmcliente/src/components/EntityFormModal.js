// components/EntityFormModal.js
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { create, update, getSchema } from '../services/apiService';
import { mapMySQLTypeToHTMLInputType } from '../utils/fieldTypeMapper';

Modal.setAppElement('#root'); // Set the root element for accessibility

const EntityFormModal = ({ entity, isOpen, onRequestClose, onFormSubmit, record }) => {
  const [formData, setFormData] = useState({});
  const [schema, setSchema] = useState({});

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

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <h2>{record ? 'Update' : 'Create'} {entity}</h2>
      <form onSubmit={handleSubmit}>
        {Object.keys(schema).map(key => (
          <div key={key}>
            <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
            {mapMySQLTypeToHTMLInputType(schema[key]) === 'textarea' ? (
              <textarea
                name={key}
                value={formData[key] || ''}
                onChange={handleChange}
                required
              />
            ) : mapMySQLTypeToHTMLInputType(schema[key]) === 'select' ? (
              <select
                name={key}
                value={formData[key] || ''}
                onChange={handleChange}
                required
              >
                {/* Add options dynamically if needed */}
              </select>
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
