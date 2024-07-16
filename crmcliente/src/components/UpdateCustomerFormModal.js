import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './UpdateCustomerFormModal.css';
import axios from 'axios';

Modal.setAppElement('#root'); // Set the root element for accessibility

const UpdateCustomerFormModal = ({ isOpen, onRequestClose, customer }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (customer) {
      const initialData = Object.keys(customer).reduce((acc, key) => {
        if (key !== 'id') {
          acc[key] = customer[key];
        }
        return acc;
      }, {});
      setFormData(initialData);
    }
  }, [customer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:5000/clientes/${customer.id}`, formData)
      .then(response => {
        console.log(response.data);
        onRequestClose(); // Close the modal
      })
      .catch(error => console.error(error));
  };

  if (!customer) return null;

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <h2>Modificar cliente</h2>
      <form onSubmit={handleSubmit}>
        {Object.keys(formData).map(key => (
          <div key={key}>
            <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
            <input
              type="text"
              name={key}
              value={formData[key]}
              onChange={handleChange}
              required
            />
          </div>
        ))}
        <button type="submit">Modificar</button>
        <button type="button" onClick={onRequestClose}>Cerrar</button>
      </form>
    </Modal>
  );
};

export default UpdateCustomerFormModal;
