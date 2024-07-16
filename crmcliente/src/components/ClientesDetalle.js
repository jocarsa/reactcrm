import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ClientesDetalle = () => {
  const { id } = useParams();
  const [cliente, setCliente] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/clientes/${id}`)
      .then(function(response){
        console.log(response.data)
        setCliente(response.data[0])
        console.log(cliente)
    } )
      .catch(error => console.error(error));
  }, [id]);

  if (!cliente) return <div>Cargando...</div>;

  return (
    <div>
      <h1>{cliente.nombre}</h1>
      <p>Email: {cliente.email}</p>
      <p>Telefono: {cliente.telefono}</p>
      {/* Add more customer details here */}
    </div>
  );
};

export default ClientesDetalle;