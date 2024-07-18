// components/EntityFormModal.js
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { create, update, getSchema, getForeignKeys, getRelatedData } from '../services/apiService';

Modal.setAppElement('#root'); // Set the root element for accessibility

const EntityFormModal = ({ entity, isOpen, onRequestClose, onFormSubmit, record }) => {
  const [formData, setFormData] = useState({});
  const [schema, setSchema] = useState({});
  const [foreignKeys, setForeignKeys] = useState([]);
  const [relatedData, setRelatedData] = useState({});

  useEffect(() => {
    const fetchSchema = async () => {
      try {
        const schemaData = await getSchema(entity);
        setSchema(schemaData);

        const foreignKeysData = await getForeignKeys(entity);
        setForeignKeys(foreignKeysData);

        const relatedDataPromises = foreignKeysData.map(fk =>
          getRelatedData(entity, fk.COLUMN_NAME)
        );
        const relatedDataResults = await Promise.all(relatedDataPromises);
        const relatedDataMap = relatedDataResults.reduce((acc, data, idx) => {
          acc[foreignKeysData[idx].COLUMN_NAME] = data;
          return acc;
        }, {});
        setRelatedData(relatedDataMap);
      } catch (error) {
        console.error('Error fetching schema:', error);
      }
    };

    if (isOpen) {
      fetchSchema();
      if (record) {
        setFormData(record);
      } else {
        setFormData({});
      }
    }
  }, [entity, isOpen, record]);

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
        {Object.keys(schema).map(key => (
          <div key={key}>
            <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
            {foreignKeys.some(fk => fk.COLUMN_NAME === key) ? (
              <select
                name={key}
                value={formData[key] || ''}
                onChange={handleChange}
                required
              >
                {relatedData[key]?.map(option => (
                  <option key={option.id} value={option.id}>{option.nombre}</option>
                ))}
              </select>
            ) : schema[key] === 'text' ? (
              <textarea
                name={key}
                value={formData[key] || ''}
                onChange={handleChange}
                required
              />
            ) : (
              <input
                type={schema[key] === 'date' ? 'date' : 'text'}
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
