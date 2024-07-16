import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

Modal.setAppElement('#root'); // Set the root element for accessibility

const CustomerFormModal = ({ isOpen, onRequestClose }) => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/clientes', { nombre, email, telefono })
      .then(response => {
        console.log(response.data);
        navigate('/clientes'); // Redirect to the customer list
        onRequestClose(); // Close the modal
      })
      .catch(error => console.error(error));
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <h2>Crear nuevo cliente</h2>
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
        <button type="submit">Crear</button>
        <button type="button" onClick={onRequestClose}>Cerrar</button>
      </form>
    </Modal>
  );
};

export default CustomerFormModal;
