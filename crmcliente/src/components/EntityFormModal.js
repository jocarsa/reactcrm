// components/EntityFormModal.js
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { create, update } from '../services/apiService';

Modal.setAppElement('#root'); // Set the root element for accessibility

const sampleSchema = {
  nombre: '',
  email: '',
  telefono: ''
  // Add other fields as necessary
};

const EntityFormModal = ({ entity, isOpen, onRequestClose, onFormSubmit, record }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (record) {
      setFormData(record);
    } else {
      setFormData(sampleSchema); // Initialize with sample schema
    }
  }, [record]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
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
        {Object.keys(formData).map(key => (
          <div key={key}>
            <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
            <input
              type="text"
              name={key}
              value={formData[key] || ''}
              onChange={handleChange}
              required
            />
          </div>
        ))}
        <button type="submit">{record ? 'Update' : 'Create'}</button>
        <button type="button" onClick={onRequestClose}>Close</button>
      </form>
    </Modal>
  );
};

export default EntityFormModal;
