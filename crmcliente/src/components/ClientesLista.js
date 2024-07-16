import React, { useEffect, useState } from 'react';
import './ClientesLista.css'
import axios from 'axios';
import { Link } from 'react-router-dom';
import CustomerFormModal from './CustomerFormModal'; // Import the modal component
import UpdateCustomerFormModal from './UpdateCustomerFormModal'; // Import the update modal component

const ClientesLista = () => {
  const [customers, setCustomers] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [updateModalIsOpen, setUpdateModalIsOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/clientes')
      .then(response => setCustomers(response.data))
      .catch(error => console.error(error));
  }, []);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const openUpdateModal = (customer) => {
    setSelectedCustomer(customer);
    setUpdateModalIsOpen(true);
  };
  const closeUpdateModal = () => setUpdateModalIsOpen(false);

  return (
    <div>
      <div>
        <button onClick={openModal}>Crear nuevo cliente</button>
        <CustomerFormModal isOpen={modalIsOpen} onRequestClose={closeModal} />
      </div>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Telefono</th>
            <th className="operaciones">Operaciones</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(customer => (
            <tr key={customer.id}>
              <td>{customer.nombre}</td>
              <td>{customer.email}</td>
              <td>{customer.telefono}</td>
              <td>
                <Link to={`/customers/${customer.id}`}>Ver cliente</Link>
                <Link to={`/deletecustomers/${customer.id}`}>Eliminar cliente</Link>
                <Link onClick={() => openUpdateModal(customer)}>Modificar cliente</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <UpdateCustomerFormModal isOpen={updateModalIsOpen} onRequestClose={closeUpdateModal} customer={selectedCustomer} />
    </div>
  );
};

export default ClientesLista;
