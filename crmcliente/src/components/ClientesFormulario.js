import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import axios from 'axios';

const ClientesFormulario = ({ customer }) => {
  const [formData, setFormData] = useState(customer || { name: '', email: '', phone: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (customer) {
      axios.put(`/api/customers/${customer.id}`, formData)
        .then(response => console.log(response))
        .catch(error => console.error(error));
    } else {
      axios.post('/api/customers', formData)
        .then(response => console.log(response))
        .catch(error => console.error(error));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Phone"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <Button type="submit" variant="contained" color="primary">
        {customer ? 'Update Customer' : 'Add Customer'}
      </Button>
    </form>
  );
};

export default ClientesFormulario;