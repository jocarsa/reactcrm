import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ClientesDetalle = () => {
  const { id } = useParams();
  const [cliente, setCliente] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/clientes/${id}`)
      .then(response => {
        console.log(response.data);
        setCliente(response.data[0]);
      })
      .catch(error => console.error(error));
  }, [id]);

  if (!cliente) return <div>Cargando...</div>;

  return (
    <div>
      <h1>Detalles del Cliente</h1>
      {Object.keys(cliente).filter(key => key !== 'id').map(key => (
        <p key={key}>
          <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {cliente[key]}
        </p>
      ))}
    </div>
  );
};

export default ClientesDetalle;
