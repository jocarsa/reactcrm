import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';

const ClientesLista = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    axios.get('/api/customers')
      .then(response => setCustomers(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <List>
      {customers.map(customer => (
        <ListItem button component={Link} to={`/customers/${customer.id}`} key={customer.id}>
          <ListItemText primary={customer.name} />
        </ListItem>
      ))}
    </List>
  );
};

export default ClientesLista;