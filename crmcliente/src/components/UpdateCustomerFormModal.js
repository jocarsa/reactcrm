import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';

Modal.setAppElement('#root'); // Set the root element for accessibility

const UpdateCustomerFormModal = ({ isOpen, onRequestClose, customer }) => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');

  useEffect(() => {
    if (customer) {
      setNombre(customer.nombre);
      setEmail(customer.email);
      setTelefono(customer.telefono);
    }
  }, [customer]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:5000/clientes/${customer.id}`, { nombre, email, telefono })
      .then(response => {
        console.log(response.data);
        onRequestClose(); // Close the modal
      })
      .catch(error => console.error(error));
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <h2>Modificar cliente</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Telefono:</label>
          <input type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
        </div>
        <button type="submit">Modificar</button>
        <button type="button" onClick={onRequestClose}>Cerrar</button>
      </form>
    </Modal>
  );
};

export default UpdateCustomerFormModal;
