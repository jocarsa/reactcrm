import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { create, update, getSchema, getForeignKeys, getRelatedData } from '../services/apiService';
import './EntityFormModal.css';

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
    try {
      const dataToSubmit = { ...formData };
      delete dataToSubmit.id; // Remove the id from the data before submission
      console.log('Submitting data:', dataToSubmit);
      if (record) {
        await update(entity, record.id, dataToSubmit);
      } else {
        await create(entity, dataToSubmit);
      }
      onFormSubmit();
      onRequestClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <h2>{record ? 'Update' : 'Create'} {entity}</h2>
      <form onSubmit={handleSubmit}>
        <table>
          <tbody>
            {Object.keys(schema).filter(key => key !== 'id').map(key => (
              <tr key={key}>
                <th><label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label></th>
                <td>
                  {foreignKeys.some(fk => fk.COLUMN_NAME === key) ? (
                    <select
                      name={key}
                      value={formData[key] || ''}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select {key.charAt(0).toUpperCase() + key.slice(1)}</option>
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="btn btn-create" type="submit">{record ? 'Update' : 'Create'}</button>
        <button  className="btn btn-delete" type="button" onClick={onRequestClose}>Close</button>
      </form>
    </Modal>
  );
};

export default EntityFormModal;
