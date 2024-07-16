import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ClientesLista = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/clientes')
      .then(response => setCustomers(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <ul>
      {customers.map(customer => (
        <li key={customer.id}>
          <Link to={`/customers/${customer.id}`}>{customer.nombre} - {customer.email}</Link>
        </li>
      ))}
    </ul>
  );
};

export default ClientesLista;
