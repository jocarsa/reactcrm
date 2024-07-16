import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const DeleteCustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5000/deleteclientes/${id}`)
      .then(response => {
        console.log('Customer deleted:', response.data);
        navigate('/clientes'); // Redirect to the customer list after deletion
      })
      .catch(error => console.error('There was an error deleting the customer:', error));
  }, [id, navigate]);

  return (
    <div>
      <p>Deleting customer...</p>
    </div>
  );
};

export default DeleteCustomerDetails;
