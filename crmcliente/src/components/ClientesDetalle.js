import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ClientesDetalle = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    axios.get(`/api/customers/${id}`)
      .then(response => setCustomer(response.data))
      .catch(error => console.error(error));
  }, [id]);

  if (!customer) return <div>Loading...</div>;

  return (
    <div>
      <h1>{customer.name}</h1>
      <p>Email: {customer.email}</p>
      <p>Phone: {customer.phone}</p>
      {/* Add more customer details here */}
    </div>
  );
};

export default ClientesDetalle;