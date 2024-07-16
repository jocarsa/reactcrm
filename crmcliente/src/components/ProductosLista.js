import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ProductosLista = () => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/productos')
      .then(response => setProductos(response.data))
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
        {productos.map(producto => (
        <tr key={producto.id}>
            <td>{producto.nombre}</td>
            <td>{producto.descripcion}</td>
            <td>{producto.precio}</td>
      <td>
          <Link to={`/productos/${producto.id}`}> Ver producto </Link>
        </td>
        </tr>
      ))}
      </tbody>
      </table>
    
  );
};

export default ProductosLista;
