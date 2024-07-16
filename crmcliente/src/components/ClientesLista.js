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
    <table>
      <thead>
            <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Telefono</th>
                <th>Operaciones</th>
          </tr>
      </thead>
      <tbody>
        {customers.map(customer => (
        <tr key={customer.id}>
            <td>{customer.nombre}</td>
            <td>{customer.email}</td>
            <td>{customer.telefono}</td>
      <td>
          <Link to={`/customers/${customer.id}`}> Ver cliente </Link>
        </td>
        </tr>
      ))}
      </tbody>
      </table>
    
  );
};

export default ClientesLista;
