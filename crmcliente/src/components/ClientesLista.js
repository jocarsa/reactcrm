import React, { useEffect, useState } from 'react';
import './ClientesLista.css';
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

  const renderTableHeaders = () => {
    if (customers.length === 0) return null;
    const headers = Object.keys(customers[0]).filter(key => key !== 'id');
    return (
      <tr>
        {headers.map(header => (
          <th key={header}>{header.charAt(0).toUpperCase() + header.slice(1)}</th>
        ))}
        <th className="operaciones">Operaciones</th>
      </tr>
    );
  };

  const renderTableRows = () => {
    return customers.map(customer => (
      <tr key={customer.id}>
        {Object.keys(customer).filter(key => key !== 'id').map(key => (
          <td key={key}>{customer[key]}</td>
        ))}
        <td>
          <Link to={`/customers/${customer.id}`}>Ver cliente</Link>
          <Link to={`/deletecustomers/${customer.id}`}>Eliminar cliente</Link>
          <button onClick={() => openUpdateModal(customer)}>Modificar cliente</button>
        </td>
      </tr>
    ));
  };

  return (
    <div>
      <div>
        <button onClick={openModal}>Crear nuevo cliente</button>
        <CustomerFormModal isOpen={modalIsOpen} onRequestClose={closeModal} />
      </div>
      <table>
        <thead>
          {renderTableHeaders()}
        </thead>
        <tbody>
          {renderTableRows()}
        </tbody>
      </table>
      <UpdateCustomerFormModal isOpen={updateModalIsOpen} onRequestClose={closeUpdateModal} customer={selectedCustomer} />
    </div>
  );
};

export default ClientesLista;
